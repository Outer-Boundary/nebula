import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
export const database = client.db("Cluster0");
