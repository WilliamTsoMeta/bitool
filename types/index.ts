import { Dispatch } from 'react'
export interface AlertType {
  type?: string
  message?: string
  show: boolean
}
export interface ContextType {
  alert: AlertType
  setContext: Dispatch<{ type: string; payload: any }>
}

export interface BatchTokenContextType {
  sendType: string
  nextClick: boolean
  address: string
  parsedAddress: string[][]
  step: number
  balance: number
  unit: string
  gasUnit: string
  tokenAddress: string
  tokenDecimals: number
  contractAddress: string
  setBatchTokenData: Dispatch<{ type: string; payload: any }>
  operationType: string
  addrErr: addrErrType
  simpleNumber: number
  supportChains: supportChainsType[]
}

export interface errType {
  row: number
  content: string
  msg: string
}

export interface addrErrType {
  show: boolean
  errs: [errType]
}

export interface IJsonRPCError {
  readonly message: string
  readonly code: number
  readonly data: any
}

export interface supportChainsType {
  id: number
  name: string
  token: string
  contractAddress: string
  tokenOptions: tokenOptionTypes[]
}

export interface tokenOptionTypes {
  label: string
  value?: string
}
