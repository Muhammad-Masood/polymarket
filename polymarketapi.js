import { ClobClient } from "@polymarket/clob-client";
import { configDotenv } from "dotenv";

// set env
configDotenv();

const privateKey = process.env.PM_PRIVATE_KEY;
const chainId = 137;
const host = "https://clob.polymarket.com";

async function main() {
  try {
    // const client = ClobClient(host, )
  } catch (error) {
    console.log("Error: ", error);
  }
}

main();
