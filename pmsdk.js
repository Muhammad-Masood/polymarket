import { Chain, ClobClient, OrderType, Side } from "@polymarket/clob-client";
import { configDotenv } from "dotenv";
import { ethers } from "ethers";
import fs from "fs";

//     POLYGON = 137,
//     AMOY = 80002,

// const wallet = ethers.Wallet.createRandom();
// console.log(wallet, wallet.privateKey);

configDotenv();

// const provider = new ethers.JsonRpcProvider("https://polygon-rpc.com");
// const wallet = new ethers.Wallet(
//   "0x7b5c5a56d83a3154d18467e1d979459043833bb9b76e1a8d3a00e49890c793c5",
//   provider
// );

// const chainId = 137;
const clobApiBaseUrl = "https://clob.polymarket.com";
const gammaApiBaseUrl = "https://gamma-api.polymarket.com";
const funder = "0x96fD5B618Eede3C44feD870a45e25A256F298085";

const creds = {
  key: `2a9c100a-6d48-b764-60a5-422e59b15972`,
  secret: `UKX-64m2o3iuUGZ6DHYg8B9GzrIFBzuUTuCKS1iHpws=`,
  passphrase: `793864c57cc48d0ac089f13d3f5a8da44ce2d84c8f9a722af15a9bfdb99b5b6d`,
};

// const getL1AuthHeader = async () => {
//   const domain = {
//     name: "ClobAuthDomain",
//     version: "1",
//     chainId: 137,
//   };

//   const types = {
//     ClobAuth: [
//       { name: "address", type: "address" },
//       { name: "timestamp", type: "string" },
//       { name: "nonce", type: "uint256" },
//       { name: "message", type: "string" },
//     ],
//   };

//   const { data } = await axios.get(`${clobApiBaseUrl}/auth`);
//   console.log(data);

//   const timestamp = Math.floor(Date.now() / 1000).toString();
//   const nonce = 1;

//   const value = {
//     address: wallet.address,
//     timestamp,
//     nonce,
//     message: "This message attests that I control the given wallet", // Static message
//   };

//   const sig = await wallet.signTypedData(domain, types, value);
//   return {
//     POLY_ADDRESS: value.address,
//     POLY_SIGNATURE: sig,
//     POLY_TIMESTAMP: timestamp,
//     POLY_NONCE: nonce.toString(),
//   };
// };

// const createApiKey = async () => {
//   const l1Headers = await getL1AuthHeader();
//   console.log("L1 Headers: ", l1Headers);
//   const response = await axios.post(
//     `${clobApiBaseUrl}/auth/api-key`,
//     {},
//     { headers: l1Headers }
//   );
//   const data = response.data;
//   return data;
// };

// export const generateL2AuthHeaders = ({
//   address,
//   apiKey,
//   passphrase,
//   secret,
// }) => {
//   const timestamp = Math.floor(Date.now() / 1000).toString();
//   const prehash = `${timestamp}${address}${apiKey}${passphrase}`;
//   const signature = createHmac("sha256", secret).update(prehash).digest("hex");

//   return {
//     POLY_ADDRESS: address,
//     POLY_TIMESTAMP: timestamp,
//     POLY_API_KEY: apiKey,
//     POLY_PASSPHRASE: passphrase,
//     POLY_SIGNATURE: signature,
//   };
// };

// const placeOrder = async (token_id) => {
//   try {
//     const signatureType = 0; // browser wallet
//     const funder = "";

//     const clobClient = new ClobClient(
//       clobApiBaseUrl,
//       chainId,
//       wallet,
//       creds,
//       signatureType,
//       funder
//     );
//     const resp = await clobClient.createAndPostOrder(
//       {
//         tokenID: token_id,
//         price: 0.01,
//         side: Side.BUY,
//         size: 5,
//         feeRateBps: 0,
//       },
//       //   { tickSize: "0.001", negRisk: false }, //You'll need to adjust these based on the market. Get the tickSize and negRisk T/F from the get-markets above
//       //{ tickSize: "0.001",negRisk: true },
//       OrderType.GTC
//     );
//     console.log("Order placed successfully: ", resp);
//   } catch (error) {
//     console.log("Error placing order: ", error);
//   }
// };

