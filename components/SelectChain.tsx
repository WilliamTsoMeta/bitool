import { Select, Space } from 'antd'
import { createGlobalStyle } from 'styled-components'
import { useState } from 'react'
import { supportChainsType } from 'types'
import Image from 'next/image'

interface Props {
  supportChains: supportChainsType[]
  defaultChain: supportChainsType
}
export default function SelectChain(props: Props) {
  const { Option } = Select
  const GlobalStyle = createGlobalStyle`
    .chooseChain {
      /* .ant-select{
        width: 100%;
      } */
      .ant-select-selector {
        height: 46px !important;
        border: 1px solid #355dff !important;
        line-height: 46px;
      }
      .ant-select-selection-item {
        line-height: 46px;
      }
      .ant-space {
        line-height: 46px;
      }
      .ant-select {
        width: 100%;
      }
    }
  `
  const [currentChain, setcurrentChain] = useState(props.defaultChain)

  function chainChange(value: string) {
    // if (!isDisconnected) {
    //   connect()
    // }
    console.log('value', value)
    const chain = props.supportChains.filter(
      (chain: supportChainsType) => chain.name === value
    )
    setcurrentChain(chain[0])
    // url param will changed after wallet chain changed
  }

  return (
    <>
      <GlobalStyle></GlobalStyle>
      <div className={`chooseChain`}>
        {
          <Select defaultValue={currentChain.name} onChange={chainChange}>
            {props.supportChains.map((chain) => {
              return (
                <Option value={chain.name} label={chain.name} key={chain.id}>
                  <Space>
                    <Image
                      src={`/images/support_chains/${chain.name}.png`}
                      width={28}
                      height={28}
                      alt="chain"
                      className="mr-3 h-7 w-7"
                    ></Image>
                    {chain.name}
                  </Space>
                </Option>
              )
            })}
          </Select>
        }
      </div>
    </>
  )
}
