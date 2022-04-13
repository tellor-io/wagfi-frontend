import React, { useState, useContext, useEffect } from 'react'
import '../styles/Hero.css'
//Contexts
import { UserContext } from '../contexts/User'
import { ModeContext } from '../contexts/Mode'
//Components
import MetaMaskErrModal from './MetaMaskErrModal'
import TxnLoader from './TxnLoader'
import TxnModal from './TxnModal'
import BuyModal from './BuyModal'
//Table Components
import IssuedTreasuries from './tables/IssuedTreasuries'
import BoughtTreasuries from './tables/BoughtTreasuries'
import PaidTreasuries from './tables/PaidTreasuries'

function Hero({ currAddr, signer }) {
  //Component State
  const [loading, setLoading] = useState(false)
  const [buying, setBuying] = useState(false)
  const [bought, setBought] = useState(false)
  const [errMessage, setErrMessage] = useState(null)
  const [txnHash, setTxnHash] = useState(null)
  const [selected, setSelected] = useState(null)
  const [etherscanLink, setEtherscanLink] = useState(null)
  //Context
  const user = useContext(UserContext)
  const mode = useContext(ModeContext)
  console.log('user in Hero', user)
  //Refs
  const ref = React.createRef()
  const ErrModal = React.forwardRef((props, ref) => {
    return <MetaMaskErrModal ref={ref}>{props.children}</MetaMaskErrModal>
  })

  useEffect(() => {
    if (!user.currentUser) return
    switch (user.currentUser.chainId) {
      case 1:
        setEtherscanLink(user.currentUser.mainnetEtherscanLink)
        break
      case 3:
        setEtherscanLink(user.currentUser.ropstenEtherscanLink)
        break
      case 4:
        setEtherscanLink(user.currentUser.rinkebyEtherscanLink)
        break
      default:
        return
    }
  }, [user.currentUser])
  //In case user exits MetaMask or Walletconnect
  //Halfway through login process
  useEffect(() => {
    if (!user) return
    if (
      user.setupUserError === 'User closed modal' ||
      user.setupUserError === 'User Rejected'
    ) {
      user.setConnected(false)
      user.setSetupUserError(null)
    }
  }, [user])

  const startFlow = () => {
    if (user) {
      user.setConnected(true)
    }
  }
  return (
    <div className={mode.mode === 'dark' ? 'Hero' : 'HeroLight'}>
      <div className="Hero__View">
        <h1>Tellor Treasuries</h1>
        <h3>
          Staking the Q1 2022 Treasury is live! Review the details of our
          inaugural treasury offering, or{' '}
          <a
            href={
              etherscanLink
                ? etherscanLink
                : 'https://etherscan.io/address/0x3b0f3eaEFaAc9f8F7FDe406919ecEb5270fE0607'
            }
            alt={`${
              user.currentUser && user.currentUser.network
            } Tellor Treasury Contract, Etherscan Link`}
            target="_blank"
            rel="noopener noreferrer"
          >
            review the contract on Etherscan
          </a>
          . Staking is simple - Click "Deposit In This Treasury" and you'll be
          prompted to enter your desired amount to stake. Click "Submit" and
          Metamask takes it from there.
        </h3>
        <h3>
          For more information on Tellor Treasuries and how they work, review{' '}
          <a href="https://docs.tellor.io/tellor/whitepaper/tellor-oracle-overview/monetary-policy#tellor-treasuries">
            Tellor's Monetary Policy
          </a>
          .
        </h3>
        <div className="Hero__CTAContainer">
          {user.currentUser ? (
            user.currentUser.chainId === 1 ||
            user.currentUser.chainId === 3 ||
            user.currentUser.chainId === 4 ? (
              <div className="Hero__MainTable">
                <IssuedTreasuries
                  setBuying={setBuying}
                  setSelected={setSelected}
                  setErrMessage={setErrMessage}
                  setLoading={setLoading}
                  setTxnHash={setTxnHash}
                  setBought={setBought}
                />
                <BoughtTreasuries currAddr={currAddr} signer={signer} />
                <PaidTreasuries currAddr={currAddr} signer={signer} />
              </div>
            ) : (
              <div className="ConnectContainer">
                <p>
                  Connect your wallet to Ethereum Mainnet, Rinkeby Testnet or
                  Ropsten Testnet to interact with Tellor Treasuries.
                </p>
              </div>
            )
          ) : (
            <div className="ConnectContainer">
              <p>
                Connect your wallet to Ethereum Mainnet, Rinkeby Testnet or
                Ropsten Testnet to interact with Tellor Treasuries.
              </p>
              <button
                className={
                  mode.mode === 'dark' ? 'ConnectButton' : 'ConnectButtonLight'
                }
                onClick={() => startFlow()}
              >
                connect wallet
              </button>
            </div>
          )}
        </div>
      </div>
      <ErrModal innerRef={ref}>{[errMessage, setErrMessage]}</ErrModal>
      <TxnLoader loading={loading} />
      <TxnModal
        chainId={user.currentUser && user.currentUser.chainId}
        address={user.currentUser && user.currentUser.address}
        bought={bought}
        setBought={setBought}
        txnHash={txnHash}
      />
      <BuyModal
        signer={signer}
        buying={buying}
        selected={selected}
        setBuying={setBuying}
        setErrMessage={setErrMessage}
        setLoading={setLoading}
        setTxnHash={setTxnHash}
        setBought={setBought}
      />
    </div>
  )
}

export default Hero
