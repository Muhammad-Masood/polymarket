// // ⁠API Documentation: Use Polymarket’s official documentation (docs.polymarket.com)
// // for API endpoints and guidance. Key APIs include:
// // ◦ Gamma Markets API (https://gamma-api.polymarket.com/): For retrieving
// // market metadata, such as market ID, slug, and outcome details.
// // ◦ CLOB API: For accessing order book data (bids/asks), placing orders, and
// // managing trades. Endpoints include:
// // ▪ GET /books: Retrieve order book for a market.
// // ▪ POST /orders: Place limit or market orders.

// // Milestone 1: Market Integration, Order Book Display & Odds Engine

// // Integrate with Gamma API and CLOB API (GET /markets, GET /books)

// // Validate enableOrderBook flag and parse market metadata

// // Display order book (bids/asks) for YES/NO outcomes in sheets

// // Compute midpoint and implied probabilities

// // Format dynamic columns with automatic updates

// // Implement manual refresh and auto-refresh (30s pregame mode)

// // Handle API errors (invalid ID, malformed key, empty books)

// import { ClobClient } from "@polymarket/clob-client";
// import axios from "axios";
// import { Wallet } from "ethers";
// import { ethers } from "ethers";

// const clobApiBaseUrl = "https://clob.polymarket.com";
// // const dataApiBaseUrl = "https://data-api.polymarket.com";
// // const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
// // const signer = ethers.Wallet.createRandom(provider);
// const wallet = new Wallet(
//   "0x3660393d45a27c00f0f06fb5fac73ca7653148b2fbfe9d9345473228b6e40921"
// );

// const placeOrder = async (order) => {
//   const headers = await getL1AuthHeader();

//   const signature = await wallet.signTypedData(
//     {
//       name: "Polymarket CLOB",
//       version: "1",
//       chainId: 137,
//       verifyingContract: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E", // Order contract
//     },
//     {
//       Order: [
//         { name: "marketHash", type: "bytes32" },
//         { name: "outcome", type: "uint8" },
//         { name: "amount", type: "uint256" },
//         { name: "price", type: "uint256" },
//         { name: "side", type: "uint8" },
//         { name: "nonce", type: "uint256" },
//         { name: "expiration", type: "uint256" },
//       ],
//     },
//     order
//   );

//   const response = await axios.post(
//     `${clobApiBaseUrl}/orders`,
//     {
//       ...order,
//       signature,
//       signatureType: 0,
//     },
//     { headers }
//   );

//   console.log(response.data);

//   return response.data;
// };

// // const funder = "0x96fD5B618Eede3C44feD870a45e25A256F298085";
// // const signatureType = 0;
// // const creds = new ClobClient(
// //   clobApiBaseUrl,
// //   137,
// //   signer
// // ).createOrDeriveApiKey();
// // const clobClient = new ClobClient(
// //   clobApiBaseUrl,
// //   137,
// //   signer,
// //   await creds,
// //   signatureType,
// //   funder
// // );

// // export const getMarketData = async () => {
// //   try {
// //     const markets = await clobClient.getMarkets("");
// //     console.log(`markets: `, markets);
// //   } catch (error) {
// //     console.error("Error fetching market data:", error);
// //   }
// // };

// async function main() {
//   try {
//     // const chainId = parseInt(`${process.env.CHAIN_ID || Chain.AMOY}`) as Chain;
//     //     const clobClient = new ClobClient(clobApiBaseUrl, 137);
//     //     const YES = "71321045679252212594626385532706912750332728571942532289631379312455583992563";

//     //     const orderbook = await clobClient.getOrderBook(YES);
//     //     console.log("orderbook", orderbook);

//     //     const hash = clobClient.getOrderBookHash(orderbook);
//     //     console.log("orderbook hash", hash);
//     // }

//     //   const options = { method: "GET" };

//     //   fetch(`${clobApiBaseUrl}/book`, options)
//     //     .then((response) => response.json())
//     //     .then((response) => console.log(response))
//     //     .catch((err) => console.error(err));

//     const order = {
//       marketHash:
//         "0x000000000000000000000000000000000000000000000000000000000000abcd",
//       outcome: 0,
//       amount: "1000000000000000000",
//       price: "180000000000000000",
//       side: 1,
//       expiration: 1751450400,
//       nonce: 1751371038,
//     };

//     // const data = await placeOrder(order);
//     // console.log("Placed order: ", data);

//   } catch (error) {
//     console.log("Error: ", error);
//   }
// }

// // main();
