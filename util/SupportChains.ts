import {
  avalanche,
  bsc,
  mainnet,
  avalancheFuji,
  bscTestnet,
} from 'wagmi/chains'

const chainArrDev = [avalancheFuji, bscTestnet]
const chainArr = [avalanche, bsc]
const env = process.env.NODE_ENV

export default function getSupportChains() {
  if (env === 'development') {
    return chainArrDev
  }

  return chainArrDev
}
