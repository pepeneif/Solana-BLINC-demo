import EventEmitter from 'events';
import { useConnectionConfig, MAINNET_URL } from '../connection';
import { useListener } from '../utils';
import { useCallback } from 'react';

export const TOKENS = {
  [MAINNET_URL]: [
    {
      tokenSymbol: 'BTC',
      mintAddress: '9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E',
      tokenName: 'Wrapped Bitcoin',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png',
    },
    {
      tokenSymbol: 'ETH',
      mintAddress: '2FPyTwcZLUg1MDrwsyoP4D6s1tM7hAkHYRjkNb5w6Pxk',
      tokenName: 'Wrapped Ethereum',
      icon:
        'https://sol.neif.org/logos/eth.png',
    },
    {
      tokenSymbol: 'USDT',
      mintAddress: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      tokenName: 'Tether USD',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
    {
      tokenSymbol: 'USDC',
      mintAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      tokenName: 'USD Coin',
      icon:
        'https://raw.githubusercontent.com/trustwallet/assets/f3ffd0b9ae2165336279ce2f8db1981a55ce30f8/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
    {
      tokenSymbol: 'EUR',
      mintAddress: '6FeW5eWhiSV9gv6kWi6vvP2mPd6vCbPRJgckomNGyDFL',
      tokenName: 'Euro',
      icon: 'https://sol.neif.org/logos/eur.png'
    },
    {
      tokenSymbol: 'USD',
      mintAddress: 'DAFJA8fAzAkpG5AL62Ur3A8Rnmm9Pc5PuxrDhc66duhp',
      tokenName: 'US Dollar',
      icon: 'https://sol.neif.org/logos/usd.png'
    },
    {
      tokenSymbol: 'GBP',
      mintAddress: '6ieGSAoiELCUshdtviNNqyjHf9yzAYYLrPbkt2DS8Fps',
      tokenName: 'Pound Sterling',
      icon: 'https://sol.neif.org/logos/gbp.png'
    },
    {
      tokenSymbol: 'CHF',
      mintAddress: 'Fokk6YND2Bdw8A5jyaAyc9kmSLdU43EJktnGwheKvQos',
      tokenName: 'Swiss Franc',
      icon: 'https://sol.neif.org/logos/chf.png'
    },
    {
      tokenSymbol: 'AED',
      mintAddress: '2oiACYKFnJ53saZa5KfZBdBuatxvg7adDudzE12MujSk',
      tokenName: 'UAE Dirham',
      icon: 'https://sol.neif.org/logos/aed.png'
    },
    {
      tokenSymbol: 'MXN',
      mintAddress: '48ycUaghWVrV36xAXpXRnS7t8WHNeN6uko6fUCrix6xc',
      tokenName: 'Mexican Peso',
      icon: 'https://sol.neif.org/logos/mxn.png'
    },
  ],
};

const customTokenNamesByNetwork = JSON.parse(
  localStorage.getItem('tokenNames') ?? '{}',
);

const nameUpdated = new EventEmitter();
nameUpdated.setMaxListeners(100);

export function useTokenName(mint) {
  const { endpoint } = useConnectionConfig();
  useListener(nameUpdated, 'update');

  if (!mint) {
    return { name: null, symbol: null };
  }

  let info = customTokenNamesByNetwork?.[endpoint]?.[mint.toBase58()];
  let match = TOKENS?.[endpoint]?.find(
    (token) => token.mintAddress === mint.toBase58(),
  );
  if (match && (!info || match.deprecated)) {
    info = { name: match.tokenName, symbol: match.tokenSymbol };
  }
  return { name: info?.name, symbol: info?.symbol };
}

export function useUpdateTokenName() {
  const { endpoint } = useConnectionConfig();
  return useCallback(
    function updateTokenName(mint, name, symbol) {
      if (!name || !symbol) {
        if (name) {
          symbol = name;
        } else if (symbol) {
          name = symbol;
        } else {
          return;
        }
      }
      if (!customTokenNamesByNetwork[endpoint]) {
        customTokenNamesByNetwork[endpoint] = {};
      }
      customTokenNamesByNetwork[endpoint][mint.toBase58()] = { name, symbol };
      localStorage.setItem(
        'tokenNames',
        JSON.stringify(customTokenNamesByNetwork),
      );
      nameUpdated.emit('update');
    },
    [endpoint],
  );
}
