import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { initializeApp, getApps } from "firebase/app"
import { getStorage, ref, listAll } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [showModalMint, setShowModalMint] = useState(false)
  const [address, setAddress] = useState('')
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const [optionsState, setOptionsState] = useState('')
  const router = useRouter()

  function handleChange(event) {
    setOptionsState(event.target.value);
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== address) {
      setAddress(accounts[0]);
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

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

  async function createFirebase() {
    setShowModalMint(true)

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

    try {
      if (!getApps().length) {
        //....
      }
      const app = initializeApp(firebaseConfig)
      const db = getFirestore(app)
      const colRef = collection(db, 'votes')

      addDoc(colRef, {
        name: formInput.name,
        description: formInput.description,
        price: formInput.price,
        seller: address,
        owner: address,
        rfp: optionsState,
        rating: getRndInteger(30, 99)
      });
    } catch(err){
      if (!/already exists/.test(err.message)) {
        console.error('Firebase initialization error', err.stack)
      }
    }
    setShowModalMint(false)
    router.push('/')
  }

  if (showModalMint) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <p>Please wait. Your METAMASK will prompt you for minting NFT, and then again for adding to marketplace.</p>
      <p>We will close this popup automatically when ready.</p>
    </div>
  )
  return (
    <div>
      <div className="header">{address}</div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Please use the Create Proposal button. Your proposal will be AI rated.</h2>
      </div>
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <select value={optionsState} onChange={handleChange}>
            <option value="" disabled default>Select your positive impact area</option>
            <option value="Reduce Food Waste">Reduce Food Waste</option>
            <option value="Clean Waterways">Clean Waterways</option>
            <option value="Reduce Landfill Waste">Reduce Landfill Waste</option>
          </select>
          <input
            placeholder="Proposal Name"
            className="mt-8 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
          />
          <textarea
            placeholder="Proposal Description"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
          />
          <input
            placeholder="Proposal Budget in MATIC"
            className="mt-2 border rounded p-4"
            onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
          />
          <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={createFirebase}>
            Create Proposal
          </button>
        </div>
      </div>
    </div>
  )
}
