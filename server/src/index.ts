import express from "express";
import cors from "cors";
import Shopify, { ApiVersion, QueryParams, RequestReturn } from "@shopify/shopify-api";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { API_KEY, API_SECRET_KEY, API_ACCESS_TOKEN, SCOPES, SHOP, HOST, HOST_SCHEME } = process.env;

Shopify.Context.initialize({
  API_KEY: API_KEY!,
  API_SECRET_KEY: API_SECRET_KEY!,
  SCOPES: [SCOPES!],
  HOST_NAME: HOST!.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October22,
});

app.get("/products", async (req, res) => {
  const client = new Shopify.Clients.Graphql(SHOP!, API_ACCESS_TOKEN);

  let query = req.url.split("?").length > 1 ? req.url.split("?")[1].replace(/\&/g, "AND").replace(/\|/g, "OR") : "";

  // get the collection id (use the title not the handle since it doesn't change when renaming)
  const collectionsResponse = await client.query<{ data: any[] }>({
    data: `{ 
      products(first: 40, query: "${query}") {
        edges {
          node {
            id,
            title,
            tags,
            priceRangeV2 {
              minVariantPrice {
                amount
              }
            },
            options {
              name
              values 
            }
          }
        }
      }
    }`,
  });
  res.json(collectionsResponse);
});

app.post("/products/update-tags-with-options", async (req, res) => {
  const restClient = new Shopify.Clients.Rest(SHOP!, API_ACCESS_TOKEN);

  const productsCount = (
    await restClient.get<{ count: number }>({
      path: "products/count",
    })
  ).body.count;

  const graphqlClient = new Shopify.Clients.Graphql(SHOP!, API_ACCESS_TOKEN);

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

  const productUpdatePromises: Promise<RequestReturn>[] = [];
  for (const product of products) {
    let tags = (product.node.tags as string[]).join(",").replace(/(color|material|size).*?(,|(?=$))/g, "");
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
