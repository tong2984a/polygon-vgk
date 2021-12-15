import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'
import { useRouter } from 'next/router'
import Clock from './Clock'
import { initializeApp, getApps } from "firebase/app"
import { getStorage, ref, listAll } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, setDoc, doc, updateDoc, query, orderBy, limit, where } from "firebase/firestore";

import {
  nftaddress, nftmarketaddress,
  GOODaddress,
  BREWaddress,
  KHMaddress,
  GVGaddress,
  GVGGaddress,
  LNCaddress,
  OVOaddress,
  BGaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import Chocho from '../artifacts/contracts/Chocho.sol/Chocho.json'

export default function Home() {
  const [dividends, setDividends] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [showModal, setShowModal] = useState(false)
  const [showModalMessage, setShowModalMessage] = useState('')
  const [address, setAddress] = useState('')
  const [connectToWallet, setConnectToWallet] = useState(false)
  const router = useRouter()

  async function admin_pay(dividend) {
    if (!window.ethereum || !address) {
      setShowModalMessage("Unable to process without a crypto wallet. Please refresh screen to try again.")
    } else {
      setShowModal(true)
      try {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        /* next, create the item */
        let contract = new ethers.Contract(GOODaddress, Chocho.abi, signer)
        let contract_owner = "0x05C51629Af33c6Fb143B2d24a9EB3fDe2EA318a7" //ClubMember for Mumbai
        contract_owner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" //NOUNS for localhost
        contract.balanceOf(contract_owner)
          .then(res => {
            console.log("****balanceOf contract_owner", parseInt(Number(ethers.utils.formatEther( res ))))
          })
          .catch(err => console.error(err))
        let eth_basePrice = ethers.utils.parseUnits("1", 'ether')
        console.log("****address", dividend.address)
        dividend.address = "0xE5C9e41248aEe0BA21f60EFA00aEF8aBb68d9d8d" //FatCave2
        dividend.address = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" //Hardhat2
        contract.balanceOf(dividend.address)
          .then(res => {
            console.log("****balanceOf dividend.address", parseInt(Number(ethers.utils.formatEther( res ))))
          })
          .catch(err => console.error(err))
        let transaction = await contract.transferFrom(contract_owner, dividend.address, eth_basePrice)
        await transaction.wait()
        contract.balanceOf(contract_owner)
          .then(res => {
            console.log("****balanceOf contract_owner", parseInt(Number(ethers.utils.formatEther( res ))))
          })
          .catch(err => console.error(err))
        contract.balanceOf(dividend.address)
          .then(res => {
            console.log("****balanceOf dividend.address", parseInt(Number(ethers.utils.formatEther( res ))))
          })
          .catch(err => console.error(err))
      } catch (error) {
        if (error.data) {
          setShowModalMessage(error.data.message)
        } else {
          setShowModalMessage(error.message)
        }
      }
      setShowModal(false)
    }
  }

  function countdownEndTime() {
    const b = new Date()
    let days = Math.max(30 - b.getUTCDate(), 0)
    return Math.floor((Date.now() + (24*60*60*1000*days)) / 1000)
    //return Math.floor((Date.now() + (24*60*6*1)) / 1000)
  }

  async function nextFaucet() {
    if (connectToWallet) {
      const firebaseConfig = {
        // INSERT YOUR OWN CONFIG HERE
        apiKey: "AIzaSyBg34hCq_jGHdj-HNWi2ZjfqhM2YgWq4ek",
        authDomain: "pay-a-vegan.firebaseapp.com",
        databaseURL: "https://pay-a-vegan.firebaseio.com",
        projectId: "pay-a-vegan",
        storageBucket: "pay-a-vegan.appspot.com",
        messagingSenderId: "587888386485",
        appId: "1:587888386485:web:3a81137924d19cbe2439fc",
        measurementId: "G-MGJK6GF9YW"
      };

      const app = initializeApp(firebaseConfig)
      const db = getFirestore(app)

      const coinsRef = collection(db, "coins");
      const coinsQuery = query(coinsRef,
        orderBy("account"));
      const querySnapshot = await getDocs(coinsQuery);

      querySnapshot.forEach((snapshot) => {
        let coins = snapshot.data();
        dividends.forEach((dividend, i) => {
          if (dividend.account.toUpperCase() === coins.account.toUpperCase()) {
            dividend.payout = Math.min(10000 * coins.balance, 0.1)
            console.log("****dividend", dividend)
            setDoc(doc(db, "faucet", dividend.account), {
              account: dividend.account,
              address: dividend.address,
              balance: (dividend.payout + dividend.balance).toFixed(2)
            })
          }
        })
      })
    }
    setLoadingState('not-loaded')
  }

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      setConnectToWallet(false)
    } else if (accounts[0] !== address) {
      setAddress(accounts[0]);
      setConnectToWallet(true)
    } else {
      setConnectToWallet(true)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(handleAccountsChanged)
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      setAddress("Non-Ethereum browser detected. You should consider installing MetaMask.")
    }
    return function cleanup() {
      //mounted = false
    }
  }, [])

  useEffect(() => {
    async function loadFirebase() {
      const firebaseConfig = {
        // INSERT YOUR OWN CONFIG HERE
        apiKey: "AIzaSyBg34hCq_jGHdj-HNWi2ZjfqhM2YgWq4ek",
        authDomain: "pay-a-vegan.firebaseapp.com",
        databaseURL: "https://pay-a-vegan.firebaseio.com",
        projectId: "pay-a-vegan",
        storageBucket: "pay-a-vegan.appspot.com",
        messagingSenderId: "587888386485",
        appId: "1:587888386485:web:3a81137924d19cbe2439fc",
        measurementId: "G-MGJK6GF9YW"
      };

      const app = initializeApp(firebaseConfig)
      const db = getFirestore(app)

      //const querySnapshot = await getDocs(collection(db, "coins"));
      const items = [];

      const coinsRef = collection(db, "faucet");
      const coins_query = query(coinsRef,
        orderBy("account"));
      const querySnapshot = await getDocs(coins_query);

      querySnapshot.forEach((doc) => {
        let faucet = doc.data();
        let item = {
          id: doc.id,
          balance: Number(faucet.balance),
          account: faucet.account,
          address: faucet.address,
        }
        items.push(item)
      })

      setDividends(items)
      setLoadingState('loaded')
    }
    loadFirebase()
    return function cleanup() {
      //mounted = false
    }
  }, [loadingState, address])

  if (loadingState === 'loaded' && !dividends.length) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <h1 className="px-20 py-10 text-3xl">No users in marketplace</h1>
    </div>
  )
  if (showModalMessage) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <p>{showModalMessage}</p>
    </div>
  )
  if (showModal) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <p>Please wait. Your METAMASK wallet will prompt you once for the purchase.</p>
      <p>We will move your purchase to your personal Collection page.</p>
    </div>
  )
  return (
    <div>
      <div className="header">{address}</div>
      <main>
        <div className="row p-4">
          <h1 className="text-2xl py-2">Faucet List.</h1>
          <div className="col-md">
              <h2 className="text-lg">Countdown to next airdrop.</h2>
              <Clock endTime={countdownEndTime()} trigger={() => nextFaucet()} />
          </div>
        </div>
        {
          dividends.map((dividend, i) => (
            <div key={i} className="row mx-3">
              <div className="col-3 themed-grid-col">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => admin_pay(dividend)}>
                  Pay
                </button>
                <small className="text-muted">{dividend.account}</small></div>
              <div className="col-3 themed-grid-col"><small className="text-muted">{dividend.address}</small></div>
              <div className="col-3 themed-grid-col"><small className="text-muted">{dividend.balance} GOOD</small></div>
            </div>
          ))
        }
      </main>
    </div>
  )
}
