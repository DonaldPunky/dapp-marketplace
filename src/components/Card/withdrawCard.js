import BigNumber from "bignumber.js";
import React, { useState } from "react";
import Countdown from "react-countdown";
import { useDispatch, useSelector } from "react-redux";
import { usePoolContext } from "../../context/poolContext";
import IDOPool from "../../contracts/IDOPool.json";
import { fetchData } from "../../redux/data/dataActions";
import * as s from "../../styles/global";
import { utils } from "../../utils";

const WithdrawETH = (props) => {
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [price, setPrice] = useState("0");
  const [loading, setLoading] = useState(false);
  const { idoAddress } = props;
  const dispatch = useDispatch();

  const idoInfo = usePoolContext().allPools[idoAddress];

  if (!blockchain.account || !idoInfo || !blockchain.web3) {
    return null;
  }

  if (!utils.isValidPool(idoInfo)) {
    return null;
  }

  if (idoInfo.owner.toLowerCase() !== blockchain.account.toLowerCase()) {
    return null;
  }

  const web3 = blockchain.web3;

  const withdrawToken = async () => {
    setLoading(true);
    const web3 = blockchain.web3;
    try {
      const IDOPoolContract = await new web3.eth.Contract(
        IDOPool.abi,
        idoAddress
      );

      IDOPoolContract.methods
        .withdrawETH()
        .send({
          from: blockchain.account,
        })
        .once("error", (err) => {
          setLoading(false);
          console.log(err);
        })
        .then((receipt) => {
          setLoading(false);
          console.log(receipt);
          dispatch(fetchData(blockchain.account));
        });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <s.Card
      style={{
        minWidth: 350,
        flex: 1,
        margin: 10,
      }}
    >
      <s.TextTitle>WITHDRAW</s.TextTitle>
      <s.TextID>(Pool owner only)</s.TextID>
      <s.SpacerSmall />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={3}>
          <s.TextID>Can withdraw in</s.TextID>
        </s.Container>

        <Countdown date={idoInfo.end * 1000} />
      </s.Container>
      <s.SpacerMedium />
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Total invested</s.TextID>
          <s.TextDescription>
            {BigNumber(web3.utils.fromWei(idoInfo.balance)).toFixed(2) +
              " " +
              process.env.REACT_APP_CURRENCY}
          </s.TextDescription>
        </s.Container>
        <s.button
          disabled={
            parseInt(Date.now() / 1000) < parseInt(idoInfo.end) ||
            BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap))
          }
          onClick={(e) => {
            e.preventDefault();
            withdrawToken();
          }}
        >
          WITHDRAW
        </s.button>
      </s.Container>
      <s.Container fd="row" ai="center" jc="space-between">
        <s.Container flex={2}>
          <s.TextID>Unsold token</s.TextID>
          <s.TextDescription>
            {BigNumber(idoInfo.unsold)
              .dividedBy(10 ** idoInfo.tokenDecimals)
              .toFixed(2) +
              " " +
              idoInfo.tokenSymbol}
          </s.TextDescription>
        </s.Container>
        {BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap)) ? (
          <s.button
            disabled={
              parseInt(Date.now() / 1000) < parseInt(idoInfo.end) ||
              BigNumber(idoInfo.totalInvestedETH).lt(BigNumber(idoInfo.softCap))
            }
            onClick={(e) => {
              e.preventDefault();
              withdrawToken();
            }}
          >
            WITHDRAW ALL TOKEN
          </s.button>
        ) : (
          <s.button
            disabled={
              parseInt(Date.now() / 1000) < parseInt(idoInfo.end) ||
              BigNumber(idoInfo.totalInvestedETH).gte(
                BigNumber(idoInfo.softCap)
              )
            }
            onClick={(e) => {
              e.preventDefault();
              withdrawToken();
            }}
          >
            WITHDRAW UNSOLD TOKEN
          </s.button>
        )}
      </s.Container>
    </s.Card>
  );
};
export default WithdrawETH;
