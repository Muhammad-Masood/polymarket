import {
  AssetType,
  Chain,
  ClobClient,
  OrderType,
  Side,
} from "@polymarket/clob-client";
import { configDotenv } from "dotenv";
import { constants, ethers } from "ethers";
import fs from "fs";
import { getContractConfig } from "./config.js";
import { usdcAbi } from "./usdcAbi.js";
import { ctfAbi } from "./ctfAbi.js";

//     POLYGON = 137,
//     AMOY = 80002,

// const wallet = ethers.Wallet.createRandom();
// console.log(wallet, wallet.privateKey);

configDotenv();

// const wallet = new ethers.Wallet(
//   "0x7b5c5a56d83a3154d18467e1d979459043833bb9b76e1a8d3a00e49890c793c5",
//   provider
// );

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com"
);

const chainId = 137;
const clobApiBaseUrl = "https://clob.polymarket.com";
const gammaApiBaseUrl = "https://gamma-api.polymarket.com";
const funder = "0x96fD5B618Eede3C44feD870a45e25A256F298085";

// const creds = {
//   key: `2a9c100a-6d48-b764-60a5-422e59b15972`,
//   secret: `UKX-64m2o3iuUGZ6DHYg8B9GzrIFBzuUTuCKS1iHpws=`,
//   passphrase: `793864c57cc48d0ac089f13d3f5a8da44ce2d84c8f9a722af15a9bfdb99b5b6d`,
// };

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

export function getUsdcContract(mainnetQ, wallet) {
  const chainId = mainnetQ ? 137 : 80002;
  const contractConfig = getContractConfig(chainId);
  return new ethers.Contract(contractConfig.collateral, usdcAbi, wallet);
}

export function getCtfContract(mainnetQ, wallet) {
  const chainId = mainnetQ ? 137 : 80002;
  const contractConfig = getContractConfig(chainId);
  return new ethers.Contract(contractConfig.conditionalTokens, ctfAbi, wallet);
}

