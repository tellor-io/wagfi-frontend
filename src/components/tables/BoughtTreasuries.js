import React, { useState, useEffect, useContext } from 'react'
import '../../styles/AllTables.css'
import '../../styles/Button.css'
//Contexts
import { UserContext } from '../../contexts/User'
import { GraphContext } from '../../contexts/Graph'
//Utils
import { truncateAddr } from '../../utils/helpers'

function BoughtTreasuries() {
  //Context
  const graphData = useContext(GraphContext)
  const user = useContext(UserContext)
  //Component State
  const [boughtData, setBoughtData] = useState(null)

  useEffect(() => {
    if (!user.currentUser) return
    if (!graphData) return
    let temp

    switch (user.currentUser.chainId) {
      case 1:
        temp = graphData.mainnetTreasury.boughtTreasuries.filter(
          (event) => event.investor === user.currentUser.address
        )
        temp.length > 0 ? setBoughtData(temp) : setBoughtData(null)
        break
      case 3:
        temp = graphData.ropstenTreasury.boughtTreasuries.filter(
          (event) => event.investor === user.currentUser.address
        )
        temp.length > 0 ? setBoughtData(temp) : setBoughtData(null)
        break
      case 4:
        temp = graphData.rinkebyTreasury.boughtTreasuries.filter(
          (event) => event.investor === user.currentUser.address
        )
        temp.length > 0 ? setBoughtData(temp) : setBoughtData(null)
        break
      default:
        return
    }

    return () => {
      setBoughtData(null)
    }
  }, [user.currentUser, graphData])

  return (
    <>
      {boughtData ? (
        <div className="AllTables__Container">
          <h2>{`Treasuries Bought by ${
            user.currentUser && truncateAddr(user.currentUser.address)
          }`}</h2>
          <table>
            <thead className="BoughtTreasuries__Header">
              <tr>
                <th>Treasury</th>
                <th>Amount Staked</th>
                <th>Date of Stake</th>
                <th>Date of Payout </th>
              </tr>
            </thead>
            <tbody className="BoughtTreasuries__Body">
              {boughtData &&
                boughtData.map((treasury) => (
                  <tr key={treasury.id}>
                    <td>{treasury.treasuryName}</td>
                    <td>{treasury.amountBought}</td>
                    <td>{treasury.dateBought}</td>
                    <td>{treasury.payoutDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </>
  )
}

export default BoughtTreasuries
