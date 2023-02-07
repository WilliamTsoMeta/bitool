import { isAddress } from 'ethers/lib/utils.js'
import { positive } from 'is_js'
import { useContext, useEffect, useState } from 'react'
import { walletAddress } from 'utils'
import BatchTokenContext from 'context/BatchTokenContext'
import { errType } from 'types'
import { useAccount, useConnect, useDisconnect, useNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function SendAssetsType() {
  const batchTokenData = useContext(BatchTokenContext)
  const { sendType, setBatchTokenData } = useContext(BatchTokenContext)
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const { address, isConnected } = useAccount()

  const [walletConect, setwalletConect] = useState(false)

  useEffect(() => {
    setwalletConect(isConnected)
  }, [isConnected])

  function setSendType(type: string) {
    setBatchTokenData({ type: 'UPDATE_SEND_TYPE', payload: type })
  }

  const [sendNumber, setsendNumber] = useState('1')
  const [splitArr, setsplitArr] = useState([] as any)

  useEffect(() => {
    if (
      batchTokenData.nextClick === true &&
      batchTokenData.operationType === 'manual'
    ) {
      parseAddrs(batchTokenData.address)
      console.log('---', batchTokenData)
      setBatchTokenData({ type: 'UPDATE_NEXT_STEP', payload: false })
    }
  }, [batchTokenData.nextClick])

  useEffect(() => {
    if (batchTokenData.simpleNumber) {
      setsendNumber(batchTokenData.simpleNumber.toString())
    }
  }, [batchTokenData.simpleNumber])

  function parseAddrs(addrs: string) {
    let errArr: any = []
    let addrsArr = addrs.split('\n')
    setsplitArr(addrsArr)
    let reduceAddrArr = [...addrsArr]
    addrsArr.forEach((item, index) => {
      let isAddr
      let newItem: Array<string>
      if (batchTokenData.sendType === 'advanced') {
        newItem = item.split(',')
        isAddr = isAddress(newItem[0])
      } else {
        newItem = [item]
        isAddr = isAddress(item)
      }
      if (!isAddr) {
        errArr.push({
          row: index + 1,
          content: walletAddress(newItem[0]),
          msg: 'not a valid address',
        })
      }

      reduceAddrArr.forEach((element, eindex) => {
        let newElement = element.split(',')
        if (newItem[0] === newElement[0] && index !== eindex) {
          reduceAddrArr.splice(index, 1, '')
          reduceAddrArr.splice(eindex, 1, '')
          console.log('reduceAddrArr', reduceAddrArr)
          errArr.push({
            row: eindex + 1,
            content: walletAddress(newItem[0]),
            msg: 'duplicate address',
          })
        }
      })
      if (batchTokenData.sendType === 'advanced') {
        console.log(
          'positive(newItem[1])',
          positive(Number(newItem[1])),
          Number(newItem[1])
        )
        if (!positive(Number(newItem[1]))) {
          errArr.push({
            row: index + 1,
            content: walletAddress(newItem[0]),
            msg: newItem[1] + ' not correct number',
          })
        }
      }
    })
    if (errArr.length > 0) {
      setBatchTokenData({
        type: 'UPDATE_ADDR_ERR',
        payload: { show: true, errs: errArr },
      })
    } else {
      setBatchTokenData({
        type: 'UPDATE_ADDR_ERR',
        payload: { show: false, errs: [] },
      })
      let newItems: Array<object> = []
      addrsArr.map((item: string) => {
        if (sendType === 'advanced') {
          newItems.push(item.split(','))
        } else {
          newItems.push([item, sendNumber])
        }
      })
      setBatchTokenData({ type: 'UPDATE_PARSED_ADDRESS', payload: newItems })
      setBatchTokenData({ type: 'UPDATE_STEP', payload: 2 })
    }
  }

  function sendNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (positive(Number(e.target.value)) || Number(e.target.value) === 0) {
      setsendNumber(e.target.value)
      setBatchTokenData({
        type: 'UPDATE_SIMLE_NUMBER',
        payload: e.target.value,
      })
    }
  }
  function removeErr() {
    let correctArr: any = []
    let errIndexes = batchTokenData.addrErr.errs.map((item) => item.row - 1)

    correctArr = splitArr.filter((item: any, index: number) => {
      return !errIndexes.includes(index)
    })
    console.log('function:removeErr:correctArr', correctArr)
    setsplitArr(correctArr)
    setBatchTokenData({
      type: 'UPDATE_ADDRESS',
      payload: correctArr.join('\n'),
    })
  }

  const revertSendType = sendType === 'simple' ? 'advanced' : 'simple'
  const nextStep = () => {
    setBatchTokenData({
      type: 'UPDATE_NEXT_STEP',
      payload: !batchTokenData.nextClick,
    })
    console.log('state', batchTokenData)
  }
  const setNumberNone = () => {
    setsendNumber('')
  }
  const ErrList = () => {
    if (batchTokenData.addrErr.show) {
      return (
        <>
          <div className="h-32 p-5 overflow-y-auto text-red-600 border border-red-500 rounded-lg error">
            {batchTokenData.addrErr.errs.map((value, index, array) => {
              return (
                <div className="grid grid-cols-3" key={index}>
                  <b>{value.row}</b>
                  <span className="truncate">{value.content}</span>
                  <span className="truncate">{value.msg}</span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end mt-2 text-red-500 cursor-pointer">
            {batchTokenData.operationType === 'manual' && (
              <span onClick={removeErr}>Remove all error</span>
            )}
            {/* <span className="ml-6" onClick={removeDuplicate}>
              Remove duplicate
            </span> */}
          </div>
        </>
      )
    }
    return <></>
  }

  return (
    <>
      {sendType === 'simple' && batchTokenData.operationType === 'manual' && (
        <div className="flex items-center my-5 text-gray-500">
          Send
          <div className="flex items-center justify-between w-40 mx-5 input input-bordered">
            <input
              type="text"
              placeholder="10"
              className="w-20 outline-none"
              value={sendNumber}
              onChange={sendNumberChange}
              onFocus={setNumberNone}
            />
            <span>{batchTokenData.unit}</span>
          </div>
          per wallet address
        </div>
      )}
      {batchTokenData.operationType === 'manual' && (
        <div className="my-2">
          Switch to
          <button
            className="mx-1 btn btn-xs"
            onClick={() => setSendType(revertSendType)}
          >
            {revertSendType}
          </button>
          {sendType === 'simple'
            ? 'mode to send different count'
            : 'mode send same count'}
        </div>
      )}

      <ErrList />
      {walletConect ? (
        <button
          className="w-full mt-5 bg-black btn rounded-xl"
          onClick={nextStep}
        >
          Next Step
        </button>
      ) : (
        <button
          className="w-full mt-5 bg-black btn rounded-xl"
          onClick={() => {
            connect()
          }}
        >
          Connect Wallet
        </button>
      )}
    </>
  )
}
