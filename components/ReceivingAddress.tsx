import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import BatchTokenContext from 'context/BatchTokenContext'
import Image from 'next/image'
import axios from 'axios'
import useFileUpload from 'react-use-file-upload'
import Context from 'context/Context'
import { isAddress } from 'ethers/lib/utils.js'
import { walletAddress } from 'utils'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'

export default function ReceivingAddress() {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload()
  const [address, setaddress] = useState('')
  const batchTokenData = useContext(BatchTokenContext)
  const { sendType, setBatchTokenData } = useContext(BatchTokenContext)
  const { setContext } = useContext(Context)

  const inputRef = useRef<HTMLInputElement>(null)
  const baseurl = process.env.NEXT_PUBLIC_BASE_API

  function parseAddrs(addrs: Array<object>) {
    let errArr: any = []

    let newItems: Array<object> = []
    addrs.map((item: any, index: number) => {
      const isAddr = isAddress(item.Address)
      if (!isAddr) {
        errArr.push({
          row: index + 1,
          content: walletAddress(item.Address),
          msg: 'not a valid address',
        })
      }
      let reduceAddrArr = [...addrs]
      reduceAddrArr.forEach((element: any, eindex) => {
        if (item.Address === element.Address && index !== eindex) {
          reduceAddrArr.splice(index, 1)
          reduceAddrArr.splice(eindex, 1)
          errArr.push({
            row: index + 1,
            content: walletAddress(item.Address),
            msg: 'duplicate address',
          })
        }
      })
    })

    if (errArr.length > 0) {
      console.log('errArr', errArr)

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
      addrs.map((item: any) => {
        newItems.push([item.Address, item.Amount.toString()])
      })
      setBatchTokenData({ type: 'UPDATE_PARSED_ADDRESS', payload: newItems })
      setBatchTokenData({ type: 'UPDATE_STEP', payload: 2 })
    }
  }

  const handleSubmit = async () => {
    // e.preventDefault()

    const formData = createFormData()
    // formData.set('file', files[0])
    // formData.set('name', files[0].name)
    try {
      const parsedAddr = await axios.post(
        `${baseurl}/public/batch_token_excel`,
        formData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      if (parsedAddr.data.message === 'success') {
        parseAddrs(parsedAddr.data.data)
      } else {
        console.log(parsedAddr.data.message)
        setContext({
          type: 'SET_ALERT',
          payload: {
            type: 'alert-error',
            message: 'Please check you sheet',
            show: true,
          },
        })
      }
    } catch (error) {
      console.error('Failed to submit files.')
      setContext({
        type: 'SET_ALERT',
        payload: {
          type: 'alert-error',
          message: 'Please check you sheet',
          show: true,
        },
      })
    }
  }

  useMemo(() => {
    if (address !== '') {
      setBatchTokenData({ type: 'UPDATE_ADDRESS', payload: address })
    }
  }, [address, setBatchTokenData])

  useEffect(() => {
    setaddress(batchTokenData.address)
  }, [batchTokenData])

  useEffect(() => {
    if (
      batchTokenData.nextClick === true &&
      batchTokenData.operationType === 'upload'
    ) {
      handleSubmit().finally(() => {
        setBatchTokenData({ type: 'UPDATE_NEXT_STEP', payload: false })
      })
    }
  }, [batchTokenData.nextClick])

  function setExample(type: string) {
    // console.log('type', type)
    if (type === 'simple') {
      setaddress(
        '0x0FDa25DFb67cf0c7c92f1a9E969fC317d6368888\n0x4F64636a08A2AeFC26ed8dcF6a8881D255428c31'
      )
    } else {
      setaddress(
        '0x0FDa25DFb67cf0c7c92f1a9E969fC317d6368888,10\n0x4F64636a08A2AeFC26ed8dcF6a8881D255428c31,12'
      )
    }
  }
  // function addressChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
  //   setaddress(e.target.value)
  // }
  function toggleOperationType(type: string) {
    setBatchTokenData({ type: 'UPDATE_OPERATION_TYPE', payload: type })
  }

  const onChange = React.useCallback((value: any, viewUpdate: any) => {
    console.log('value:', value)
    setaddress(value.trim())
  }, [])
  return (
    <>
      <div className="flex items-center justify-between mt-8">
        <p className="hidden text-gray-400 lg:block">
          List of receiving addresses(one address per line)
        </p>
        <p className="text-sm text-gray-400 lg:hidden">Receiving addresses</p>
        <div className="flex border border-gray-300 rounded-full cursor-pointer select-none">
          <div
            className={`px-4 py-1 text-xs lg:text-lg text-center lg:text-left ${
              batchTokenData.operationType === 'manual'
                ? 'bg-black rounded-full text-white'
                : ''
            }`}
            onClick={() => toggleOperationType('manual')}
          >
            Manual input
          </div>
          <div
            className={`px-4 py-1 text-xs lg:text-lg text-center lg:text-left ${
              batchTokenData.operationType !== 'manual'
                ? 'bg-black rounded-full text-white'
                : ''
            }`}
            onClick={() => toggleOperationType('upload')}
          >
            Upload files
          </div>
        </div>
      </div>

      {batchTokenData.operationType === 'manual' ? (
        <>
          <div className="w-full p-1 mt-3 outline-none h-58 textarea textarea-bordered">
            <CodeMirror
              value={address}
              height="200px"
              extensions={[javascript({ jsx: true })]}
              onChange={onChange}
            />
          </div>

          <p
            className="text-right text-gray-500 cursor-pointer"
            onClick={() => setExample(batchTokenData.sendType)}
          >
            Example
          </p>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-full h-48 mt-3 outline-none textarea textarea-bordered">
            <Image
              className="cursor-pointer"
              src="/images/upload.webp"
              alt="upload"
              width={40}
              height={44}
              onClick={() => inputRef.current?.click()}
            ></Image>

            {/* Hide the crappy looking default HTML input */}
            <input
              ref={inputRef}
              type="file"
              multiple
              style={{ display: 'none' }}
              name="file"
              onChange={(e: any) => {
                setFiles(e)
                // @ts-ignore
                inputRef.current.value = null
              }}
            />
            {fileNames.length > 0 ? (
              <ul>
                {fileNames.map((name) => (
                  <li key={name}>
                    <span>{name}</span>

                    <span onClick={() => removeFile(name)}>
                      <i className="fa fa-times" />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <h4 className="mt-1 text-xl font-bold">
                Upload your profile here
              </h4>
            )}

            <p>Only support excel</p>

            {/* <button onClick={handleSubmit} className=" btn btn-outline btn-sm">
              Submit
            </button> */}
          </div>

          <a
            className="block text-right text-gray-500 cursor-pointer"
            href={`${baseurl}/public/batch_token_example`}
          >
            Download sample
          </a>
        </>
      )}
    </>
  )
}
