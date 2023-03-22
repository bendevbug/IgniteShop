import { styled } from "../styles"
import { HomeContainer, Product } from "../styles/pages/home"
import Image from "next/image"
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Head from 'next/head'

import { stripe } from "../lib/stripe"
import { GetStaticProps } from "next"
import Stripe from "stripe"
import Link from "next/link"


const Button = styled('button', {
  backgroundColor: "$green300",
  borderRadius: 3,
  padding: '1rem',
  border: 'none',

    span: {
      fontWeight: 'bold'
    },

    '&:hover': {
      filter: 'brightness(0.8)',
      cursor: "pointer",
    }
})


interface HomeProps {
  products: {
    id: string,
    name: string,
    imageUrl: string,
    price: number
  }[]
}


export default function Home({products} : HomeProps) {

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: false,
    mode: "free",
    slides: {
      perView: 3,
      spacing: 48,
    },
  })



  return (
    <>

      <Head>
        <title>Home | Igniteshop</title>
      </Head>

    <HomeContainer  ref={sliderRef} className="keen-slider">
      {products.map(product => {
          return (
          <Link key={product.id} href={`/products/${product.id}`} prefetch={false}>
            <Product  className="keen-slider__slide">
              <Image src={product.imageUrl} width={520} height={480} alt="" ></Image>
              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>

          )
      })}
      <pre>{JSON.stringify(products)}</pre>
    
     
    </HomeContainer>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const response = await stripe.products.list(
    {
      expand: ['data.default_price']
    }
  )


  const products = response.data.map(product => {

  const price = product.default_price as Stripe.Price

  return {
      id: product.id,
      name: product.name,
      imageUrl: product.images [0],
      price: new Intl.NumberFormat('pr-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(price.unit_amount / 100,)
    }
  })
  return {
    props: 
    {
     products,
    },
    revalidate: 60 * 60 * 2,
  }
}