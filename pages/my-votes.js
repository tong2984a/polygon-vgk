import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'
import { initializeApp, getApps } from "firebase/app"
import { getStorage, ref, listAll } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [showModal, setShowModal] = useState(false)
  const [address, setAddress] = useState('')
  const [bought, setBought] = useState([])
  const [balance, setBalance] = useState(0)

  async function getMETT(currentAccount) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const nftContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    nftContract.balanceOf(currentAccount)
      .then(res => {
        setBalance(parseInt(Number(ethers.utils.formatEther( res ))))
      })
      .catch(err => console.error(err))
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== address) {
      setAddress(accounts[0]);
      getMETT(accounts[0]);
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
      const querySnapshot = await getDocs(collection(db, "votes"));
      const items = [];
      querySnapshot.forEach((doc) => {
        let vote = doc.data();
        let item = {
          id: doc.id,
          price: vote.price,
          image: vote.fileUrl,
          name: vote.name,
          description: vote.description,
          sold: vote.sold,
          seller: vote.seller,
          owner: vote.owner,
          rfp: vote.rfp,
          theme: vote.theme,
          rating: vote.rating
        }
        items.push(item)
      })
      const myVotes = items.filter(i => i.owner.toUpperCase() === address.toUpperCase())
      setBought(myVotes)
      setLoadingState('loaded')
    }
    loadFirebase()
    return function cleanup() {
      //mounted = false
    }
  }, [address])

  if (showModal) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <p>Please wait. Your METAMASK wallet will prompt you once for putting your creative work up on auction.</p>
    </div>
  )
  if (loadingState === 'loaded' && (bought.length == 0)) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <h1 className="px-20 py-10 text-3xl">No propsals in marketplace</h1>
      <p className="px-20 py-10">Please use Submit Proposal to upload your proposal.</p>
    </div>
  )
  return (
    <div>
      <div className="header">{address}</div>
      <div className="p-4">
        <h2 className="text-2xl py-2">Your NFT account balance determines your voting power. e.g. 1 NFT = 1 vote.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            bought.map((nft, i) => (
              <div key={i} className="col">
                <div className="card shadow-sm">
                  <div className="card-header text-center">
                    {nft.theme}
                  </div>
                  <div>
                    <Image src={nft.image} alt="NFT on display" width="100%" height="100%"  />
                  </div>
                  <div className="card-body">
                    <h5 className="card-text">{nft.name}</h5>
                    <p className="card-text">AI Rating: {nft.rating}</p>
                    <p className="card-text">{nft.description}</p>
                    <p className="card-text">BET: {nft.price} MATIC</p>
                    <div className="p-1 bg-black">
                      <p className="font-bold text-red-500">Your Weighted Vote - {balance}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
