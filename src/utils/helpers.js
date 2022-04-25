import minABI from './minimumABI.json'
import { ethers } from 'ethers'
//Globals
const tellorAddressMainnet = '0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0'
const tellorAddressPolygon = '0xE3322702BEdaaEd36CdDAb233360B939775ae5f1'
const tellorAddressMumbai = '0x45cAF1aae42BA5565EC92362896cc8e0d55a2126'
const tellorAddressGoerli = '0x002E861910D7f87BAa832A22Ac436F25FB66FA24'

//Local Helpers
const timeConverter = (seconds) => {
  let hoursInDay = 24
  let minutesInHour = 60
  let secondsInMinute = 60
  let minutes = seconds / secondsInMinute
  let hours = minutes / minutesInHour
  let days = hours / hoursInDay

  if (days >= 1) {
    return days > 1 ? `${days} days` : `${days} day`
  } else if (days < 1 && hours >= 1) {
    return hours > 1 ? `${hours} hours` : `${hours} hour`
  } else if (hours < 1 && minutes >= 1) {
    return minutes > 1 ? `${minutes} minutes` : `${minutes} minute`
  }
}

const nameHelper = (timestamp) => {
  let january12022 = 1640995200
  let april12022 = 1648771200
  let july12022 = 1656633600
  let october12022 = 1664582400
  let january12023 = 1672531200
  let april12023 = 1680307200
  let july12023 = 1688169600
  let october12023 = 1696118400

  switch (true) {
    case timestamp > october12023:
      return 'Q4 2023 Treasury'
    case timestamp > july12023:
      return 'Q3 2023 Treasury'
    case timestamp > april12023:
      return 'Q2 2023 Treasury'
    case timestamp > january12023:
      return 'Q1 2023 Treasury'
    case timestamp > october12022:
      return 'Q4 2022 Treasury'
    case timestamp > july12022:
      return 'Q3 2022 Treasury'
    case timestamp > april12022:
      return 'Q2 2022 Treasury'
    case timestamp > january12022:
      return 'Q1 2022 Treasury'

    default:
      return 'Upgrade nameHelper Constraints'
  }
}

const timerHelper = (startDate, duration) => {
  // console.log('startDate', startDate)
  // console.log('duration', duration)
  const totalTime = parseInt(startDate) + parseInt(duration)
  const date = new Date(totalTime * 1000)
  const dateArr = date.toString().split(' ')
  return `${dateArr[1]} ${dateArr[2]}, ${dateArr[3]} @ ${dateArr[4]}`
}

const payoutTimerHelper = (eventDate) => {
  // console.log('eventDate', eventDate)
  const date = new Date(eventDate * 1000)
  const dateArr = date.toString().split(' ')
  return `${dateArr[1]} ${dateArr[2]}, ${dateArr[3]} @ ${dateArr[4]}`
}

const activeHelper = (startDate, duration) => {
  const payoutUnixTime = parseInt(startDate) + parseInt(duration)
  const nowUnixTime = Math.floor(Date.now() / 1000)
  return payoutUnixTime > nowUnixTime ? true : false
}

export const truncateAddr = (addr) => {
  return addr.slice(0, 6) + '...' + addr.slice(-4)
}

export const getAssetBalances = async (web3, address, chainId) => {
  //Instantiating Contracts
  const trbContractEthereum = new web3.eth.Contract(
    minABI,
    tellorAddressMainnet
  )
  const trbContractPolygon = new web3.eth.Contract(minABI, tellorAddressPolygon)
  const trbContractMumbai = new web3.eth.Contract(minABI, tellorAddressMumbai)
  const trbContractGoerli = new web3.eth.Contract(minABI, tellorAddressGoerli)
  //Function Globals
  let chainMainTokenBalance
  let trbBalance

  switch (chainId) {
    case 1:
      //Main Chain Balance - ETHEREUM MAINNET
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractEthereum.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 4:
      //Main Chain Balance - RINKEBY
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractEthereum.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 5:
      //Main Chain Balance - GOERLI
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractGoerli.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 137:
      //Main Chain Balance - MATIC/POLYGON MAINNET
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractPolygon.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    case 80001:
      //Main Chain Balance - MUMBAI
      chainMainTokenBalance = web3.utils.fromWei(
        await web3.eth.getBalance(address)
      )
      trbBalance = await trbContractMumbai.methods
        .balanceOf(address)
        .call()
        .then((res) => web3.utils.fromWei(res))
      //Add more assets here if needed
      return {
        main: Math.round(chainMainTokenBalance * 100) / 100,
        trb: Math.round(trbBalance * 100) / 100,
      }
    default:
      return null
  }
}

export const decodingMiddleware = (events) => {
  const issuedArray = []
  const boughtArray = []
  const paidArray = []

  events.treasuryIssuedEntities &&
    events.treasuryIssuedEntities.forEach((entity) => {
      let clone = JSON.parse(JSON.stringify(entity))
      clone.durationSeconds = clone.duration
      clone.duration = timeConverter(clone.duration)
      clone.maxAmount = `${ethers.utils.formatEther(clone.maxAmount)} TRB`
      clone.totalLocked = `${ethers.utils.formatEther(clone.totalLocked)} TRB`
      // clone.totalLocked = '0 TRB'
      clone.rate = `${clone.rate / 100}%`
      clone.treasuryName = nameHelper(clone.dateStarted)
      clone.payoutDate = timerHelper(clone.dateStarted, clone.durationSeconds)
      clone.active = activeHelper(clone.dateStarted, clone.durationSeconds)
      issuedArray.push(clone)
    })
  events.treasuryPurchasedEntities &&
    events.treasuryPurchasedEntities.forEach((entity) => {
      let clone = JSON.parse(JSON.stringify(entity))
      //console.log('clone', clone)
      clone.durationSeconds = clone.duration
      clone.duration = timeConverter(clone.duration)
      clone.maxAmount = `${ethers.utils.formatEther(clone.maxAmount)} TRB`
      clone.totalLocked = `${ethers.utils.formatEther(clone.totalLocked)} TRB`
      clone.rate = `${clone.rate / 100}%`
      clone.payoutDate = timerHelper(clone.dateStarted, clone.durationSeconds)
      clone.treasuryName = nameHelper(clone.timestamp)
      clone.amountBought = `${ethers.utils.formatEther(clone.amountBought)} TRB`
      clone.investor = ethers.utils.getAddress(clone.investor)
      clone.active = activeHelper(clone.timestamp, clone.durationSeconds)
      clone.dateBought = payoutTimerHelper(clone.timestamp)
      boughtArray.push(clone)
    })
  events.treasuryPaidEntities &&
    events.treasuryPaidEntities.forEach((entity) => {
      let clone = JSON.parse(JSON.stringify(entity))
      // console.log('clone', clone)
      clone.duration = timeConverter(clone.duration)
      clone.maxAmount = `${ethers.utils.formatEther(clone.maxAmount)} TRB`
      clone.totalLocked = `${ethers.utils.formatEther(clone.totalLocked)} TRB`
      clone.rate = `${clone.rate / 100}%`
      clone.amountPaid = `${ethers.utils.formatEther(clone.amountPaid)} TRB`
      clone.investor = ethers.utils.getAddress(clone.investor)
      clone.treasuryName = nameHelper(clone.dateStarted)
      clone.datePaid = payoutTimerHelper(clone.timestamp)
      paidArray.push(clone)
    })

  return {
    issuedTreasuries: issuedArray,
    boughtTreasuries: boughtArray,
    paidTreasuries: paidArray,
  }
}
