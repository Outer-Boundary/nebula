import express from "express";
import cors from "cors";
import Shopify, { ApiVersion, QueryParams } from "@shopify/shopify-api";
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

  let query = req.url.split("?")[1].replace(/\&/g, "AND").replace(/\|/g, "OR");

  // get the collection id (use the title not the handle since it doesn't change when renaming)
  const collectionsResponse = await client.query<{ data: any[] }>({
    data: `{ 
      products(first: 40, query: "${query}") {
        edges {
          node {
            id,
            title,
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

  let products: any[] = [];
  let loopAmount = Math.ceil(productsCount / 250);
  for (let index = 0; index < loopAmount; index++) {
    let productsQuery = await graphqlClient.query<{ data: any }>({
      data: `{
        products(first: ${index + 1 === loopAmount ? productsCount : 250}) {
          edges {
            node {
              id,
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
  console.log(products);
});

app.listen(5000, async () => {
  console.log("App is now listening to port 5000");
});
