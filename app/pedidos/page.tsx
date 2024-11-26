"use client";

import { Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { IOrderDataModel } from "../models/Order";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { statusToText } from "../lib/utils";
import PaymentButtons from "../components/PaymentButtons";

export default function Pedidos() {
  const [orders, setOrders] = useState<IOrderDataModel[]>([]);
  const {data: session, status} = useSession();
  const router = useRouter();

    // eslint-disable-next-line
  useEffect(() => {
    if(session) {
      fetchOrders();
    } else {
      if(status != 'loading') {
        router.push('/')
      }
    }
    // eslint-disable-next-line
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();

      const ordersWithDates = data.data.map((order: IOrderDataModel) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }));

      if (response.status === 200) {
        setOrders(ordersWithDates);
      } else {
        console.error(data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error("An unexpected error occured.", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/orders?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete order");

      setOrders((prev) => prev.filter((order: IOrderDataModel) => order._id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  }

  const changeOrderStatus = async (orderId: string, to: number) => {
    try {
        const response = await fetch(`/api/orders?id=${orderId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({status: to}),
        });
    
        if (!response.ok) throw new Error("Couldn't change status ID.");
        fetchOrders();
      } catch (error) {
        console.error("Error changing status ID:", error);
    }
};
  
  return (
    <div>
      <div className="overflow-x-auto w-5/6 m-auto border-gray-300 border-2 rounded-lg">
      <Table className="text-center">

        <Table.Head>
          <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Data</Table.HeadCell>
        <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Código</Table.HeadCell>
          <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Valor</Table.HeadCell>
          <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Status</Table.HeadCell>
          <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Ações</Table.HeadCell>
          <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Excluir</Table.HeadCell>
        </Table.Head>

        <Table.Body className="divide-y">
        {orders.map((order: IOrderDataModel) => (
          <Table.Row key={String(order._id)} className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell>{order.createdAt.getDate()}/{order.createdAt.getMonth() + 1}/{order.createdAt.getFullYear()}</Table.Cell>
            <Table.Cell className="whitespace-nowrap font-medium">{order.code}</Table.Cell>
            <Table.Cell>R${order.total.toFixed(2)}</Table.Cell>
            <Table.Cell>{statusToText(order.status)}</Table.Cell>
            <Table.Cell className="flex justify-center items-center h-full">
              <div className="flex space-x-6">
                
                {order.status === 1 && (
                <div className="flex items-center">
                  <PaymentButtons onAction={fetchOrders} orderId={String(order._id)} orderData={order}/>
                </div>
                )}

                {order.status === 5 && (
                  <div className="flex items-center">
                    <Button color="light" onClick={() => changeOrderStatus(String(order._id), 2)}>Voltar à fila</Button>
                  </div>
                )}

              </div>
            </Table.Cell>

            <Table.Cell>
              <button onClick={() => handleDelete(String(order._id))} className="bg-red-200 px-4 py-1 rounded-md font-medium text-red-600 hover:underline dark:text-cyan-500 h-12">
                Excluir
              </button>
            </Table.Cell>
          </Table.Row>
        ))}
        </Table.Body>
      </Table>
    </div>
      
    </div>
  );
}