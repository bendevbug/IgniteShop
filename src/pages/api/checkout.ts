import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../lib/stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { priceId } = req.body;

    if(!priceId) {
        return res.status(400).json({error: 'Price not found!'})
    }

    if (req.method !== 'POST') {
        return res.status(405)
    }

    const successUrl = `${process.env.NEXT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${process.env.NEXT_URL}/`;



    const checkOutSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancel_url,
        line_items: [
            {
                price: priceId,
                quantity: 1,
            }
        ],
    })

    return res.status(201).json({
        checkoutUrl: checkOutSession.url
    })
}