import ReceivingAddress from 'components/ReceivingAddress'
import TokenSelector from './TokenSelector'
import SendAssetsType from 'components/SendAssetsType'
export default function Step1() {
  return (
    <>
      <TokenSelector></TokenSelector>
      <ReceivingAddress></ReceivingAddress>
      <SendAssetsType></SendAssetsType>
    </>
  )
}
