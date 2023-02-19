import { contractInfosType } from 'types/index'

export function useSupportChains() {
  const env = process.env.NODE_ENV

  const getGasStationContractInfo = (): contractInfosType => {
    if (env === 'development') {
      return {
        43113: {
          contractAddress: '0x31aD832c1Dc2a09C37C6CF63a7D8923A99F554a1',
          swaprouterContract: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106', //fake
          staableCoin: {
            name: 'USDT',
            address: '0x5E66F8908c473a1eCF2d6C02f07cA4A7bC450c63',
          },
          WToken: {
            name: 'WAVAX',
            address: '0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3',
          },
        },
        97: {
          contractAddress: '0x7FF5722b734c88Af87579E4dd0761683C4979c29',
          swaprouterContract: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106', //fake
          staableCoin: {
            name: 'USDT',
            address: '0xd2AB632E46f0a3808919a5eDCfdF1b482b5c81B2',
          },
          WToken: {
            name: 'WBNB',
            address: '0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3',
          },
        },
      }
    }
    return {
      43113: {
        contractAddress: '0x31aD832c1Dc2a09C37C6CF63a7D8923A99F554a1',
        swaprouterContract: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106', //fake
        staableCoin: {
          name: 'USDT',
          address: '0x5E66F8908c473a1eCF2d6C02f07cA4A7bC450c63',
        },
        WToken: {
          name: 'WAVAX',
          address: '0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3',
        },
      },
      97: {
        contractAddress: '0x7FF5722b734c88Af87579E4dd0761683C4979c29',
        swaprouterContract: '0xE54Ca86531e17Ef3616d22Ca28b0D458b6C89106', //fake
        staableCoin: {
          name: 'USDT',
          address: '0xd2AB632E46f0a3808919a5eDCfdF1b482b5c81B2',
        },
        WToken: {
          name: 'WBNB',
          address: '0x1D308089a2D1Ced3f1Ce36B1FcaF815b07217be3',
        },
      },
    }
  }
  return { getGasStationContractInfo }
}
