import express from "express";
import cors from "cors";
import Shopify, { ApiVersion, RequestReturn } from "@shopify/shopify-api";
import dotenv from "dotenv";
import { Product, ProductVariant, CategoryType } from "shared/types";
import { getEnumValues } from "shared/helper";
import { database } from "shared/mongodb";

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

/*
!!!!! if debugging this and nothing's working don't to forget to update your ip address in mongodb !!!!!
*/

// proof of concept to mess around with the different ways I can structure a query in mongodb
app.get("/products/test", async (req, res) => {
  const products = database.collection("products").find(
    {
      title: { $regex: /plain/i },
      "category.sub": { $in: ["tshirt", "tanktop", "coat", "hoodie"] },
      $and: [{ colours: { $in: ["blue", "yellow"] } }, { colours: { $nin: ["darkbrown", "grey"] } }],
      sizes: { $in: ["s", "xs", "xxl"] },
      material: "cotton",
    },
    { projection: { variants: 0 } }
  );
  products.forEach((doc) => console.log(doc));
  res.send("Completed");
});

// add more strict validation
app.get("/products", async (req, res) => {
  const allowedFields = ["$sort", "category.main", "category.sub", "sizes", "material", "price"];

  const filter: { [key: string]: {} | string } = {};
  const options: { [key: string]: {} } = {};
  for (const [key, value] of Object.entries(req.query) as [string, string][]) {
    if (!allowedFields.includes(key)) {
      return res.json("Invalid field, check that the allowed fields are correct");
    }
    if (key.startsWith("$")) {
      const optionParams = (value as string).split(":");
      options[key.replace("$", "")] = { [optionParams[0]]: parseInt(optionParams[1]) ?? optionParams[1] };
    } else {
      if (value.split("|")) {
        
      }
      if (value.split(",").length > 1) {
        const values = value.split(",").map((value) => value.toLowerCase());
        filter[key] = { $in: values };
      } else if (value.split("-").length === 2) {
        const values = value.split("-");
        filter[key] = { $gte: parseInt(values[0]), $lte: parseInt(values[1]) };
      } else {
        filter[key] = value.toLowerCase();
      }
    }
  }

  console.log(req.query);

  // const products = database.collection("products").find(filter, options);
  // products.forEach((doc) => console.log(doc));
  // res.send("Completed");
});

// only certain products can be uploaded using the ?ids=[id1,id2] syntax
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

  // add every product to the database
  const uploadPromises: Promise<any>[] = [];
  for (let i = 0; i < products.length; i++) {
    const tags = (products[i].tags as string).replace(/\s/g, "").split(",");
    const category = tags
      .find((tag) => getEnumValues(CategoryType).some((type) => type.toLowerCase() === tag.toLowerCase()))
      ?.toLowerCase();
    const subcategory = (products[i].product_type as string).replace(/[^A-z]/g, "").toLowerCase();
    // add main and sub category too

    if (!category || !subcategory) {
      console.error("Missing product type in tags for product " + products[i].id);
      continue;
    }

    const sizes = (products[i].options as any[]).filter((option) => option.name.toLowerCase() === "size")[0].values as string[];
    const colours = (products[i].options as any[]).filter((option) => option.name.toLowerCase() === "color")[0].values as string[];
    const material = (products[i].options as any[]).filter((option) => option.name.toLowerCase() === "material")[0].values[0].toLowerCase();

    const product: Omit<Product, "id" | "timesSold"> = {
      title: products[i].title,
      category: { main: category, sub: subcategory },
      createdAt: products[i].created_at,
      updatedAt: products[i].updated_at,
      active: products[i].status === "active" ? true : false,
      tags: tags,
      sizes: sizes.map((x) => x.toLowerCase()),
      colours: colours.map((x) => x.toLowerCase()),
      material: material,
      imageCardId: (products[i].image.id as number).toString(),
      vendor: products[i].vendor,
      totalQuantity: (products[i].variants as any[]).reduce((acc, cur) => acc + cur.inventory_quantity, 0),
      price: parseInt(products[i].variants[0].price),
      variants: [],
    };

    const productVariants: ProductVariant[] = [];
    for (const variant of products[i].variants) {
      const variantProperties = (variant.title as string).toLowerCase().replace(/\s/g, "").split("/");
      productVariants.push({
        quantity: variant.inventory_quantity,
        size: variantProperties.find((x) => product.sizes.includes(x))!,
        colour: variantProperties.find((x) => product.colours.includes(x))!,
        material: product.material,
        imageIds: (products[i].images as any[])
          .filter((image) => (image.variant_ids as any[]).includes(variant.id))
          .reduce((acc, cur) => acc.push((cur as number).toString()), [] as string[]),
      });
    }
    product.variants = productVariants;

    const productsCollection = database.collection<Omit<Product, "id" | "timesSold">>("products");
    const insertResult = productsCollection.updateOne({ _id: products[i].id }, { $set: product }, { upsert: true });

    uploadPromises.push(insertResult);
  }

  await Promise.all([...uploadPromises]);

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
