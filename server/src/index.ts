import express from "express";
import cors from "cors";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import { SmartCollection } from "@shopify/shopify-api/dist/rest-resources/2022-10/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { API_KEY, API_SECRET_KEY, API_ACCESS_TOKEN, SCOPES, SHOP, HOST, HOST_SCHEME } = process.env;

Shopify.Context.initialize({
  API_KEY: API_KEY!,
  API_SECRET_KEY: API_SECRET_KEY!,
  PRIVATE_APP_STOREFRONT_ACCESS_TOKEN: API_ACCESS_TOKEN,
  SCOPES: [SCOPES!],
  HOST_NAME: HOST!.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October22,
});

app.get("/products", async (req, res) => {
  // const category = req.params.category;

  // const client = new Shopify.Clients.Rest(SHOP!, API_ACCESS_TOKEN);
  // const response = await client.get({ path: "collections" });

  const session = await Shopify.Utils.loadCurrentSession(req, res);
  if (!session) {
    console.log("session does not exist");
    return;
  }
  const response = await SmartCollection.all({ session: session, handle: "tops" });
  console.log(response);
  res.json(response);
});

app.listen(5000, async () => {
  console.log("App is now listening to port 5000");
});
