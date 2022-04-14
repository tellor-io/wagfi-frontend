import React, { useState, useEffect, useContext } from 'react'
import '../styles/BuyModal.css'
import { ReactComponent as Close } from '../assets/CloseX.svg'
import * as yup from 'yup'
import { formSchema } from './global/BuyModalSchema'
//Contexts
import { UserContext } from '../contexts/User'
import { GraphContext } from '../contexts/Graph'
import { ModeContext } from '../contexts/Mode'
//Utils
import TESTTellorTreasuryABI from '../utils/TESTTellorTreasuryABI.json'
import TellorTreasuryABI from '../utils/TellorTreasuryABI.json'

let initialFormValues = {
  amount: '',
}

let initialErrorValues = {
  amount: '',
}

function BuyModal({
  buying,
  selected,
  setBuying,
  setErrMessage,
  setLoading,
  setTxnHash,
  setBought,
}) {
  //Component State
  const [form, setForm] = useState(initialFormValues)
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [maxAmount, setMaxAmount] = useState(null)
  const [amountLeft, setAmountLeft] = useState(null)
  //Setting Form Errors
  const [errors, setErrors] = useState(initialErrorValues)
  //Context
  const user = useContext(UserContext)
  const mode = useContext(ModeContext)

  //useEffect for comparing values from selected treasury
  //used for form validation
  useEffect(() => {
    if (!selected) return
    let max = parseInt(selected.maxAmount.split('.')[0])
    let totalLocked = parseInt(selected.totalLocked.split('.')[0])
    let left = Math.floor(max - totalLocked)
    setMaxAmount(max)
    setAmountLeft(left)
    return () => {
      setMaxAmount(null)
      setAmountLeft(null)
    }
  }, [selected])
  //Form Validation
  const validateFormChange = (e) => {
    e.persist()
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(() => {
        if (parseInt(e.target.value) > maxAmount) {
          setErrors({
            ...errors,
            [e.target
              .name]: `Cannot exceed max treasury amount of ${selected.maxAmount}`,
          })
        } else if (parseInt(e.target.value) > amountLeft) {
          setErrors({
            ...errors,
            [e.target
              .name]: `Sorry, only ${amountLeft} TRB left on this Treasury`,
          })
        } else {
          setErrors({
            ...errors,
            [e.target.name]: '',
          })
        }
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0],
        })
      })
  }
  //Form Validation useEffect
  useEffect(() => {
    formSchema.isValid(form).then((valid) => setButtonDisabled(!valid))
  }, [form])

  //Function Handlers
  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value })
    validateFormChange(event)
  }
  const handleClose = () => {
    setForm(initialFormValues)
    setErrors(initialErrorValues)
    setBuying(false)
  }
  const handleBuy = (event) => {
    if (!user.currentUser) return

    let contract
    let abi

    if (user.currentUser.chainId === 1) {
      abi = TellorTreasuryABI
      contract = new user.currentUser.web3.eth.Contract(
        abi,
        '0x3b0f3eaEFaAc9f8F7FDe406919ecEb5270fE0607'
      )

      if (event.totalLocked < event.maxAmount) {
        setLoading(true)
        setBuying(false)
        try {
          contract.methods
            .buyTreasury(
              event.treasuryId,
              user.currentUser.web3.utils.toWei(form.amount)
            )
            .send({ from: user.currentUser.address })
            .then((res) => {
              setLoading(false)
              setTxnHash(res.hash)
              setBought(true)
              setForm(initialFormValues)
              setErrors(initialErrorValues)
            })
            .catch((err) => {
              //console.log("MetaMask Txn Err: ", err);
              setLoading(false)
              setErrMessage(err.message)
            })
        } catch (err) {
          console.log('ERR::: ', err)
          setErrMessage(err.message)
        }
      } else {
        setErrMessage("We're sorry, this treasury is fully bought up.")
      }
    } else if (user.currentUser.chainId === 4) {
      abi = TESTTellorTreasuryABI
      contract = new user.currentUser.web3.eth.Contract(
        abi,
        '0x7d69B996dee32956908f8876cE42bA09808308EA'
      )

      if (event.totalLocked < event.maxAmount) {
        setLoading(true)
        setBuying(false)
        try {
          contract.methods
            .buyTreasury(
              event.treasuryId,
              user.currentUser.web3.utils.toWei(form.amount)
            )
            .send({ from: user.currentUser.address })
            .then((res) => {
              setLoading(false)
              setTxnHash(res.hash)
              setBought(true)
              setForm(initialFormValues)
              setErrors(initialErrorValues)
            })
            .catch((err) => {
              //console.log("MetaMask Txn Err: ", err);
              setLoading(false)
              setErrMessage(err.message)
            })
        } catch (err) {
          // console.log("ERR::: ", err.message);
          setErrMessage(err.message)
        }
      } else {
        setErrMessage("We're sorry, this treasury is fully bought up.")
      }
    } else if (user.currentUser.chainId === 3) {
      abi = TESTTellorTreasuryABI
      contract = new user.currentUser.web3.eth.Contract(
        abi,
        '0xb7C38be763D1eebcBF23F99678507ca4621448A0'
      )

      if (event.totalLocked < event.maxAmount) {
        setLoading(true)
        setBuying(false)
        try {
          contract.methods
            .buyTreasury(
              event.treasuryId,
              user.currentUser.web3.utils.toWei(form.amount)
            )
            .send({ from: user.currentUser.address })
            .then((res) => {
              setLoading(false)
              setTxnHash(res.hash)
              setBought(true)
              setForm(initialFormValues)
              setErrors(initialErrorValues)
            })
            .catch((err) => {
              //console.log("MetaMask Txn Err: ", err);
              setLoading(false)
              setErrMessage(err.message)
            })
        } catch (err) {
          // console.log("ERR::: ", err.message);
          setErrMessage(err.message)
        }
      } else {
        setErrMessage("We're sorry, this treasury is fully bought up.")
      }
    }
  }

  return (
    <div className="BuyModal" style={{ display: buying ? 'flex' : 'none' }}>
      <div className="BuyModal__Content">
        <div className="BuyModal__Exit">
          <Close className="BuyModal__ExitIcon" onClick={handleClose} />
        </div>
        <div className="BuyModal__Message">
          <h1>
            Enter the amount of TRB you'd like to enter into this Tellor
            Treasury.
          </h1>
          <h2>(No need to add extra zeros)</h2>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="text"
          />
          <h5>{errors.amount}</h5>
          <button
            disabled={buttonDisabled}
            className={
              mode.mode === 'dark' ? 'Global__ButtonLight' : 'Global__Button'
            }
            onClick={() => handleBuy(selected)}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyModal
