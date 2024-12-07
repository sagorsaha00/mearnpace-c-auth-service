
import path from "node:path";
import * as dotenv from "dotenv";
 

 const {PORT,NODE_ENV,DB_HOST,DB_PORT,DB_PASSWORD,DB_USERNAME,DB_NAME } = process.env

// config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });
dotenv.config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,DB_PORT,DB_PASSWORD,DB_USERNAME,DB_NAME
}

