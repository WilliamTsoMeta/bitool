import Header from 'components/Header'
import Footer from 'components/Footer'
import Image from 'next/image'
import Step1 from './components/Step1'
import Step2 from './components/Step2'
import Step3 from './components/Step3'
import BatchTokenContext from '../../context/BatchTokenContext'
import { useReducer } from 'react'
import { getBatchTokenContractInfo } from 'config/SupportChains'
import { BatchTokenContextType, errType, addrErrType } from 'types/index'

function reducer(
  state: BatchTokenContextType,
  action: { type: string; payload: any }
) {
  switch (action.type) {
    case 'UPDATE_SEND_TYPE':
      state.sendType = action.payload
      return { ...state }
      break
    case 'UPDATE_NEXT_STEP':
      state.nextClick = action.payload
      return { ...state }
    case 'UPDATE_ADDRESS':
      state.address = action.payload
      return { ...state }
    case 'UPDATE_PARSED_ADDRESS':
      state.parsedAddress = action.payload
      return { ...state }
    case 'UPDATE_STEP':
      state.step = action.payload
      return { ...state }
    case 'UPDATE_TOKEN':
      state.balance = action.payload.balance
      state.unit = action.payload.unit
      state.gasUnit = action.payload.gasUnit
      state.tokenDecimals = action.payload.tokenDecimals
      return { ...state }
    case 'UPDATE_TOKEN_ADDRESS':
      state.tokenAddress = action.payload
      return { ...state }
    case 'UPDATE_TOKEN_WEI':
      state.tokenDecimals = action.payload
      return { ...state }
    case 'UPDATE_CONTRACT_ADDRESS':
      state.contractAddress = action.payload
      return { ...state }
    case 'UPDATE_OPERATION_TYPE':
      state.operationType = action.payload
      return { ...state }
    case 'UPDATE_ADDR_ERR':
      state.addrErr = action.payload
      return { ...state }
    case 'UPDATE_SIMLE_NUMBER':
      state.simpleNumber = action.payload
      return { ...state }
    case 'UPDATE_SUPPORT_CHAINS':
      state.supportChains = action.payload
      return { ...state }
    case 'UPDATE_TXN':
      state.txn = action.payload
      return { ...state }
    default:
      throw new Error('none type fit')
  }
}

export default function BatchTokenSender() {
  const supportChains = getBatchTokenContractInfo()

  const [state, setBatchTokenData] = useReducer(reducer, {
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
    operationType: 'manual',
    addrErr: {
      show: false,
      errs: [{} as errType],
    } as addrErrType,
    simpleNumber: 0,
    supportChains: supportChains,
    txn: [] as Array<string>,
  } as BatchTokenContextType)

  return (
    <>
      <BatchTokenContext.Provider value={{ ...state, setBatchTokenData }}>
        <Header></Header>
        <div className={`banner lg:px-0`}>
          <div className="container flex flex-col items-center mx-auto mt-16">
            <h2 className="mt-12 text-5xl font-bold">Token batch sender</h2>
            <p className="mt-11 mb-7">Chain Supported</p>
            <div className="flex w-4/6 mb-14 justify-evenly">
              {state.supportChains.map((chain) => (
                <Image
                  src={`/images/support_chains/${chain.name}.png`}
                  width={44}
                  height={44}
                  alt="chains"
                  key={chain.id}
                />
              ))}
            </div>
            <div className="w-[47rem]">
              <div className="flex">
                <div
                  className={`w-24 py-3 font-semibold text-center border border-gray-200 rounded-full ${
                    state.step === 1 && 'bg-blue-700 text-white'
                  }`}
                >
                  1.Upload
                </div>
                <div className="divider grow"></div>
                <div
                  className={`w-24 py-3 font-semibold text-center border border-gray-200 rounded-full ${
                    state.step === 2 && 'bg-blue-700 text-white'
                  }`}
                >
                  2.Confirm
                </div>
                <div className="divider grow"></div>
                <div
                  className={`py-3 font-semibold text-center border border-gray-200 rounded-full w-44 ${
                    state.step === 3 && 'bg-blue-700 text-white'
                  }`}
                >
                  3.Batch Sending
                </div>
              </div>
              {state.step === 1 && <Step1></Step1>}
              {state.step === 2 && <Step2></Step2>}
              {state.step === 3 && <Step3></Step3>}
            </div>
          </div>
        </div>
        <Footer></Footer>
      </BatchTokenContext.Provider>
    </>
  )
}
