import express from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const { API_KEY, API_SECRET_KEY, SCOPES, SHOP, HOST, HOST_SCHEME } = process.env;

Shopify.Context.initialize({
  API_KEY: API_KEY!,
  API_SECRET_KEY: API_SECRET_KEY!,
  SCOPES: [SCOPES!],
  HOST_NAME: HOST!.replace(/https?:\/\//, ""),
  HOST_SCHEME,
  IS_EMBEDDED_APP: false,
  API_VERSION: ApiVersion.October22,
});

const ACTIVE_SHOPIFY_SHOPS: { [key: string]: string | undefined } = {};

//Only needed to initially install the app to your store
app.get("/", async (req, res) => {
  if (!SHOP || !ACTIVE_SHOPIFY_SHOPS[SHOP]) {
    res.redirect("/auth");
  } else {
    res.send("Access token exists");
    res.end();
  }
});

app.get("/auth", async (req, res) => {
  let authRoute = await Shopify.Auth.beginAuth(req, res, SHOP!, "/auth/callback", false);
  return res.redirect(authRoute);
});

app.get("/auth/callback", async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(req, res, req.query as unknown as AuthQuery);
    console.log(session.shop, session);
    ACTIVE_SHOPIFY_SHOPS[SHOP!] = session.scope;
  } catch (error) {
    console.log(error);
  }
  return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
});

app.get("/api/products", async (req, res) => {
  // Load the current session to get the `accessToken`.
  const session = await Shopify.Utils.loadCurrentSession(req, res);
  if (!session) return;
  // Create a new client for the specified shop.
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
  // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
  const response = await client.get({
    path: "products",
  });
  // response.body will be of type MyResponseBodyType
  console.log(response.body);
});

app.listen(5000, () => {
  console.log("App is now listening to port 5000");
});
