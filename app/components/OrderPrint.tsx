import { useEffect, useRef } from "react";
import { Items } from "../models/Item";
import { useReactToPrint } from "react-to-print";

export interface OrderData {
    code: number;
    total: number;
    cart: {
      [key: string]: {
        item: Items;
        quantity: number;
      };
    };
}

interface OrderPrintProps {
    orderData: OrderData | undefined; 
}



export default function OrderPrint({orderData}: OrderPrintProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const reactToPrintFn = useReactToPrint({contentRef: printRef});

    useEffect(() => {
        if(orderData) reactToPrintFn();
    }, [orderData])

    return (
    <div className="print-content" ref={printRef} style={{ padding: '40px', fontFamily: 'Arial, sans-serif', textAlign: 'center'}}>
        <h1>---------- OrderManager ----------</h1>
        <h2>Resumo do pedido nº {orderData?.code}</h2>
        <p>Total: R${orderData?.total.toFixed(2)}</p>
        <table style={{ width: '60%', borderCollapse: 'collapse', margin: '20px auto' }}>
        <thead>
            <tr>
            <th style={{ border: '1px solid black', padding: '4px' }}>Item</th>
            <th style={{ border: '1px solid black', padding: '4px' }}>Quantidade</th>
            <th style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>Valor Unitário</th>
            </tr>
        </thead>
        <tbody>
            {orderData && Object.entries(orderData.cart).map(([itemId, cartItem]) => (
            <tr key={itemId}>
                <td style={{ border: '1px solid black', padding: '4px' }}>{cartItem.item.name}</td>
                <td style={{ border: '1px solid black', padding: '4px' }}>{cartItem.quantity}</td>
                <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>R${cartItem.item.price.toFixed(2)}</td>
            </tr>
            ))
            }
            <tr className="bg-slate-300">
                <td colSpan={2}style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>TOTAL</td>
                <td style={{ border: '1px solid black', padding: '4px', textAlign: 'right' }}>R${orderData?.total.toFixed(2)}</td>
            </tr>
        </tbody>
        </table>
    </div>
    )
};