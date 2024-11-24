"use client";

import { useEffect, useState } from "react";

export default function Telao() {
  const [orders, setOrders] = useState<{code: number}[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=4&telao=true");
      const data = await response.json();
      console.log(data.data)

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    fetchOrders();
    const fetchInterval = setInterval(fetchOrders, 5000);

    return () => clearInterval(fetchInterval);
  }, [mounted])

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000)

    return () => clearInterval(timer);
  }, [mounted])

  if (!mounted) return null;

  return (
    <div style={{height: `calc(100vh - 5rem)`}} className="w-screen bg-slate-900 text-white">
      <div className="grid grid-cols-4 gap-4 h-full w-11/12 m-auto">
        
          <div className="col-span-3 h-full flex items-center justify-center flex-col">
            <h1 className="text-5xl mb-16">Último pedido pronto</h1>
            <h2 className="w-96 h-96 flex items-center justify-center bg-blue-800 text-9xl font-extrabold rounded-lg">{orders[0] && String(orders[0].code)}</h2>
          </div>

          <div className="col-span-1 h-full flex items-center justify-center flex-col gap-4">
            <h1 className="text-5xl">Anteriores</h1>
            <h2 className="w-full h-32 flex items-center justify-center bg-blue-800 text-7xl font-extrabold">{orders[1] && String(orders[1].code)}</h2>
            <h2 className="w-full h-32 flex items-center justify-center bg-blue-800 text-7xl font-extrabold">{orders[2] && String(orders[2].code)}</h2>
            <h2 className="w-full h-32 flex items-center justify-center bg-blue-800 text-7xl font-extrabold">{orders[3] && String(orders[3].code)}</h2>
            <h2 className="w-full h-32 flex items-center justify-center bg-blue-800 text-7xl font-extrabold">{orders[4] && String(orders[4].code)}</h2>
            <h2 className="w-full h-32 flex items-center justify-center bg-blue-800 text-7xl font-extrabold">{orders[5] && String(orders[5].code)}</h2>


          </div>

      </div>
      <footer className="absolute bottom-0 h-20 bg-slate-800 w-full flex justify-around items-center text-gray-400 text-4xl">
          <span>{currentTime.toLocaleDateString()}</span>
          <span>{currentTime.toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}