import React, { useState, createContext, useEffect } from 'react'
//The Graph
import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client'
//Utils
import { GET_TREASURY_EVENTS } from '../utils/queries'
import { decodingMiddleware } from '../utils/helpers'

export const GraphContext = createContext()

//Apollo Clients
let clientMainnet = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellortreasuriesmainhgraph',
  cache: new InMemoryCache(),
})
let clientRopsten = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellortreasuriesrophgraph',
  cache: new InMemoryCache(),
})
let clientRinkeby = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/tellor-io/tellortreasuriesrinkhgraph',
  cache: new InMemoryCache(),
})

const Graph = ({ children }) => {
  //Component State
  const [mainnetTreasury, setMainnetTreasury] = useState(null)
  const [ropstenTreasury, setRopstenTreasury] = useState(null)
  const [rinkebyTreasury, setRinkebyTreasury] = useState(null)

  //Graph Querying every 5 seconds
  const mainnet = useQuery(GET_TREASURY_EVENTS, {
    client: clientMainnet,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  const ropsten = useQuery(GET_TREASURY_EVENTS, {
    client: clientRopsten,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })
  const rinkeby = useQuery(GET_TREASURY_EVENTS, {
    client: clientRinkeby,
    fetchPolicy: 'network-only',
    pollInterval: 5000,
  })

  //useEffects for listening to reponses
  //from ApolloClient queries
  //Mainnet
  useEffect(() => {
    if (!mainnet.data) return
    mainnet.data.treasuryIssuedEntities.forEach((entity) => {
      entity.network = 'mainnet'
    })
    mainnet.data.treasuryPaidEntities.forEach((entity) => {
      entity.network = 'mainnet'
    })
    mainnet.data.treasuryPurchasedEntities.forEach((entity) => {
      entity.network = 'mainnet'
    })
    let filtered = decodingMiddleware(mainnet.data)
    setMainnetTreasury(filtered)

    return () => {
      setMainnetTreasury(null)
    }
  }, [mainnet.data, mainnet.loading, mainnet.error])
  //Ropsten
  useEffect(() => {
    if (!ropsten.data) return
    ropsten.data.treasuryIssuedEntities.forEach((entity) => {
      entity.network = 'ropsten'
    })
    ropsten.data.treasuryPaidEntities.forEach((entity) => {
      entity.network = 'ropsten'
    })
    ropsten.data.treasuryPurchasedEntities.forEach((entity) => {
      entity.network = 'ropsten'
    })
    let filtered = decodingMiddleware(ropsten.data)
    setRopstenTreasury(filtered)

    return () => {
      setRopstenTreasury(null)
    }
  }, [ropsten.data, ropsten.loading, ropsten.error])
  //Rinkeby
  useEffect(() => {
    if (!rinkeby.data) return
    rinkeby.data.treasuryIssuedEntities.forEach((entity) => {
      entity.network = 'rinkeby'
    })
    rinkeby.data.treasuryPaidEntities.forEach((entity) => {
      entity.network = 'rinkeby'
    })
    rinkeby.data.treasuryPurchasedEntities.forEach((entity) => {
      entity.network = 'rinkeby'
    })
    let filtered = decodingMiddleware(rinkeby.data)
    setRinkebyTreasury(filtered)

    return () => {
      setRinkebyTreasury(null)
    }
  }, [rinkeby.data, rinkeby.loading, rinkeby.error])

  const GraphContextObj = {
    mainnetTreasury: mainnetTreasury,
    ropstenTreasury: ropstenTreasury,
    rinkebyTreasury: rinkebyTreasury,
  }

  return (
    <GraphContext.Provider value={GraphContextObj}>
      {children}
    </GraphContext.Provider>
  )
}

export default Graph
