import React, { useRef, useState, useEffect, useContext, useMemo } from 'react'
import SelectChain from 'components/SelectChain'
import Image from 'next/image'
import { supportChainType } from 'types'
import { Chain } from 'wagmi'

export interface MainNetProps {
  supportChains: Chain[]
}

export function TestNet({ supportChains }: MainNetProps) {
  return (
    <>
      <div className="container max-w-2xl mx-auto mt-10 mb-96">
        <div className="grid grid-cols-2 gap-4">
          {/* <SelectChain
            supportChains={supportChains}
            defaultChain={supportChains[0]}
          ></SelectChain> */}
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
        <input
          type="text"
          name="receiveAddress"
          className="w-full h-12 col-span-2 pl-2 mt-5 text-gray-400 border border-gray-300 rounded"
          placeholder="Receiving Address"
        />

        <div className="flex items-center justify-center h-12 mt-3 text-lg font-bold text-white bg-black rounded-lg">
          Give me the token
        </div>
      </div>
    </>
  )
}
