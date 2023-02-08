import { Select, Space } from 'antd'
import { ScriptProps } from 'next/script'
import style from 'styles/BatchToken.module.css'

export default function SelectChain(props: ScriptProps) {
  const { Option } = Select
  return (
    <>
      <div className={`w-ful ${style.chooseChain}`}>
        {
          <Select defaultValue={currentChain.name} onChange={chainChange}>
            {supportChains.map((chain) => {
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
