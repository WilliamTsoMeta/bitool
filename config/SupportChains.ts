import { contractInfosType, batchTokenContractInfoType } from 'types/index'

const env = process.env.NEXT_PUBLIC_ENV
export function getGasStationContractInfo(): contractInfosType {
  if (env === 'development' || env === 'staging') {
    return {
      43113: {
        contractAddress: '0xE355179f48497a7b348cD24f9D11f67050E3576d', //faucet
        swaprouterContract: '0xEE4805B268bb164995B7c8b3f49BCFf272163662', //fake
        staableCoin: {
          name: 'USDT',
          address: '0xfDD6Db3Afd662aFDD5ad35C15fE47B81B8b11532',
          decimals: 6,
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
    // 43114: {
    //   contractAddress: '0x7AA17814Fa1048919a197522690502Bd63809518', //faucet
    //   swaprouterContract: '', //fake
    //   staableCoin: {
    //     name: 'USDT',
    //     address: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    //     decimals: 6,
    //   },
    //   WToken: {
    //     name: 'WAVAX',
    //     address: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
    //     decimals: 18,
    //   },
    //   Faucet: 'https://faucet.avax.network/',
    // },
    56: {
      contractAddress: '0x7AA17814Fa1048919a197522690502Bd63809518',
      swaprouterContract: '0x10ED43C718714eb63d5aA57B78B54704E256024E', //
      staableCoin: {
        name: 'USDT',
        address: '0x55d398326f99059ff775485246999027b3197955',
        decimals: 18,
      },
      WToken: {
        name: 'WBNB',
        address: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
        decimals: 18,
      },
      Faucet: 'https://testnet.bnbchain.org/faucet-smart',
    },
    // 1: {
    //   contractAddress: '',
    //   swaprouterContract: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F', //fake
    //   staableCoin: {
    //     name: 'USDT',
    //     address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    //     decimals: 6, //没找到decimal
    //   },
    //   WToken: {
    //     name: 'WETH',
    //     address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    //     decimals: 18, //没找到decimal
    //   },
    //   Faucet: 'https://goerlifaucet.com/',
    // },
    // 137: {
    //   //polygon pos 对么
    //   contractAddress: '',
    //   swaprouterContract: '0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff', //fake
    //   staableCoin: {
    //     name: 'USDT',
    //     address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    //     decimals: 6,
    //   },
    //   WToken: {
    //     name: 'WMATIC',
    //     address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', //WMATIC
    //     decimals: 18,
    //   },
    //   Faucet: 'https://faucet.polygon.technology/',
    // },
    // 42161: {
    //   //arbitrum
    //   contractAddress: '0x728e36622A2f6A6a76E5c826b12789D1606Fed1F',
    //   swaprouterContract: '0xd3BFCc632d355609976345735fcb6a651c14be87', //fake
    //   staableCoin: {
    //     name: 'USDT',
    //     address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    //     decimals: 6,
    //   },
    //   WToken: {
    //     name: 'WETH',
    //     address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    //     decimals: 18,
    //   },
    //   Faucet: 'https://faucet.triangleplatform.com/arbitrum/goerli',
    // },
    // 10: {
    //   //optimism
    //   contractAddress: '0x728e36622A2f6A6a76E5c826b12789D1606Fed1F',
    //   swaprouterContract: '0xd3BFCc632d355609976345735fcb6a651c14be87', //fake
    //   staableCoin: {
    //     name: 'USDT',
    //     address: '0x94b008aa00579c1307b0ef2c499ad98a8ce58e58',
    //     decimals: 6,
    //   },
    //   WToken: {
    //     name: 'DAI', //Wtoken就是dai对么
    //     address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    //     decimals: 18,
    //   },
    //   Faucet: 'https://optifaucet.com/',
    // },
    250: {
      //fantom
      contractAddress: '0xfD6a5E3dfBa05919bA6142dCf94Cd9675F036418',
      swaprouterContract: '0xF491e7B69E4244ad4002BC14e878a34207E38c29', //
      staableCoin: {
        name: 'fUSDT',
        address: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        decimals: 6,
      },
      WToken: {
        name: 'WFTM',
        address: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
        decimals: 18,
      },
      Faucet: 'https://faucet.fantom.network/',
    },
    // 66: {
    //   //OKC 对么，内容都不知道对不对
    //   contractAddress: '0x728e36622A2f6A6a76E5c826b12789D1606Fed1F',
    //   swaprouterContract: '0xd3BFCc632d355609976345735fcb6a651c14be87', //fake
    //   staableCoin: {
    //     name: 'USDT',
    //     address: '0x382bb369d343125bfb2117af9c149795c6c65c50',
    //     decimals: 18,
    //   },
    //   WToken: {
    //     name: 'WOKT',
    //     address: '0x8F8526dbfd6E38E3D8307702cA8469Bae6C56C15',
    //     decimals: 18,
    //   },
    //   Faucet: 'https://www.okx.com/cn/okc/faucet',
    // },
  }
}

export function getBatchTokenContractInfo(): batchTokenContractInfoType[] {
  if (env === 'development' || env === 'staging') {
    return [
      {
        id: 43113,
        name: 'Avalanch',
        token: 'AVAX',
        contractAddress: '0x94253f7AB560Ac9de9734c25eFee6FCa24310408',
        tokenOptions: [
          {
            label: 'AVAX',
            value: 'AVAX',
          },
        ],
      },
      {
        id: 97,
        name: 'BSC',
        token: 'BNB',
        contractAddress: '0x03e07E3d286ef396C997d75F838b436474B6826F',
        tokenOptions: [
          {
            label: 'BNB',
            value: 'BNB',
          },
        ],
      },
    ]
  }
  return [
    {
      id: 43114,
      name: 'Avalanch',
      token: 'AVAX',
      contractAddress: '0x7AA17814Fa1048919a197522690502Bd63809518',
      tokenOptions: [
        {
          label: 'AVAX',
          value: 'AVAX',
        },
      ],
    },
    {
      id: 56,
      name: 'BSC',
      token: 'BNB',
      contractAddress: '0x246ecfcb12f4BE8f6b2EC398E5F1DcFE80e630a4',
      tokenOptions: [
        {
          label: 'BNB',
          value: 'BNB',
        },
      ],
    },
    {
      id: 1,
      name: 'ETH',
      token: 'ETH',
      contractAddress: '0x246ecfcb12f4BE8f6b2EC398E5F1DcFE80e630a4',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
    },
    {
      id: 137,
      name: 'Polygon',
      token: 'MATIC',
      contractAddress: '0x7AA17814Fa1048919a197522690502Bd63809518',
      tokenOptions: [
        {
          label: 'MATIC',
          value: 'MATIC',
        },
      ],
    },
    {
      id: 42161,
      name: 'Arbitrum',
      token: 'ETH',
      contractAddress: '0x246ecfcb12f4BE8f6b2EC398E5F1DcFE80e630a4',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
    },
    {
      id: 10,
      name: 'Optimism',
      token: 'ETH',
      contractAddress: '0x246ecfcb12f4BE8f6b2EC398E5F1DcFE80e630a4',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
    },
    {
      id: 250,
      name: 'Fantom',
      token: 'FTM',
      contractAddress: '0x7AA17814Fa1048919a197522690502Bd63809518',
      tokenOptions: [
        {
          label: 'FTM',
          value: 'FTM',
        },
      ],
    },
    // {
    //   id: 66,
    //   name: 'OKC',
    //   token: 'OKT',
    //   contractAddress: '',
    //   tokenOptions: [
    //     {
    //       label: 'OKT',
    //       value: 'OKT',
    //     },
    //   ],
    // },
  ]
}

export function getBatchTokenClaimSuporrt(): batchTokenContractInfoType[] {
  if (env === 'development' || env === 'staging') {
    return [
      {
        id: 43113,
        name: 'Avalanch',
        token: 'AVAX',
        contractAddress: '',
        tokenOptions: [
          {
            label: 'AVAX',
            value: 'AVAX',
          },
        ],
      },
    ]
  }
  return [
    {
      id: 42161,
      name: 'Arbitrum',
      token: 'ETH',
      contractAddress: '',
      tokenOptions: [
        {
          label: 'ETH',
          value: 'ETH',
        },
      ],
    },
  ]
}
