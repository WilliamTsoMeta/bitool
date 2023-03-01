import {
  avalancheFuji,
  bscTestnet,
  avalanche,
  bsc,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  fantom,
  okc,
} from 'wagmi/chains'

const chainArrDev = [avalancheFuji, bscTestnet]
const chainArr = [
  avalanche,
  bsc,
  mainnet,
  polygon,
  arbitrum,
  optimism,
  fantom,
  okc,
]
const env = process.env.NEXT_PUBLIC_ENV

export default function getSupportChains() {
  if (env === 'development' || 'staging') {
    return chainArrDev
  }

  return chainArr
}
