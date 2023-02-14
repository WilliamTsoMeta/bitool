import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import SelectChain from 'components/SelectChain'
import Image from 'next/image'
import { supportChainsType } from 'types'
import { useBalance } from 'wagmi'

export interface MainNetProps {
  supportChains: supportChainsType[]
}

export function MainNet({ supportChains }: MainNetProps) {
  const { data } = useBalance()
  useEffect(() => {
    console.log('balance', data)
  }, [data])

  return (
    <>
      <div className="container max-w-2xl mx-auto mt-10 mb-96">
        <div className="grid grid-cols-3 gap-4">
          <SelectChain
            supportChains={supportChains}
            defaultChain={supportChains[0]}
          ></SelectChain>
          <input
            type="text"
            name="sendNum"
            className="col-span-2 pl-2 text-gray-400 border border-gray-300 rounded"
            placeholder="0.01"
          />
        </div>
        <input
          type="text"
          name="receiveAddress"
          className="w-full h-12 col-span-2 pl-2 mt-5 text-gray-400 border border-gray-300 rounded"
          placeholder="Receiving Address"
        />
        <h4 className="text-xl font-bold text-center my-7">Payment methods</h4>
        <div className="grid grid-cols-2 gap-4">
          <SelectChain
            supportChains={supportChains}
            defaultChain={supportChains[0]}
          ></SelectChain>
          <div className="flex items-center pl-3 border border-gray-200 rounded">
            <Image
              src={`/images/coins/USDT.webp`}
              width={28}
              height={28}
              alt="chains"
            />
            <span className="ml-5">USDT</span>
          </div>
        </div>
        <div className="flex mt-3 font-bold">
          <div>
            Your balance{' '}
            <span className="text-blue-500">
              {/* {balance?.formatted} {balance?.symbol} */}
            </span>
          </div>
          <div className="ml-auto">
            Bitool fee <span className="text-green-400">Free</span>
          </div>
        </div>
        <div className="flex items-center justify-center h-12 mt-3 text-lg font-bold text-white bg-black rounded-lg">
          Pay <span className="mx-1"> 111 </span> USDT
        </div>
      </div>
    </>
  )
}
