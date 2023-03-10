import BatchTokenContext from 'context/BatchTokenContext'
import { useContext } from 'react'
export default function Step3() {
  const batchTokenData = useContext(BatchTokenContext)
  const { sendType, setBatchTokenData } = useContext(BatchTokenContext)
  return (
    <>
      <div>
        <div className="items-center py-5 mt-10 bg-white border border-gray-200 px-7 rounded-xl">
          <h4 className="text-xl font-bold">Transaction hash</h4>
          <div className="w-full mt-5">
            {batchTokenData.txn.map((txn, index) => {
              return (
                <div className="mt-2" key={index}>
                  <span className="inline-block w-7/12 overflow-x-auto">
                    {txn}
                  </span>
                  <b className="float-right text-green-500 text-green">
                    SUCCESS
                  </b>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-10 overflow-x-auto overflow-y-auto h-80">
        <table className="table w-full table-zebra">
          <thead>
            <tr>
              <th>ADDRESS</th>
              <th>AMOUNT</th>
              <th>OPERATE</th>
            </tr>
          </thead>
          <tbody>
            {batchTokenData.parsedAddress.map((value, index) => {
              return (
                <tr key={index}>
                  <td>{value[0]}</td>
                  <td>
                    {value[1]}
                    <span> {batchTokenData.unit}</span>
                  </td>
                  <td>
                    <span className="text-green-500 cursor-pointer">
                      Success
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
