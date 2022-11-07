import express from "express";
import cors from "cors";
import Shopify, { ApiVersion, RequestReturn } from "@shopify/shopify-api";
import dotenv from "dotenv";
import { doc, setDoc } from "firebase/firestore";
import { database } from "shared/firestore";
import { CategoryType, Product, ProductVariant } from "shared/types";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET_KEY,
  SHOPIFY_API_ACCESS_TOKEN,
  SHOPIFY_SCOPES,
  SHOPIFY_SHOP,
  SHOPIFY_HOST,
  SHOPIFY_HOST_SCHEME,
} = process.env;

Shopify.Context.initialize({
  API_KEY: SHOPIFY_API_KEY!,
  API_SECRET_KEY: SHOPIFY_API_SECRET_KEY!,
  SCOPES: [SHOPIFY_SCOPES!],
  HOST_NAME: SHOPIFY_HOST!.replace(/https?:\/\//, ""),
  HOST_SCHEME: SHOPIFY_HOST_SCHEME!,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October22,
});

// can upload only certain products using the ?ids=[id1,id2] syntax
app.post("/products/upload-to-database", async (req, res) => {
  let ids = "";
  if (req.query.ids) ids = req.query.ids.toString().replace(/\[\]/g, "");

  const client = new Shopify.Clients.Rest(SHOPIFY_SHOP!, SHOPIFY_API_ACCESS_TOKEN);

  // gets the amount of products
  const productsCount = (
    await client.get<{ count: number }>({
      path: "products/count",
    })
  ).body.count;

  // get every product
  const products: any[] = [];
  const loopCount = Math.ceil(productsCount / 250);
  for (let i = 0; i < loopCount; i++) {
    const productsResponse = await client.get<{ products: any[] }>({
      path: "products",
      query: { limit: i === loopCount - 1 ? productsCount % 250 : 250, ids: ids },
    });

    // check that the call limit hasn't been reached. if it has, retry after the time specified in the header has elapsed
    const retryAfterSeconds = parseInt(productsResponse.headers.get("Retry-After") ?? "NaN");
    if (retryAfterSeconds) {
      await new Promise((resolve) => setTimeout(resolve, retryAfterSeconds * 1000));
    }

    products.push(...productsResponse.body.products);
  }

  const productTitles: { id: string; title: string }[] = [];

  // add every product to the database
  const uploadPromises: Promise<any>[] = [];
  for (let i = 0; i < products.length; i++) {
    type asd = keyof typeof CategoryType;

    const type = (products[i].tags as string)
      .replace(/\s/g, "")
      .split(",")
      .find((tag) => [].some((type) => type === tag));

    const product: Omit<Product, "id" | "timesSold"> = {
      title: products[i].title,
      type: products[i].product_type,
      createdAt: products[i].created_at,
      updatedAt: products[i].updated_at,
      active: products[i].status === "active" ? true : false,
      tags: (products[i].title as string).toLowerCase().split(" "),
      options: products[i].options.map((option: any) => ({ name: option.name, values: option.values })),
      imageCardId: (products[i].image.id as number).toString(),
      vendor: products[i].vendor,
      totalQuantity: (products[i].variants as any[]).reduce((acc, cur) => acc + cur.inventory_quantity, 0),
      price: products[i].variants[0].price,
    };

    const productVariants: Omit<ProductVariant, "id">[] = (products[i].variants as any[]).map((variant, index) => ({
      quantity: variant.inventory_quantity,
      options: product.options.map((option) => ({
        name: option.name,
        value: option.values.find((value) => (products[i].variants[0].title as string).replace(/\s/g, "").split("/").includes(value))!,
      })),
      imageIds: (products[i].images as any[])
        .filter((image) => (image.variant_ids as any[]).includes(variant.id))
        .reduce((acc, cur) => acc.push((cur as number).toString()), [] as string[]),
    }));

    const productRef = doc(database, "products", (products[i].id as number).toString());
    uploadPromises.push(setDoc(productRef, product));
    for (let ii = 0; ii < productVariants.length; ii++) {
      const productVariantRef = doc(database, "products", productRef.id, "variants", (products[i].variants[ii].id as number).toString());
      uploadPromises.push(setDoc(productVariantRef, productVariants[ii]));
    }
  }

  await Promise.all(uploadPromises);

  res.status(200).send("Upload completed");
});

app.post("/products/update-tags-with-options", async (req, res) => {
  const restClient = new Shopify.Clients.Rest(SHOPIFY_SHOP!, SHOPIFY_API_ACCESS_TOKEN);

  // gets the amount of products
  const productsCount = (
    await restClient.get<{ count: number }>({
      path: "products/count",
    })
  ).body.count;

  const graphqlClient = new Shopify.Clients.Graphql(SHOPIFY_SHOP!, SHOPIFY_API_ACCESS_TOKEN);

  // get every product (need to factor in hitting the limit and waiting for it to recharge)
  let products: any[] = [];
  let loopAmount = Math.ceil(productsCount / 250);
  for (let index = 0; index < loopAmount; index++) {
    let productsQuery = await graphqlClient.query<{ data: any }>({
      data: `{
        products(first: ${index + 1 === loopAmount ? productsCount % 250 : 250}) {
          edges {
            node {
              id,
              tags,
              options {
                name,
                values
              }
            }
          }
        }
      }`,
    });
    products.push(...productsQuery.body.data.products.edges);
  }

  // adds tags to each product based on their options
  const productUpdatePromises: Promise<RequestReturn>[] = [];
  for (const product of products) {
    let tags = (product.node.tags as string[]).join(",").replace(/(color|material|size).*?(,|$)/g, "");
    (product.node.options as { name: string; values: string[] }[]).forEach((option) => {
      option.values.forEach((value) => (tags += `,${option.name.toLowerCase()}-${value.toLowerCase()}`));
    });

    let updateQuery = graphqlClient.query<{ data: any }>({
      data: {
        query: `mutation productUpdate($input: ProductInput!){
          productUpdate(input: $input) {
            product {
              tags
            }
            userErrors {
              message
            }
          }
        }`,
        variables: {
          input: {
            id: product.node.id,
            tags: tags.split(","),
          },
        },
      },
    });

    productUpdatePromises.push(updateQuery);
  }

  await Promise.all([...productUpdatePromises]);

  res.status(200).json("Update complete");
});

app.listen(5000, async () => {
  console.log("App is now listening to port 5000");
});
