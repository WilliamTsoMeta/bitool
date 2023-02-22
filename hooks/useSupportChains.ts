import { contractInfosType } from 'types/index'

export function useSupportChains() {
  const env = process.env.NODE_ENV

  // eth
  // polygon
  //
  const getGasStationContractInfo = (): contractInfosType => {
    if (env === 'development') {
      return {
        43113: {
          contractAddress: '0x40BB809f56D3784bbd7172B341886977efC7f5e9', //faucet
          swaprouterContract: '0xEE4805B268bb164995B7c8b3f49BCFf272163662', //fake
          staableCoin: {
            name: 'USDT',
            address: '0x5E66F8908c473a1eCF2d6C02f07cA4A7bC450c63',
            decimals: 18,
          },
          WToken: {
            name: 'WAVAX',
            address: '0x35B8517D2D27E4736b86799EE9Bff14a512aCD7E',
            decimals: 18,
          },
          Faucet: 'https://faucet.avax.network/',
        },
        97: {
          contractAddress: '0x728e36622A2f6A6a76E5c826b12789D1606Fed1F',
          swaprouterContract: '0xd3BFCc632d355609976345735fcb6a651c14be87', //fake
          staableCoin: {
            name: 'USDT',
            address: '0xd2AB632E46f0a3808919a5eDCfdF1b482b5c81B2',
            decimals: 18,
          },
          WToken: {
            name: 'WBNB',
            address: '0xFc75633d4dB2e5f211E5851a5Fc6799e119cEa6C',
            decimals: 18,
          },
          Faucet: 'https://testnet.bnbchain.org/faucet-smart',
        },
      }
    }
    return {
      43113: {
        contractAddress: '0x40BB809f56D3784bbd7172B341886977efC7f5e9', //faucet
        swaprouterContract: '0xEE4805B268bb164995B7c8b3f49BCFf272163662', //fake
        staableCoin: {
          name: 'USDT',
          address: '0x5E66F8908c473a1eCF2d6C02f07cA4A7bC450c63',
          decimals: 18,
        },
        WToken: {
          name: 'WAVAX',
          address: '0x35B8517D2D27E4736b86799EE9Bff14a512aCD7E',
          decimals: 18,
        },
        Faucet: 'https://',
      },
      97: {
        contractAddress: '0x728e36622A2f6A6a76E5c826b12789D1606Fed1F',
        swaprouterContract: '0xd3BFCc632d355609976345735fcb6a651c14be87', //fake
        staableCoin: {
          name: 'USDT',
          address: '0xd2AB632E46f0a3808919a5eDCfdF1b482b5c81B2',
          decimals: 18,
        },
        WToken: {
          name: 'WBNB',
          address: '0xFc75633d4dB2e5f211E5851a5Fc6799e119cEa6C',
          decimals: 18,
        },
        Faucet: 'https://',
      },
    }
  }
  return { getGasStationContractInfo }
}
