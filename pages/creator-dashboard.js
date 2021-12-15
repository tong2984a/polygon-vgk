import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { useRouter } from 'next/router'
import { initializeApp, getApps } from "firebase/app"
import { getStorage, ref, listAll } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [showModal, setShowModal] = useState(false)
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState(0)
  const router = useRouter()

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
          rating: vote.rating
        }
        items.push(item)
      })
      const myProposals = items.filter(i => i.seller.toUpperCase() === address.toUpperCase())
      setNfts(myProposals)
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
  if (loadingState === 'loaded' && (nfts.length == 0)) return (
    <div className="p-4">
      <div className="header">{address}</div>
      <h1 className="px-20 py-10 text-3xl">You have not submitted any propsals.</h1>
    </div>
  )
  return (
    <div>
      <div className="header">{address}</div>
      <div className="p-4">
        <h2 className="text-2xl py-2">My Collection - where you can find proposals. Your NFT account balance determines your voting power. e.g. 1 NFT = 1 vote.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <div key={i} className="border shadow rounded-xl overflow-hidden  bg-black">
                <div className="p-4 bg-white">
                  <p style={{ height: '64px' }} className="text-2xl font-semibold">{nft.name}</p>
                  <div style={{ height: '70px', overflow: 'hidden' }}>
                    <p className="text-gray-400">{nft.description}</p>
                  </div>
                </div>
                {nft.sold ?
                  (<div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-red-500">Budget - {nft.price} MATIC</p>
                  </div>)
                  :

                (<div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">Budget - {nft.price} MATIC</p>
                </div>)}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
