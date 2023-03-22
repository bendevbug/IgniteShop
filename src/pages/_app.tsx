import { AppProps } from "next/app";
import { globalStyles } from "../styles/global";

import logoImg from '../assets/logo.svg'
// import homeImg from '../assets/Home.png'
import { Container, Header } from "../styles/pages/app";

import Image from 'next/image'


globalStyles()

export default function App({ Component, pageProps }: AppProps) {


  return (
    <Container>
      <Header>
        <Image src={logoImg.src} alt="" width={160} height={60}/>
      </Header>
    <Component {...pageProps} />
    </Container>
  )
}
