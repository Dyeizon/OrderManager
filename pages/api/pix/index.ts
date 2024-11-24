import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = new MercadoPagoConfig({ accessToken: process.env.NEXTMP_TOKEN || '', options: { timeout: 5000 } });
    const payment = new Payment(client);

    switch(req.method) {
        case "POST":
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
                res.status(err.status || 400).json({error: err})
            }
            );
            break;
        case "PUT": {
            payment.cancel({
                id: String(req.query.id)
            }).then(() => res.status(200).json({cancelledId: req.query.id})).catch(console.error);
        }
    }




    
}