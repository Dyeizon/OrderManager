"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IOrderDataModel } from "../models/Order";

import { Accordion } from "flowbite-react";
import { statusToText } from "../lib/utils";

export default function Cozinha() {
    const {data: session, status} = useSession();
    const router = useRouter();

    const [orders, setOrders] = useState<IOrderDataModel[]>([]);

    const [draggedDiv, setDraggedDiv] = useState<HTMLDivElement | null>(null);

    // eslint-disable-next-line
  useEffect(() => {
    if(session) {
      fetchOrders();
      setInterval(() => {
        fetchOrders()
      }, 60000)
    } else {
      if(status != 'loading') {
        router.push('/')
      }
    }
    // eslint-disable-next-line
  }, [session])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=2,3,4");
      const data = await response.json();

      if (response.status === 200) {
        setOrders(data.data);
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

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        console.log('Dragging started');
        setDraggedDiv(event.target as HTMLDivElement);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        console.log('Dragging over drop zone');
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>, area: number) => {
        event.preventDefault();

        if(draggedDiv && draggedDiv.id.split('-')[0] != String(area)) {
            changeOrderStatus(draggedDiv?.id.split('-')[1], area);
        }
    };

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
      <div className="grid grid-cols-7 gap-4 auto-rows-fr mt-4">
        
        <div onDragOver={handleDragOver} onDrop={event => handleDrop(event, 2)} style={{height: `85vh`}} className="w-full p-8 bg-blue-300 rounded-2xl overflow-y-auto col-span-2">
            {orders.filter((order) => order.status === 2).length === 0 && (
                <span className="text-center m-auto block select-none text-gray-700 text-xl">{statusToText(2)}</span>
            )}

            {orders && orders.filter((order) => order.status === 2).map((order: IOrderDataModel) => (
                <Accordion draggable id={`${order.status}-${order._id}`} onDragStart={handleDragStart} key={String(order._id)} collapseAll className="mb-4 bg-white">
                    <Accordion.Panel>
                        <Accordion.Title>
                            <span className="text-xl font-bold leading-none mr-2">Pedido n° {order.code}</span>
                            <span className="text-sm font-medium text-green-600">{statusToText(order.status)}</span>
                        </Accordion.Title>
                        <Accordion.Content>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-500">
                                    {Object.entries(order.cart).map(([cartItemId, cartItem]) => (
                                        <li key={String(cartItemId)} className="py-2">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="border-2 rounded-md border-blue-400 w-8 h-8 flex items-center justify-center p-2">{cartItem.quantity}</div>
                                                <p>{cartItem.item.name}</p>
                                            </div>
                                        </li>
                                    ))}
                                    
                                </ul>
                            </div>
                        </Accordion.Content>
                    </Accordion.Panel>
            </Accordion>
            ))}
        </div>

        <div onDragOver={handleDragOver} onDrop={event => handleDrop(event, 3)} style={{height: `85vh`}} className="w-full min-h-12 h-min p-8 bg-yellow-100 rounded-2xl overflow-y-auto col-span-2">
            {orders.filter((order) => order.status === 3).length === 0 && (
                <span className="text-center m-auto block select-none text-gray-700 text-xl">{statusToText(3)}</span>
            )}
           
            {orders && orders.filter((order) => order.status === 3).map((order: IOrderDataModel) => (
                <Accordion draggable id={`${order.status}-${order._id}`} onDragStart={handleDragStart} key={String(order._id)} alwaysOpen className="mb-4 bg-white">
                    <Accordion.Panel>
                        <Accordion.Title>
                            <span className="text-xl font-bold leading-none mr-2">Pedido n° {order.code}</span>
                            <span className="text-sm font-medium text-green-600">{statusToText(order.status)}</span>
                        </Accordion.Title>
                        <Accordion.Content>
                            <div className="flow-root">
                                   <ul className="divide-y divide-gray-500">
                                    {Object.entries(order.cart).map(([cartItemId, cartItem]) => (
                                        <li key={String(cartItemId)} className="py-2">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="border-2 rounded-md border-blue-400 w-8 h-8 flex items-center justify-center p-2">{cartItem.quantity}</div>
                                                <p>{cartItem.item.name}</p>
                                            </div>
                                        </li>
                                    ))}
                                    
                                </ul>
                            </div>
                        </Accordion.Content>
                    </Accordion.Panel>
            </Accordion>
            ))}
        </div>

        <div onDragOver={handleDragOver} onDrop={event => handleDrop(event, 4)} style={{height: `85vh`}} className="w-full min-h-max h-min p-8 bg-green-300 rounded-2xl overflow-y-auto col-span-2">
            {orders.filter((order) => order.status === 4).length === 0 && (
                <span className="text-center m-auto block select-none text-gray-700 text-xl">{statusToText(4)}</span>
            )}
            
            {orders && orders.filter((order) => order.status === 4).map((order: IOrderDataModel) => (
                <div draggable id={`${order.status}-${order._id}`} onDragStart={handleDragStart} key={String(order._id)} className="mb-4 bg-white">
                    <Accordion.Panel>
                        <Accordion.Title onClick={(e) => e.preventDefault()}>
                            <span className="text-xl font-bold leading-none mr-2">Pedido n° {order.code}</span>
                            <span className="text-sm font-medium text-green-600">{statusToText(order.status)}</span>
                        </Accordion.Title>
                        <Accordion.Content>
                            <div className="flow-root">
                                <ul className="divide-y divide-gray-500">
                                    {Object.entries(order.cart).map(([cartItemId, cartItem]) => (
                                        <li key={String(cartItemId)} className="py-2">
                                            <div className="inline-flex items-center gap-2">
                                                <div className="border-2 rounded-md border-blue-400 w-8 h-8 flex items-center justify-center p-2">{cartItem.quantity}</div>
                                                <p>{cartItem.item.name}</p>
                                            </div>
                                        </li>
                                    ))}
                                    
                                </ul>
                            </div>
                        </Accordion.Content>
                    </Accordion.Panel>
            </div>
            ))}
        </div>

        <div onDragOver={handleDragOver} onDrop={event => handleDrop(event, 5)} style={{height: `85vh`}} className="w-full p-8 bg-green-400 rounded-2xl overflow-y-auto">
            <span className="text-center m-auto block select-none text-gray-700 text-xl">{statusToText(5)}</span>
        </div>
      </div>
    );
  }