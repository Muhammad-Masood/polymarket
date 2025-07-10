// import { Wallet } from "ethers";
// import axios from "axios";
// import { createHmac } from "crypto";

// const clobApiBaseUrl = "https://clob.polymarket.com";
// const gammaApiBaseUrl = "https://gamma-api.polymarket.com";

// const privateKey =
//   "0x7b5c5a56d83a3154d18467e1d979459043833bb9b76e1a8d3a00e49890c793c5";
// const wallet = new Wallet(privateKey);

// // L1 Headers:  {
// //   POLY_ADDRESS: '0xf4d86554C2b8c9B293E48802E751A832597c8a28',
// //   POLY_SIGNATURE: '0x8ae069b4d184e6a9ce3299c314b8155d91fc1c323b0b9c669e84d74540807ee70b877c8a84dd4d99b721dca1fc40654b1f8b84e1a95e7a2a59146addd7bd9dff1b',
// //   POLY_TIMESTAMP: '1751538360',
// //   POLY_NONCE: '1'
// // }
// // {
// //   apiKey: '2a9c100a-6d48-b764-60a5-422e59b15972',
// //   secret: 'UKX-64m2o3iuUGZ6DHYg8B9GzrIFBzuUTuCKS1iHpws=',
// //   passphrase: '793864c57cc48d0ac089f13d3f5a8da44ce2d84c8f9a722af15a9bfdb99b5b6d'
// // }
// // l2 auth headers {
// //   POLY_ADDRESS: '0xf4d86554C2b8c9B293E48802E751A832597c8a28',
// //   POLY_TIMESTAMP: '1751538360',
// //   POLY_API_KEY: '2a9c100a-6d48-b764-60a5-422e59b15972',
// //   POLY_PASSPHRASE: '793864c57cc48d0ac089f13d3f5a8da44ce2d84c8f9a722af15a9bfdb99b5b6d',
// //   POLY_SIGNATURE: '68ac7bc7846bae2130e94936dd656dfb0f4e4226bb224bbf62ba6972b1cea43f'
// // }



// const getApiKeys = async (l2Headers) => {
//   const response = await axios.get(`${clobApiBaseUrl}/auth/api-keys`, {
//     headers: l2Headers,
//   });
//   console.log(response.data);
//   return response.data;
// };

// const getOrderBook = async (tokenId) => {
//   const options = { method: "GET" };

//   const { data } = await axios.get(
//     `${clobApiBaseUrl}/book?token_id=${tokenId}`,
//     options
//   );
//   console.log(data);
//   return data;
// };

// const getBooks = async () => {
//   try {
//     const l2Headers = generateL2AuthHeaders({
//       address: wallet.address,
//       apiKey: "eee86b4a-b938-5753-c61b-8d09b534f3f7",
//       secret: "SkDrBTzknFkuHgoxRA2AnqaDBA27g7K5Pl78a9Cplcw=",
//       passphrase:
//         "3b7b785f3e5b01882142b31c4df0d33139c67928b4beef418117e810f6c63518",
//     });
//     console.log(l2Headers);
//     const YES =
//       "71321045679252212594626385532706912750332728571942532289631379312455583992563";
//     const NO =
//       "52114319501245915516055106046884209969926127482827954674443846427813813222426";
//     const payload = {
//       params: {
//         token_id: YES,
//       },
//     };
//     const { data } = await axios.post(`${clobApiBaseUrl}/books`, payload, {
//       headers: l2Headers,
//     });
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.log("Error fetching books data: ", error);
//   }
// };

// const getMarkets = async () => {
//   try {
//     const { data } = await axios.get(`${gammaApiBaseUrl}/markets?chainId=137`);
//     return data;
//   } catch (error) {
//     console.log("Error fetchin markets data: ", error);
//   }
// };

// (async () => {
//   try {
//     // const data = await createApiKey();
//     // console.log(data);
//     //     {
//     //     apiKey: '5464ad47-60bd-245f-83d9-2ae874cf85a9',
//     //     secret: 'INtMXsxpSucxTv5ARfmhSRcP-el3Y3CrvL0An6lqipE=',
//     //     passphrase: '4783e3cf754e0ba5d8efd66f18f90fab5ad97452bb80ce35e064f6a98063ea27'
//     //   }

//     const authData = {
//       address: wallet.address,
//       apiKey: "eee86b4a-b938-5753-c61b-8d09b534f3f7",
//       secret: "SkDrBTzknFkuHgoxRA2AnqaDBA27g7K5Pl78a9Cplcw=",
//       passphrase:
//         "3b7b785f3e5b01882142b31c4df0d33139c67928b4beef418117e810f6c63518",
//     };

//     const signOrder = async (order, privateKey) => {
//       const wallet = new Wallet(privateKey);

//       const domain = {
//         name: "Polymarket CLOB",
//         version: "1",
//         chainId: 137,
//         verifyingContract: "0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E",
//       };

//       const types = {
//         Order: [
//           { name: "marketHash", type: "bytes32" },
//           { name: "outcome", type: "uint8" },
//           { name: "amount", type: "uint256" },
//           { name: "price", type: "uint256" },
//           { name: "side", type: "uint8" },
//           { name: "nonce", type: "uint256" },
//           { name: "expiration", type: "uint256" },
//         ],
//       };

//       const signature = await wallet.signTypedData(domain, types, order);
//       console.log("Order sign sig: ", signature);
//       return signature;
//     };

//     // const order = {
//     //   marketHash:
//     //     "0x000000000000000000000000000000000000000000000000000000000000abcd",
//     //   outcome: 0,
//     //   amount: "1000000000000000000",
//     //   price: "180000000000000000",
//     //   side: 1,
//     //   expiration: 1751450400,
//     //   nonce: 1751371038,
//     // };

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

//     const placeOrder = async (order, signature) => {
//       console.log("l2 headers inside place order: ", l2Headers);
//       const response = await axios.post(
//         `${clobApiBaseUrl}/orders`,
//         {
//           ...order,
//           signature,
//           signatureType: 0, // EIP712
//         },
//         { headers: l2Headers }
//       );
//       return response.data;
//     };

//     // const l2Headers = generateL2AuthHeaders({
//     //   address: wallet.address,
//     //   apiKey: "2a9c100a-6d48-b764-60a5-422e59b15972",
//     //   secret: "UKX-64m2o3iuUGZ6DHYg8B9GzrIFBzuUTuCKS1iHpws=",
//     //   passphrase:
//     //     "793864c57cc48d0ac089f13d3f5a8da44ce2d84c8f9a722af15a9bfdb99b5b6d",
//     // });

//     // const l2Headers = generateL2AuthHeaders({
//     //   address: wallet.address,
//     //   apiKey: "2a9c100a-6d48-b764-60a5-422e59b15972",
//     //   secret: "UKX-64m2o3iuUGZ6DHYg8B9GzrIFBzuUTuCKS1iHpws=",
//     //   passphrase:
//     //     "793864c57cc48d0ac089f13d3f5a8da44ce2d84c8f9a722af15a9bfdb99b5b6d",
//     // });

//     // console.log("l2 auth headers", l2Headers);
//     // const signature = await signOrder(order, privateKey);
//     // const response = await placeOrder(order, signature);
//     // console.log(response);

//     // await getApiKeys(l2Headers);

//     // await getOrderBook(
//     //   "71321045679252212594626385532706912750332728571942532289631379312455583992563"
//     // );

//     // const marketData = await getMarkets();
//     // console.log("Markets: ", marketData);

//     // const booksData = await getBooks();
//     // console.log("Books: ", booksData);
//   } catch (error) {
//     console.log(error);
//   }
// })();
