import express from "express";
import Shopify, { ApiVersion, AuthQuery } from "@shopify/shopify-api";
require("dotenv").config();

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

app.get("/", async (req, res) => {
  if (!SHOP || !ACTIVE_SHOPIFY_SHOPS[SHOP]) {
    res.redirect("/login");
  } else {
    res.send("Hello world!");
    res.end();
  }
});

app.get("/login", async (req, res) => {
  let authRoute = await Shopify.Auth.beginAuth(req, res, SHOP!, "/auth/callback", false);
  return res.redirect(authRoute);
});

app.get("/auth/callback", async (req, res) => {
  try {
    const session = await Shopify.Auth.validateAuthCallback(req, res, req.query as unknown as AuthQuery);
    ACTIVE_SHOPIFY_SHOPS[SHOP!] = session.scope;
    console.log(session.accessToken);
  } catch (error) {
    console.log(error);
  }
  return res.redirect(`/?host=${req.query.host}&shop=${req.query.shop}`);
});

app.listen(3000, () => {
  console.log("App is now listening to port 3000");
});
