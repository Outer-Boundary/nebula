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
  SCOPES: [SCOPES!],
  HOST_NAME: HOST!.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October22,
});

app.get("/collections/:category", async (req, res) => {
  const category = req.params.category;

  // use getEnumValues with CategoryType from client
  if (!["tops", "bottoms", "outerwear"].some((x) => x === category)) {
    res.status(400).json({ error: "Invalid category" });
    return;
  }

  const client = new Shopify.Clients.Rest(SHOP!, API_ACCESS_TOKEN);
  // get the collection id
  const collectionsResponse = await client.get<{ smart_collections: any[] }>({ path: "/smart_collections", query: { handle: category } });
  if (collectionsResponse.body.smart_collections.length === 0) {
    res.status(400).json({ error: "Could not find a collection with the specified handle" });
    return;
  }
  const collectionId = collectionsResponse.body.smart_collections[0].id;
  // get the products inside that collection
  const productsResponse = await client.get<{ products: any[] }>({ path: "products", query: { collection_id: collectionId } });
  res.json(productsResponse);
});

app.listen(5000, async () => {
  console.log("App is now listening to port 5000");
});
