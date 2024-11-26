"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IOrderDataModel } from "../models/Order";

import { Accordion } from "flowbite-react";
import { statusToText } from "../lib/utils";

export default function Cozinha() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<IOrderDataModel[]>([]);
  const [draggedDiv, setDraggedDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (session) {
      fetchOrders();
      setInterval(() => {
        fetchOrders()
      }, 15000);
    } else if (status !== 'loading') {
        router.push('/')
    }
  }, [session, router, status]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=2,3,4");
      const data = await response.json();

      if (response.status === 200) {
        setOrders(data.data);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    setDraggedDiv(event.target as HTMLDivElement);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, area: number) => {
    event.preventDefault();

    if (draggedDiv && draggedDiv.id.split("-")[0] !== String(area)) {
      changeOrderStatus(draggedDiv.id.split("-")[1], area);
    }
  };

  const changeOrderStatus = async (orderId: string, to: number) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: to }),
      });

      if (!response.ok) throw new Error("Couldn't change status ID.");
      fetchOrders();
    } catch (error) {
      console.error("Error changing status ID:", error);
    }
  };

  const markAsRetrieved = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: 5 }), // Status '5' for "Retrieved".
      });

      if (!response.ok) throw new Error("Couldn't mark as retrieved.");
      fetchOrders();
    } catch (error) {
      console.error("Error marking as retrieved:", error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 auto-rows-fr mt-4">
      {/* Coluna: Na Fila */}
      <div
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 2)}
        className="w-full p-8 bg-yellow-200 rounded-2xl overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-4">{statusToText(2)}</h2>

        {orders
          .filter((order) => order.status === 2)
          .map((order: IOrderDataModel) => (
            <Accordion
              draggable
              id={`${order.status}-${order._id}`}
              onDragStart={handleDragStart}
              key={String(order._id)}
              collapseAll
              className="mb-4 bg-white shadow-md"
            >
              <Accordion.Panel>
                <Accordion.Title>
                  <span className="text-xl font-bold leading-none mr-2">
                    Pedido n° {order.code}
                  </span>
                </Accordion.Title>
                <Accordion.Content>
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-500">
                      {Object.entries(order.cart).map(
                        ([cartItemId, cartItem]) => (
                          <li key={String(cartItemId)} className="py-2">
                            <div className="inline-flex items-center gap-2">
                              <div className="border-2 rounded-md border-blue-400 w-8 h-8 flex items-center justify-center p-2">
                                {cartItem.quantity}
                              </div>
                              <p>{cartItem.item.name}</p>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          ))}
      </div>

      {/* Coluna: Em Preparação */}
      <div
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 3)}
        className="w-full p-8 bg-orange-300 rounded-2xl overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-4">{statusToText(3)}</h2>

        {orders
          .filter((order) => order.status === 3)
          .map((order: IOrderDataModel) => (
            <Accordion
              draggable
              id={`${order.status}-${order._id}`}
              onDragStart={handleDragStart}
              key={String(order._id)}
              alwaysOpen
              className="mb-4 bg-white shadow-md"
            >
              <Accordion.Panel>
                <Accordion.Title>
                  <span className="text-xl font-bold leading-none mr-2">
                    Pedido n° {order.code}
                  </span>
                </Accordion.Title>
                <Accordion.Content>
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-500">
                      {Object.entries(order.cart).map(
                        ([cartItemId, cartItem]) => (
                          <li key={String(cartItemId)} className="py-2">
                            <div className="inline-flex items-center gap-2">
                              <div className="border-2 rounded-md border-blue-400 w-8 h-8 flex items-center justify-center p-2">
                                {cartItem.quantity}
                              </div>
                              <p>{cartItem.item.name}</p>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </Accordion.Content>
              </Accordion.Panel>
            </Accordion>
          ))}
      </div>

      {/* Coluna: Pronto */}
      <div
        onDragOver={handleDragOver}
        onDrop={(event) => handleDrop(event, 4)}
        className="w-full p-8 bg-green-300 rounded-2xl overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-4">{statusToText(4)}</h2>

        {orders
          .filter((order) => order.status === 4)
          .map((order: IOrderDataModel) => (
            <div
              draggable
              id={`${order.status}-${order._id}`}
              onDragStart={handleDragStart}
              key={String(order._id)}
              className="mb-4 bg-white shadow-md p-4 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold leading-none mr-2">
                    Pedido n° {order.code}
                  </span>
                </div>
                <button
                  onClick={() => markAsRetrieved(order._id  as string)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Retirado
                </button>
              </div>
              <ul className="divide-y divide-gray-500 mt-2">
                {Object.entries(order.cart).map(([cartItemId, cartItem]) => (
                  <li key={String(cartItemId)} className="py-2">
                    <div className="inline-flex items-center gap-2">
                      <div className="border-2 rounded-md border-blue-400 w-8 h-8 flex items-center justify-center p-2">
                        {cartItem.quantity}
                      </div>
                      <p>{cartItem.item.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}