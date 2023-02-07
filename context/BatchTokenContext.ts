import { createContext, Dispatch } from 'react'
import { BatchTokenContextType } from 'types/index'

const BatchTokenContext = createContext({
  sendType: 'simple',
  nextClick: false,
  address: '',
  parsedAddress: [['']],
  step: 1,
  balance: 0,
  unit: '',
  gasUnit: '',
  tokenAddress: '',
  tokenDecimals: 0,
  contractAddress: '',
  operationType: '',
} as BatchTokenContextType)

export default BatchTokenContext
