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
  let query: {
    [key: string]: QueryParams;
  } = {};
  for (const entry of Object.entries(req.query)) {
    if (typeof entry[1] === "string") {
      query[entry[0]] = entry[1];
    }
  }
  console.log(query);

  const client = new Shopify.Clients.Graphql(SHOP!, API_ACCESS_TOKEN);

  // get the collection id (use the title not the handle since it doesn't change when renaming)
  const collectionsResponse = await client.query<{ data: any[] }>({
    data: `{ 
      products(first: 40, query: "tag:outerwear OR tag:bottoms") {
        edges {
          node {
            id,
            title
            options {
              values
            }
          }
        }
      }
    }`,
  });
  res.json(collectionsResponse);
});

app.listen(5000, async () => {
  console.log("App is now listening to port 5000");
});
