import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Image from 'next/image'
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
  const [modalMessage, setModalMessage] = useState()
  const [address, setAddress] = useState('')
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  const nftOptions = [{
      name: 'Happy Plantarian',
      description: 'Vegan - enjoy the difference',
      json: "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fnft0.json?alt=media&token=803591b4-a8d6-4c70-a185-7773597b1f7b"
    },{
      name: '珍心素食',
      description: 'Too Orangey for Vegan',
      json: "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fnft1.json?alt=media&token=84e9b6d8-5b9e-4654-81c5-6477a0975e33"
    },{
      name: 'TREEHOUSE',
      description: 'Vegan shines through',
      json: "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fnft2.json?alt=media&token=09159cc8-25b3-4055-b2e7-c59528c6b5f6"
    },{
      name: "MANA! SOHO",
      description: 'Play Vegan, state living',
      json: "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fnft3.json?alt=media&token=612509ae-e826-4245-b460-81b725eff11b"
    },{
      name: 'Fat Cave',
      description: 'Any Time, Any Place, Tea',
      json: "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fnft4.json?alt=media&token=2d388d98-b0a9-490a-a003-b182d9145150"
    },{
      name: '早起鳥兒的咖啡',
      description: 'Coffee, the smart choice',
      json: "https://firebasestorage.googleapis.com/v0/b/pay-a-vegan.appspot.com/o/nft%2Fnft5.json?alt=media&token=1d6b4b19-d98c-4d9e-90d0-e5bdc4b6eafa"
    }]

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

  async function mint(nftOptionId) {
    if (!window.ethereum || !address) {
      setModalMessage("Unable to process without a crypto wallet. Please refresh screen to try again.")
    } else {
      try {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
        let transaction = await contract.createToken(nftOptions[nftOptionId].json)
        let tx = await transaction.wait()
        let event = tx.events[0]
        let value = event.args[2]
        let tokenId = value.toNumber()
        console.log("*****tokenId", tokenId)
      } catch (error) {
        if (error.data) {
          setModalMessage(`Crypto Wallet Error: ${error.data.message}`)
        } else {
          setModalMessage(`Crypto Wallet Error: ${error.message}`)
        }
      }
    }
  }

  if (modalMessage) return (
    <div className="p-4">
      <p>{modalMessage}</p>
    </div>
  )
  return (
<div>
  <div className="b-example-divider"></div>

  <div className="container px-4 py-5" id="custom-cards">
    <h2 className="pb-2 border-bottom">Create your own NFT 創造自家品牌 NFT 吧！</h2>
    <p>This is a FREE platform we created to support small local businesses who sell environmentally friendly products to create their own NFT. 我們提供免費平台，讓本地綠色小商家創造 NFT。</p>
    <p>Your NFT will be showcased here to promote your businesses ! NFT 會在這個平台展示及推廣。</p>
    <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
      <div className="col">
        <div className="card shadow-sm h-100">
          <Image src="/20211209/HappyPlantarian.jpeg" className="card-img-top" width="100%" height="380" />
          <div className="card-img-overlay">
            <div className="d-flex flex-column h-80 p-5 pb-3 text-white text-shadow-1">
              <h2 className="mt-5 mb-4 display-6 lh-1 fw-bold">Vegan - enjoy the difference</h2>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">Happy Plantarian</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => mint(0)}>Mint</button>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li><a className="text-muted" href="#"><Image src="/facebook-icon-logo-white-background-editable-vector-illustration-facebook-icon-logo-141051712.jpeg" width="24" height="24" /></a></li>
                <li><a className="text-muted" href="#"><Image src="/instagram-icon_1057-2227.jpeg" width="24" height="24" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm h-100">
          <Image src="/20211209/Sincere.jpeg" className="card-img-top" width="100%" height="380" />
          <div className="card-img-overlay">
            <div className="d-flex flex-column h-80 p-5 pb-3 text-white text-shadow-1">
              <h2 className="mt-5 mb-4 display-6 lh-1 fw-bold">Too Orangey for Vegan</h2>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">珍心素食</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => mint(1)}>Mint</button>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li><a className="text-muted" href="#"><Image src="/facebook-icon-logo-white-background-editable-vector-illustration-facebook-icon-logo-141051712.jpeg" width="24" height="24" /></a></li>
                <li><a className="text-muted" href="#"><Image src="/instagram-icon_1057-2227.jpeg" width="24" height="24" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm h-100">
          <Image src="/20211209/Treehouse.jpeg" className="card-img-top" width="100%" height="380" />
          <div className="card-img-overlay">
            <div className="d-flex flex-column h-80 p-5 pb-3 text-white text-shadow-1">
              <h2 className="mt-5 mb-4 display-6 lh-1 fw-bold">Vegan shines through.</h2>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">TREEHOUSE</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => mint(2)}>Mint</button>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li><a className="text-muted" href="#"><Image src="/facebook-icon-logo-white-background-editable-vector-illustration-facebook-icon-logo-141051712.jpeg" width="24" height="24" /></a></li>
                <li><a className="text-muted" href="#"><Image src="/instagram-icon_1057-2227.jpeg" width="24" height="24" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
      <div className="col">
        <div className="card shadow-sm h-100">
          <Image src="/20211209/Mana.jpeg" className="card-img-top" width="100%" height="380" />
          <div className="card-img-overlay">
            <div className="d-flex flex-column h-80 p-5 pb-3 text-white text-shadow-1">
              <h2 className="mt-5 mb-4 display-6 lh-1 fw-bold">Play Vegan, start living</h2>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">MANA! SOHO</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => mint(3)}>Mint</button>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li><a className="text-muted" href="#"><Image src="/facebook-icon-logo-white-background-editable-vector-illustration-facebook-icon-logo-141051712.jpeg" width="24" height="24" /></a></li>
                <li><a className="text-muted" href="#"><Image src="/instagram-icon_1057-2227.jpeg" width="24" height="24" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm h-100">
          <Image src="/20211209/FatCave.jpeg" className="card-img-top" width="100%" height="380" />
          <div className="card-img-overlay">
            <div className="d-flex flex-column h-80 p-5 pb-3 text-white text-shadow-1">
              <h2 className="mt-5 mb-4 display-6 lh-1 fw-bold">Any Time, Any Place, Tea</h2>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">Fat Cave</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => mint(4)}>Mint</button>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li><a className="text-muted" href="#"><Image src="/facebook-icon-logo-white-background-editable-vector-illustration-facebook-icon-logo-141051712.jpeg" width="24" height="24" /></a></li>
                <li><a className="text-muted" href="#"><Image src="/instagram-icon_1057-2227.jpeg" width="24" height="24" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="card shadow-sm h-100">
          <Image src="/20211209/Coffee.jpeg" className="card-img-top" width="100%" height="380" />
          <div className="card-img-overlay">
            <div className="d-flex flex-column h-80 p-5 pb-3 text-white text-shadow-1">
              <h2 className="mt-5 mb-4 display-6 lh-1 fw-bold">Coffee, the smart choice</h2>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">早起鳥兒的咖啡</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => mint(5)}>Mint</button>
              </div>
              <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li><a className="text-muted" href="#"><Image src="/facebook-icon-logo-white-background-editable-vector-illustration-facebook-icon-logo-141051712.jpeg" width="24" height="24" /></a></li>
                <li><a className="text-muted" href="#"><Image src="/instagram-icon_1057-2227.jpeg" width="24" height="24" /></a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  )
}
