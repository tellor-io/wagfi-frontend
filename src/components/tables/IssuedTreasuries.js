import React, { useState, useContext, useEffect } from 'react'
import '../../styles/AllTables.css'
//Contexts
import { UserContext } from '../../contexts/User'
import { GraphContext } from '../../contexts/Graph'
import { ModeContext } from '../../contexts/Mode'
//Assets
import RedX from '../../assets/off_close.svg'
import GreenCheck from '../../assets/circle_check.svg'
//Utils
import TESTTellorTreasuryABI from '../../utils/TESTTellorTreasuryABI.json'
import TellorTreasuryABI from '../../utils/TellorTreasuryABI.json'

function IssuedTreasuries({
  setBuying,
  setSelected,
  setErrMessage,
  setLoading,
  setTxnHash,
  setBought,
}) {
  //Context
  const graphData = useContext(GraphContext)
  const user = useContext(UserContext)
  const mode = useContext(ModeContext)
  //Component State
  const [issuedData, setIssuedData] = useState(null)

  console.log(user)

  useEffect(() => {
    if (
      !graphData.mainnetTreasury ||
      !graphData.ropstenTreasury ||
      !graphData.rinkebyTreasury
    )
      return
    if (!user.currentUser.chainId) return

    switch (user.currentUser.chainId) {
      case 1:
        setIssuedData(graphData.mainnetTreasury.issuedTreasuries)
        break
      case 3:
        setIssuedData(graphData.ropstenTreasury.issuedTreasuries)
        break
      case 4:
        setIssuedData(graphData.rinkebyTreasury.issuedTreasuries)
        break
      default:
        return
    }

    return () => {
      setIssuedData(null)
    }
  }, [user.currentUser.chainId])

  //Function Handlers
  const handleSelect = (treasury) => {
    if (treasury.active) {
      setSelected(treasury)
      setBuying(true)
    } else {
      handlePayout(treasury)
    }
  }

  const handlePayout = (treasury) => {
    if (!issuedData) return
    if (!user.currentUser) return

    let contract
    let abi
    // let wasPaid;

    if (user.currentUser.chainId === 1) {
      abi = TellorTreasuryABI
      contract = new user.currentUser.web3.eth.Contract(
        abi,
        '0x3b0f3eaEFaAc9f8F7FDe406919ecEb5270fE0607'
      )

      try {
        contract
          .wasPaid(treasury.treasuryId, user.currentUser.address)
          .then((response) => {
            if (!response) {
              setLoading(true)
              contract
                .payTreasury(user.currentUser.address, treasury.treasuryId)
                .then((res) => {
                  setLoading(false)
                  setTxnHash(res.hash)
                  setBought(true)
                })
                .catch((err) => {
                  setErrMessage(err.message)
                  setLoading(false)
                })
            } else {
              setErrMessage('This treasury was already paid out.')
            }
          })
          .catch((err) => {
            setErrMessage(err.message)
          })
      } catch (err) {
        setErrMessage(err.message)
      }
    } else if (user.currentUser.chainId === 3) {
      abi = TESTTellorTreasuryABI
      contract = new user.currentUser.web3.eth.Contract(
        abi,
        '0xb7C38be763D1eebcBF23F99678507ca4621448A0'
      )

      try {
        contract
          .wasPaid(treasury.treasuryId, user.currentUser.address)
          .then((response) => {
            if (!response) {
              setLoading(true)
              contract
                .payTreasury(user.currentUser.address, treasury.treasuryId)
                .then((res) => {
                  setLoading(false)
                  setTxnHash(res.hash)
                  setBought(true)
                })
                .catch((err) => {
                  setErrMessage(err.message)
                  setLoading(false)
                })
            } else {
              setErrMessage('This treasury was already paid out.')
            }
          })
          .catch((err) => {
            setErrMessage(err.message)
          })
      } catch (err) {
        setErrMessage(err.message)
      }
    } else if (user.currentUser.chainId === 4) {
      abi = TESTTellorTreasuryABI
      contract = new user.currentUser.web3.eth.Contract(
        abi,
        '0x7d69B996dee32956908f8876cE42bA09808308EA'
      )

      try {
        contract
          .wasPaid(treasury.treasuryId, user.currentUser.address)
          .then((response) => {
            if (!response) {
              setLoading(true)
              contract
                .payTreasury(user.currentUser.address, treasury.treasuryId)
                .then((res) => {
                  setLoading(false)
                  setTxnHash(res.hash)
                  setBought(true)
                })
                .catch((err) => {
                  setErrMessage(err.message)
                  setLoading(false)
                })
            } else {
              setErrMessage('This treasury was already paid out.')
            }
          })
          .catch((err) => {
            setErrMessage(err.message)
          })
      } catch (err) {
        setErrMessage(err.message)
      }
    }
  }

  return (
    <div className="AllTables__Container">
      <h2>All Issued Treasuries</h2>
      <table>
        <thead className="IssuedTreasuries__Header">
          <tr>
            <th>Issued Treasury</th>
            <th>Max Amount</th>
            <th>Rate</th>
            <th>Duration</th>
            <th>Payout Date</th>
            <th>Active</th>
            <th>Stake</th>
          </tr>
        </thead>
        <tbody className="IssuedTreasuries__Body">
          {issuedData &&
            issuedData.map((treasury) => (
              <tr key={treasury.id}>
                <td>{treasury.treasuryName}</td>
                <td>{treasury.maxAmount}</td>
                <td>{treasury.rate}</td>
                <td>{treasury.duration}</td>
                <td>{treasury.payoutDate}</td>
                <td>
                  <img
                    src={treasury.active ? GreenCheck : RedX}
                    alt={
                      treasury.active
                        ? 'active treasury icon'
                        : 'inactive treasury icon'
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={() => handleSelect(treasury)}
                    className={
                      mode.mode === 'dark'
                        ? 'Global__Button'
                        : 'Global__ButtonLight'
                    }
                  >
                    {treasury.active
                      ? 'Deposit In This Treasury'
                      : 'Payout Deposit'}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default IssuedTreasuries
