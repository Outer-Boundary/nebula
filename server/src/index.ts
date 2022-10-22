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

app.get("/products/:category", async (req, res) => {
  const category = req.params.category;

  const client = new Shopify.Clients.Graphql(SHOP!, API_ACCESS_TOKEN);
  const response = await client.query<{ data: any[] }>({
    data: `mutation {
        bulkOperationRunQuery(
         query: """
          {
            products {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
          """
        ) {
          bulkOperation {
            id
            status
          }
          userErrors {
            field
            message
          }
        }
      }`,
  });
  res.json(response.body.data);
});

app.post("/webhooks", async (req, res) => {
  console.log(req.body);
});

app.listen(5000, async () => {
  console.log("App is now listening to port 5000");

  if (!SHOP || !API_ACCESS_TOKEN) {
    console.log("Missing shop url or access token. Check env file");
    return;
  }

  // Subscribe to bulk operation finish webhook
  const client = new Shopify.Clients.Graphql(SHOP, API_ACCESS_TOKEN);
  const bulkOperationWebhook = await client.query<{ data: any[] }>({
    data: ` mutation {
      webhookSubscriptionCreate(
        topic: BULK_OPERATIONS_FINISH
        webhookSubscription: {
          format: JSON,
          callbackUrl: "http://localhost:3000/webhooks"
        }
      ) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }`,
  });
});
