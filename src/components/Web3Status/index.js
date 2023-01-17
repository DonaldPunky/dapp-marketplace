import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import {
  NetworkContextName,
//   ZERO_ADDRESS,
} from '../../constants';

import WalletModal from '../WalletModal';


import * as s from "../../styles/global";


export function Web3Status() {
  const {
    active,
    // chainId,
    account,
    // connector,
    // error,
    deactivate,
  } = useWeb3React();

  const [isWaleltModalOpen, setIsWaleltModalOpen] = useState(false);

  const contextNetwork = useWeb3React(NetworkContextName);

  // const toggleWalletModal = useWalletModalToggle()
  const disconnect = () => deactivate()

  if (!contextNetwork.active && !active) {
    return null;
  }

  return (
    <>
      <s.Container ai="center">
        {account == null ? (
          <s.button
            onClick={() => {
              console.log('Connect');
              console.log('Open wallet modal');
              setIsWaleltModalOpen(true);
            //   toggleWalletModal();
            }}
          >
            CONNECT
          </s.button>
        ) : (
          <s.button
            className="address text-collapse"
            onClick={() => {
              console.log('Disconnect');
              disconnect();
            }}
          >
            {account}
          </s.button>
        )}
      </s.Container>
      <WalletModal isOpen={isWaleltModalOpen} closeModal={()=> setIsWaleltModalOpen(false)} />
    </>
  );
}