(async () => {
  try {
    const _wallet = new ethers.Wallet(`${process.env.PM_PRIVATE_KEY}`);
    // const chainId = Chain.POLYGON;
    const chainId = 137;
    console.log(`Address: ${await _wallet.getAddress()}, chainId: ${chainId}`);

    const host = clobApiBaseUrl;
    const clobClient = new ClobClient(host, chainId, _wallet);

    const apiCreds = await clobClient.createOrDeriveApiKey();
    const { key, secret, passphrase } = apiCreds;
    console.log(
      "Key: ",
      key,
      "\nSecret: ",
      secret,
      "\nPassphrase: ",
      passphrase
    );

    // GET all markets data
    const getAllMarketsSorted = async () => {
      const allMarkets = [];
      let cursor = undefined;
      const response = await clobClient.getMarkets("Njc1MDA=");
      const { data, next_cursor } = response;
      // while (true) {
      //   const response = await clobClient.getMarkets(cursor);
      //   const { data, next_cursor } = response;
      //   console.log("Next cursor: ", next_cursor);
      //   allMarkets.push(...data);
      //   if (!next_cursor || next_cursor === "-1" || next_cursor === "LTE=")
      //     break;
      //   cursor = next_cursor;
      // }
      // console.log("Data: ", data, "Next cursor: ", next_cursor);

      // const validMarkets = allMarkets
      const validMarkets = data
        .filter((m) => m.end_date_iso)
        .map((m) => ({
          ...m,
          endDate: new Date(m.end_date_iso),
        }));

      const sortedMarkets = validMarkets.sort((a, b) => b.endDate - a.endDate);
      // fs.writeFileSync("markets.json", JSON.stringify(sortedMarkets, null, 2));
      return sortedMarkets;
    };

    const markets = await getAllMarketsSorted();

    console.log("Markets data: ", markets);

    // // GET market data by condition id
    const marketById = await clobClient.getMarket(
      "0x275036697c191bba7dafce8e1cbdfa1fca5ba8e1c42b74a87e3884cde4b948df"
    );
    console.log("Market by id: ", marketById);

    // const YES =
    //   "71321045679252212594626385532706912750332728571942532289631379312455583992563";
    // const NO =
    //   "52114319501245915516055106046884209969926127482827954674443846427813813222426";

    // // GET order books
    // const token_id =
    //   "14270523446080509320829200481895961480205553513304203367521919818541658424782";

    // const orderbooks = await clobClient.getOrderBooks([
    //   { token_id: YES },
    //   { token_id: NO },
    // ]);
    // console.log("order books data: ", orderbooks);

    // // GET order book by token id
    // const orderbook = await clobClient.getOrderBook(
    //   //   "71321045679252212594626385532706912750332728571942532289631379312455583992563"
    //   "0x1eb44a4bc1927ce53afd89826def6b5752eaeb384726b4eb4ff31349b1e6523f"
    // );
    // console.log("order book data: ", orderbook);

    // // Create a new order
    // Create clob client with credentials
    const signatureType = 0;
    const clobClientL2 = new ClobClient(
      host,
      chainId,
      _wallet,
      apiCreds,
      signatureType,
      funder
    );
    const createOrderResponse = await clobClientL2.createAndPostOrder(
      {
        tokenID:
          "107418026729023491530035903527711568864573802284084778805471093324146373119524", //Use https://docs.polymarket.com/developers/gamma-markets-api/get-markets to grab a sample token
        price: 0.5,
        side: Side.BUY,
        size: 2,
        feeRateBps: 0,
      },
      { tickSize: "0.01", negRisk: false }, //You'll need to adjust these based on the market. Get the tickSize and negRisk T/F from the get-markets above
      //{ tickSize: "0.001",negRisk: true },

      OrderType.GTC
    );
    console.log(createOrderResponse);

    // const order = await clobClient.getOrder(
    //   "0xb816482a5187a3d3db49cbaf6fe3ddf24f53e6c712b5a4bf5e01d0ec7b11dabc"
    // );
    // console.log("Order Data: ",order);
  } catch (error) {
    console.log("Error: ", error);
  }
})();

// Next cursor:  NTYwMDA=
// Next cursor:  NTY1MDA=
// Next cursor:  NTcwMDA=
// Next cursor:  NTc1MDA=
// Next cursor:  NTgwMDA=
// Next cursor:  NTg1MDA=
// Next cursor:  NTkwMDA=
// Next cursor:  NTk1MDA=
// Next cursor:  NjAwMDA=
// Next cursor:  NjA1MDA=
// Next cursor:  NjEwMDA=
// Next cursor:  NjE1MDA=
// Next cursor:  NjIwMDA=
// Next cursor:  NjI1MDA=
// Next cursor:  NjMwMDA=
// Next cursor:  NjM1MDA=
// Next cursor:  NjQwMDA=
// Next cursor:  NjQ1MDA=
// Next cursor:  NjUwMDA=
// Next cursor:  NjU1MDA=
// Next cursor:  NjYwMDA=
// Next cursor:  NjY1MDA=
// Next cursor:  NjcwMDA=
// Next cursor:  Njc1MDA=
// Next cursor:  LTE=
