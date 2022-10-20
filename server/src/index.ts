import express from "express";
import cors from "cors";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
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
  // Create a new client for the specified shop.
  if (!SHOP || !API_ACCESS_TOKEN) {
    console.log("Missing shop url or access token. Check env file");
    return;
  }
  const client = new Shopify.Clients.Graphql(SHOP, API_ACCESS_TOKEN);
  const response = await client.query<{ data: any[] }>({
    data: `{
      products (first: 10) {
        edges {
          node {
            id
            title
            variants (first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }`,
  });
  res.json(response.body.data);
});

app.listen(5000, () => {
  console.log("App is now listening to port 5000");
});