(async () => {
  try {
    const _wallet = new ethers.Wallet(`${process.env.PM_PRIVATE_KEY}`);
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

    const TOKEN_ID_UP =
      "107418026729023491530035903527711568864573802284084778805471093324146373119524";
    const TOKEN_ID_DOWN =
      "64435066501883066067902503655005737286946953158176062274260571198046616293643";

    // // GET order book by token id
    const orderbook = await clobClient.getOrderBook(TOKEN_ID_UP);

    console.log("order book data: ", orderbook);

    // // Create a new order
    // Create clob client with credentials
    const signatureType = 1;
    const clobClientL2 = new ClobClient(
      host,
      chainId,
      _wallet,
      apiCreds
      // signatureType,
      // funder
    );

    const collateral = await clobClientL2.getBalanceAllowance({
      asset_type: AssetType.COLLATERAL,
    });
    console.log("Collateral: ", collateral);

    const up = await clobClientL2.getBalanceAllowance({
      asset_type: AssetType.CONDITIONAL,
      token_id: TOKEN_ID_UP,
    });
    console.log("Up: ", up);

    const down = await clobClientL2.getBalanceAllowance({
      asset_type: AssetType.CONDITIONAL,
      token_id: TOKEN_ID_DOWN,
    });
    console.log("Down: ", down);

    if (Number(collateral.balance) == 0) {
      const wallet = _wallet.connect(provider);
      const contractConfig = getContractConfig(chainId);
      const usdc = getUsdcContract(true, wallet);
      const ctf = getCtfContract(true, wallet);
      const usdcAllowanceCtf = await usdc.allowance(
        wallet.address,
        ctf.address
      );
      console.log(`usdcAllowanceCtf: ${usdcAllowanceCtf}`);
      const usdcAllowanceExchange = await usdc.allowance(
        wallet.address,
        contractConfig.exchange
      );
      const conditionalTokensAllowanceExchange = await ctf.isApprovedForAll(
        wallet.address,
        contractConfig.exchange
      );

      let txn;

      if (!usdcAllowanceCtf.gt(constants.Zero)) {
        txn = await usdc.approve(
          contractConfig.conditionalTokens,
          constants.MaxUint256,
          {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
          }
        );
        console.log(`Setting USDC allowance for CTF: ${txn.hash}`);
      }
      if (!usdcAllowanceExchange.gt(constants.Zero)) {
        txn = await usdc.approve(
          contractConfig.exchange,
          constants.MaxUint256,
          {
            gasPrice: 100_000_000_000,
            gasLimit: 200_000,
          }
        );
        console.log(`Setting USDC allowance for Exchange: ${txn.hash}`);
      }
      if (!conditionalTokensAllowanceExchange) {
        txn = await ctf.setApprovalForAll(contractConfig.exchange, true, {
          gasPrice: 100_000_000_000,
          gasLimit: 200_000,
        });
        console.log(
          `Setting Conditional Tokens allowance for Exchange: ${txn.hash}`
        );
      }
      console.log("Allowances set");
    }

    // clobClientL2.updateBalanceAllowance()
    const createOrderResponse = await clobClientL2.createAndPostOrder(
      {
        tokenID: TOKEN_ID_UP,
        price: 0.5,
        side: Side.BUY,
        size: 2,
        // feeRateBps: 0,
      }
      // { tickSize: "0.01", negRisk: true }, //You'll need to adjust these based on the market. Get the tickSize and negRisk T/F from the get-markets above
      // OrderType.GTC
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

// [CLOB Client] request error {"status":400,"statusText":"Bad Request","data":{"error":"Could not create api key"},
// "config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"transformRequest":[null],
// "transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},
// "headers":{"Accept":"*/*","Content-Type":"application/json","POLY_ADDRESS":"0xaf0EdadD8016404F6d3B106BF8bf273D952836f6",
// "POLY_SIGNATURE":"0xf28b8b44bf8a5fc8bcb44c0846bd627f5d27173e46fe6a7cf2f53583fc38d2031abd067b56bca52da1db2b3a02a906418f0fdc4e871ee7e4b26e68b3ba2f07551c","POLY_TIMESTAMP":"1752136461","POLY_NONCE":"0","User-Agent":"@polymarket/clob-client","Connection":"keep-alive"},"method":"post","url":"https://clob.polymarket.com/auth/api-key","params":{}}}

// [CLOB Client] request error {"status":400,"statusText":"Bad Request","data":{"error":"invalid signature"},
// "config":{"transitional":{"silentJSONParsing":true,"forcedJSONParsing":true,"clarifyTimeoutError":false},"transformRequest":[null],
// "transformResponse":[null],"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"maxBodyLength":-1,"env":{},
// "headers":{"Accept":"*/*","Content-Type":"application/json","POLY_ADDRESS":"0xaf0EdadD8016404F6d3B106BF8bf273D952836f6","POLY_SIGNATURE":"HWUwFT74eAzPGpMzrj5Mb1Z556q_kTfPSycv4ShPxgk=","POLY_TIMESTAMP":"1752136463","POLY_API_KEY":"dacf6b2e-a253-505d-aacb-4fbaa66769a7","POLY_PASSPHRASE":"74968f4cacb8dbe44fdde3c5c0f7a68187115de9473e9664b7f25338277543e5","User-Agent":"@polymarket/clob-client","Connection":"keep-alive","Content-Length":618},"method":"post","url":"https://clob.polymarket.com/order","data":"{\"order\":{\"salt\":628334947669,\"maker\":\"0x96fD5B618Eede3C44feD870a45e25A256F298085\",\"signer\":\"0xaf0EdadD8016404F6d3B106BF8bf273D952836f6\",\"taker\":\"0x0000000000000000000000000000000000000000\",\"tokenId\":\"64435066501883066067902503655005737286946953158176062274260571198046616293643\",\"makerAmount\":\"1000000\",\"takerAmount\":\"2000000\",\"side\":\"BUY\",\"expiration\":\"0\",\"nonce\":\"0\",\"feeRateBps\":\"0\",\"signatureType\":0,
// \"signature\":\"0xdc4a7afa7aa0476d58571bd299074c648b0d59d4691dc174789f12f7277fb6ea014b8cf24435b16117655617dffe99effc4f413e7260a0f4bd7ad9f8dd5d273d1b\"},\"owner\":\"dacf6b2e-a253-505d-aacb-4fbaa66769a7\",\"orderType\":\"GTC\"}","params":{}}}
