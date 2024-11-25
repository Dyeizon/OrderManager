"use client"

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";
import { OrderData } from "../types";
import Link from "next/link";

interface PaymentButtonsProps {
    orderData: OrderData;
    orderId: string;
}

export default function PaymentButtons({orderData, orderId}: PaymentButtonsProps) {
    const [openModal, setOpenModal] = useState(false);

    const markAsPaid = async () => {
        try {
            const responsePixCancel = await fetch(`/api/pix?id=${orderData.mercadoPagoId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!responsePixCancel.ok) console.error("Couldn't cancel PIX.");

            const response = await fetch(`/api/orders?id=${orderId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({status: 2}),
            });
        
            if (!response.ok) throw new Error("Couldn't mark as paid.");           
          } catch (error) {
            console.error("Error marking as paid:", error);
        }
    }

    return (
        <>
            <Modal show={openModal} onClose={() => setOpenModal(false)}>
                <Modal.Header>QR-Code do Pix</Modal.Header>
                <Modal.Body>
                <div className="space-y-6">


                {orderData && 
                    <>
                        <h1 className="text-center text-gray-400 text-md">ID do pedido ({orderData.mercadoPagoId})</h1>
                        <Link href={orderData.qrCodeLink || '#'} target="_blank" className="text-center">
                            <Image src={`data:image/png;base64,${orderData.qrCode64}`} width={24} height={24} className="w-1/2 m-auto" alt="Pix QR-Code"/>
                        </Link>
                        <h2 className="text-center text-green-700 text-2xl font-bold">R${orderData.total.toFixed(2)}</h2>
                    </>
                }

                </div>
                </Modal.Body>
                <Modal.Footer className="justify-between">
                    <Button color="success" onClick={() => {markAsPaid(); setOpenModal(false)}} className="inline-flex items-center mr-4">
                        <span className="flex items-center">Marcar como pago</span>
                    </Button>
                    <Button onClick={() => setOpenModal(false)}>Fechar</Button>
                </Modal.Footer>
            </Modal>

            <Button onClick={() => {setOpenModal(true)}} color="success" className="inline-flex items-center mr-2 h-12">
                <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 48 48">
                    <path fill="#4db6ac" d="M11.9,12h-0.68l8.04-8.04c2.62-2.61,6.86-2.61,9.48,0L36.78,12H36.1c-1.6,0-3.11,0.62-4.24,1.76	l-6.8,6.77c-0.59,0.59-1.53,0.59-2.12,0l-6.8-6.77C15.01,12.62,13.5,12,11.9,12z"></path><path fill="#4db6ac" d="M36.1,36h0.68l-8.04,8.04c-2.62,2.61-6.86,2.61-9.48,0L11.22,36h0.68c1.6,0,3.11-0.62,4.24-1.76	l6.8-6.77c0.59-0.59,1.53-0.59,2.12,0l6.8,6.77C32.99,35.38,34.5,36,36.1,36z"></path><path fill="#4db6ac" d="M44.04,28.74L38.78,34H36.1c-1.07,0-2.07-0.42-2.83-1.17l-6.8-6.78c-1.36-1.36-3.58-1.36-4.94,0	l-6.8,6.78C13.97,33.58,12.97,34,11.9,34H9.22l-5.26-5.26c-2.61-2.62-2.61-6.86,0-9.48L9.22,14h2.68c1.07,0,2.07,0.42,2.83,1.17	l6.8,6.78c0.68,0.68,1.58,1.02,2.47,1.02s1.79-0.34,2.47-1.02l6.8-6.78C34.03,14.42,35.03,14,36.1,14h2.68l5.26,5.26	C46.65,21.88,46.65,26.12,44.04,28.74z"></path>
                </svg>
                <span className="flex items-center">Pix</span>
            </Button>
        </>
    )
};