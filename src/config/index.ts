
// import path from "node:path";
// import * as dotenv from "dotenv";
 

//  const {PORT,NODE_ENV,DB_HOST,DB_PORT,DB_PASSWORD,DB_USERNAME,DB_NAME } = process.env;
//  console.log("Loaded Environment Variables:", process.env);


// // config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });
// dotenv.config({
//     path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
// });

// export const Config = {
//     PORT,
//     NODE_ENV,
//     DB_HOST,DB_PORT,DB_PASSWORD,DB_USERNAME,DB_NAME
// }

import path from "node:path";
import * as dotenv from "dotenv";

// Load environment variables first
dotenv.config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});
console.log("Resolved .env Path:", path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`));

// Now destructure process.env
const { PORT, NODE_ENV, DB_HOST, DB_PORT, DB_PASSWORD, DB_USERNAME, DB_NAME } = process.env;

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_PASSWORD,
    DB_USERNAME,
    DB_NAME,
};

// Debugging: Log to verify values
console.log(Config);

