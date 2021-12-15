import '../styles/globals.css'
import '../styles/spinner.css'
import '../styles/album.css'
import '../styles/product.css'
import '../styles/features.css'
import "../styles/assets/dist/css/bootstrap.min.css"
import "../styles/fontawesome-free-5.15.4-web/css/fontawesome.min.css"
import Link from 'next/link'
import Image from 'next/image'

function Marketplace({ Component, pageProps }) {
  return (
    <div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow fixed-top">
        <div className="container">
          <Link href="/">
              <a className="navbar-brand" href="#">Virtual Marketplace</a>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarResponsive">
            <ul className="navbar-nav ms-auto">
              <Link href="/nfts">
                <li className="nav-item">
                  <a className="nav-link" href="#">Mint NFT</a>
                </li>
              </Link>
              <Link href="/catalog">
                <li className="nav-item active">
                  <a className="nav-link" href="#">Mint VGK</a>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace
