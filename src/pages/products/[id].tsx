import { GetStaticPaths, GetStaticProps } from "next"
import Stripe from "stripe"
import { stripe } from "../../lib/stripe"
import { ImageContainer, ProductContainer, ProductDetails } from "../../styles/pages/product"

import Image from "next/image"
import { useRouter } from "next/router"
import axios from "axios"
import { useState } from "react"
import Head from "next/head"

interface ProductsProps {
    product: {
        id: string,
        name: string,
        imageUrl: string,
        price: number,
        description: string,
        defaultPriceId: string,
    }
}


export default function Products({ product } : ProductsProps) {

    // enviando um usuário para um rota interna
    // const router = useRouter() 

    const[ isCreatingCheckoutSession, setIsCreatingCheckoutSession] = useState(false)

    async function HandleByProduct() {
        try {
            setIsCreatingCheckoutSession(true);

            const response = await axios.post('/api/checkout', {
                priceId: product.defaultPriceId
            })

            const { checkoutUrl } = response.data;

            // enviando um usuário para um rota externa

            window.location.href = checkoutUrl

            // enviando um usuário para um rota interna
            // router.push('/checkout')
        } catch (err) {
            setIsCreatingCheckoutSession(false);
            alert('Falha ao redirecionar ao checkout!')
        }
    }

    const { isFallback } = useRouter();

    if (isFallback) {
        return <p>Loading...</p>
    }

    console.log(product)

    return (
        <>

      <Head>
        <title>Produto | Igniteshop</title>
      </Head>

        <ProductContainer>
            <ImageContainer>
                <Image src={product.imageUrl} width={520} height={480} alt=""/>
            </ImageContainer>
            <ProductDetails>
                <h1>{product.name}</h1>
                <span>
                    {product.price}
                </span>
                <p>{product.description}</p>

                <button
                disabled={isCreatingCheckoutSession}
                onClick={(e: any) => HandleByProduct()}
                >
                    COMPRE AGORA
                </button>
            </ProductDetails>
        </ProductContainer>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {

        // se a página tivesse +100 produtos, seria melhor colocar aqui
        // os mais vendidos/mais acessados da loja, para que seja criado
        // uma versão estática e de melhor performance pro usuário
        paths: [
            {
                params: {id: 'prod_NEe3S4I6hlIYiX'}
            }
        ],
        fallback: true, //O fallback ele carrega todas as informações para devolver
        // precisamos declara um loading para que funcione
    }
}

export const getStaticProps: GetStaticProps<any, { id: string } > = async ({ params }) => {

    const productId = params.id;

    const product = await stripe.products.retrieve(productId, {
        expand: ['default_price']
    });

    const price = product.default_price as Stripe.Price

  return {
      props: {
        product: {
            id: product.id,
            name: product.name,
            imageUrl: product.images [0],
            price: new Intl.NumberFormat('pr-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(price.unit_amount / 100,),
            description: product.description,
            defaultPriceId: price.id,
        }
      },
      revalidate: 60 * 60 * 1,
    }
}