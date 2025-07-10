from dotenv import load_dotenv
import os
from py_clob_client.client import ClobClient
from py_clob_client.clob_types import BookParams, OpenOrderParams, OrderArgs, OrderType
from py_clob_client.constants import AMOY
from py_clob_client.order_builder.constants import BUY
from datetime import datetime

_: bool = load_dotenv()
private_key = os.getenv("PM_PRIVATE_KEY")
chainId = 137
# chainId = AMOY
# chainId = 80002
host = "https://clob.polymarket.com"

def main():
    client = ClobClient(host, key=private_key, chain_id=chainId)
    try:
        api_creds = client.create_or_derive_api_creds()
        # api_creds = client.create_api_key()

        print("API Key:", api_creds.api_key)
        print("Secret:", api_creds.api_secret)
        print("Passphrase:", api_creds.api_passphrase)

        client.set_api_creds(creds=api_creds)

        my_api_keys = client.get_api_keys()
        print("My API keys: ", my_api_keys)

        # last_trade_price = client.get_last_trade_price("14270523446080509320829200481895961480205553513304203367521919818541658424782")
        # print("Last trade price: ", last_trade_price)

        # Get Markets Data
        marketsDataResp = client.get_markets()
        markets = marketsDataResp["data"]
        # keys = marketsData[0].keys()
        # print("Market Keys: ", keys)
        # print("Markets data response: ", marketsDataResp)

        # sorted_markets = sorted(
        #     marketsData,
        #     key=lambda x: int(x.get("accepting_order_timestamp", 0)),
        #     reverse=True 
        #     )

        valid_markets = [m for m in markets if m.get("end_date_iso")]
        sorted_markets = sorted(
            valid_markets,
            key=lambda x: datetime.fromisoformat(x["end_date_iso"].replace("Z", "")),
            reverse=True
            )
        
        markets_accepting_orders = [m for m in sorted_markets if m["accepting_orders"] is True]
        print("Latest markets: ", markets_accepting_orders)

        # market_trade_events = client.get_market_trades_events("condition_id")
        # print("Market trade events: ", market_trade_events)

        # orderbook = client.get_order_book(
            # "14270523446080509320829200481895961480205553513304203367521919818541658424782"
            # )
        # print("orderbook", orderbook)

        # hash = client.get_order_book_hash(orderbook)
        # print("orderbook hash", hash)

        # resp = client.get_order_books(
        # params=[
        #     BookParams(
        #         token_id="71321045679252212594626385532706912750332728571942532289631379312455583992563"
        #     ),
        #     BookParams(
        #         token_id="52114319501245915516055106046884209969926127482827954674443846427813813222426"
        #     ),
        #     ]
        #     )
        # print(resp)

        # orders = client.get_orders(
        #     OpenOrderParams(
        #         market="71321045679252212594626385532706912750332728571942532289631379312455583992563",
        #         )
        #         )
        # print("Orders: ", orders)

        # Create and sign a limit order buying 100 YES tokens for 0.0005 each
        
        order_args = OrderArgs(
            price=0.002,
            size=20,
            side=BUY,
            token_id="71321045679252212594626385532706912750332728571942532289631379312455583992563",
            )
        signed_order = client.create_order(order_args)
        order_place_resp = client.post_order(signed_order, orderType=OrderType.GTC)
        print(order_place_resp)
        print("Placed order!")

    except Exception as e:
        print("Error creating or deriving API credentials:", e)
        
main()




# {'enable_order_book': False, 'active': True, 'closed': True, 'archived': False, 'accepting_orders': True, 'accepting_order_timestamp': None, 
# 'minimum_order_size': 5, 'minimum_tick_size': 0.001, 'condition_id': '0xc03f3229164b28670a7a50439bfb5dd2bed2c50de508bc2ae0391d37b48d1810', 
# 'question_id': '0x0b6388f0d873acbe347dd46ae4dc4bf044873e6032a23430631bba61240e5b2e', 'question': 'Will Trump win the 2024 Iowa Caucus?', 
# 'description': 'This market will resolve to "Yes" if former president Donald J. Trump wins the greatest share of apportioned delegates in the 2024 Republican Iowa caucuses.
# Otherwise, this market will resolve to "No".  \n\nIf Trump ties for the greatest share of apportioned delegates, the popular vote will be used as a tiebreaker. Namely, if Trump ties for the greatest share of apportioned delegates and has the higher final popular vote number, the market resolves to "Yes", and if Trump ties for the greatest share of apportioned delegates and doesn\'t have the higher final popular vote number, the market resolves to "No".\n\nIf no 2024 Republican Iowa caucuses take place, this market will resolve to "No".\n\nThe resolution source for this market will be the first announcement of the results from the Iowa Republican party, however an overwhelming consensus of credible reporting may suffice.', 'market_slug': 'will-trump-win-the-2024-iowa-caucus', 'end_date_iso': '2024-02-05T00:00:00Z', 'game_start_time': None, 'seconds_delay': 0, 'fpmm': '0x473dE157E17630Fb0B1cfc61197084F2a885ADBF', 'maker_base_fee': 0, 'taker_base_fee': 0, 'notifications_enabled': False, 'neg_risk': False, 'neg_risk_market_id': '', 'neg_risk_request_id': '', 'icon': 'https://polymarket-upload.s3.us-east-2.amazonaws.com/trump1+copy.png', 'image': 'https://polymarket-upload.s3.us-east-2.amazonaws.com/trump1+copy.png', 'rewards': {'rates': None, 'min_size': 0, 'max_spread': 0}, 'is_50_50_outcome': False, 'tokens': [{'token_id': '99797325193940650293777738007974137011774368519432515326551017491100470628467', 'outcome': 'Yes', 'price': 1, 'winner': True}, {'token_id': '80387862900490852419047622729331661923122689291735249993941984595432716443874', 'outcome': 'No', 'price': 0, 'winner': False}], 'tags': ['Trump', 'Politics', 'Elections', '2024 iowa caucus', 'USA Election', 'Iowa', 'All']}