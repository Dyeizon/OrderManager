import { MercadoPagoConfig, Payment } from 'mercadopago';

import { NextApiRequest, NextApiResponse } from 'next';

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    const client = new MercadoPagoConfig({ accessToken: process.env.NEXTMP_TOKEN || '', options: { timeout: 5000 } });

    const payment = new Payment(client);
    console.log("body no /api/pix: ", req.body)
    console.log(req.body.total)
    console.log(req.body.code)
    
    const body = {
        transaction_amount: req.body.total,
        description: `Pagamento referente ao pedido n° ${req.body.code}`,
        payment_method_id: 'pix',
        payer: {
            email: 'no-reply@ordermanager.com',
        }
    };

    payment.create({ body }).then(response =>
        res.status(200).json({response})
    ).catch(err => {
        console.error(err)
        res.status(400).json({error: err})
    }
    );
}