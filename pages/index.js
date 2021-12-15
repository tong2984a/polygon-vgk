import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { initializeApp, getApps } from "firebase/app"
import { getStorage, ref, listAll } from "firebase/storage";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from "firebase/firestore";

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function Home() {
  const router = useRouter()

  return (
    <div className="container my-4">
      <header className="masthead">
        <div className="container h-100">
          <div className="row h-100 align-items-center">
            <div className="col-12 text-center">
              <h1 className="fw-light cloudy-knoxville-gradient">Selling Green Products? 售賣綠色產品嗎?</h1>
              <p className="lead heavy-rain-gradient">Be the first to get your NFT.</p>
            </div>
            <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
              <button type="button" className="btn btn-light btn-lg px-4 gap-3"
                onClick={() => router.push('/nfts')}>Start for Free</button>
              <button type="button" className="btn btn-primary btn-lg px-4"
                onClick={() => router.push('/catalog')}>Get More with Pro</button>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}
