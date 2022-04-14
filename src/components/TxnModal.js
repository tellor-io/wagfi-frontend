import React, { useContext } from 'react'
import '../styles/TxnModal.css'
//Assets
import { ReactComponent as Close } from '../assets/CloseX.svg'
//Contexts
import { ModeContext } from '../contexts/Mode'
//Utils
import { truncateAddr } from '../utils/helpers'

function TxnModal({ chainId, address, bought, setBought, txnHash }) {
  //Context State
  const mode = useContext(ModeContext)
  const closeModal = () => {
    setBought(false)
  }

  console.log(chainId)
  console.log(txnHash)
  return (
    <div className="TxnModal" style={{ display: bought ? 'flex' : 'none' }}>
      <div
        className={
          mode.mode === 'dark' ? 'TxnModal__ContentLight' : 'TxnModal__Content'
        }
      >
        <div className="TxnModal__Exit">
          <Close className="TxnModal__ExitIcon" onClick={closeModal} />
        </div>
        <div className="TxnModal__Message">
          <h1>
            {address
              ? `Thank you for interacting with Tellor Treasuries, ${truncateAddr(
                  address
                )}!`
              : 'Thank you for interacting with Tellor Treasuries!'}
          </h1>
          <p>To view your transaction on etherscan, click below:</p>
          {txnHash ? (
            chainId === 1 ? (
              <a
                href={`https://etherscan.io/tx/${txnHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >{`https://etherscan.io/tx/${txnHash}`}</a>
            ) : chainId === 4 ? (
              <a
                href={`https://rinkeby.etherscan.io/tx/${txnHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >{`https://rinkeby.etherscan.io/tx/${txnHash}`}</a>
            ) : (
              <a
                href={`https://ropsten.etherscan.io/tx/${txnHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >{`https://ropsten.etherscan.io/tx/${txnHash}`}</a>
            )
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default TxnModal
