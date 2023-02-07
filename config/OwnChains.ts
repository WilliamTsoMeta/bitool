import { Chain } from '@wagmi/core'

export const avalanche: Chain = {
  id: 43_114,
  name: 'Avalanche',
  network: 'avalanche',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11907934,
    },
  },
}

export const avalancheFuji: Chain = {
  id: 43_113,
  name: 'Avalanche FUJI C-Chain',
  network: 'avalancheFuji',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace Testnet', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
}
