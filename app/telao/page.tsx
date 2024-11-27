"use client";

import { useEffect, useState } from "react";

export default function Telao() {
  const [orders, setOrders] = useState<{ code: number }[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);

  const playNotificationSound = () => {
    if (audioPermission) {
      const audio = new Audio("/alertTelao.mp3");
      audio.play().catch((err) => console.error("Erro ao reproduzir áudio:", err));
      console.log("Áudio tocando...");
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!audioPermission) {
        setAudioPermission(true);
        console.log("Permissão de áudio concedida pela interação do usuário");
      }
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("scroll", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("scroll", handleUserInteraction);
    };
  }, [audioPermission]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=4&telao=true");
      const data = await response.json();
      // console.log(data.data);

      if (response.status === 200) {
        if (data.data.length > orders.length) {
          playNotificationSound();
        }
        setOrders(data.data);
      } else {
        console.error(data.error);
      }
    } catch (error: unknown) {
      console.error("Erro ao buscar pedidos:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);
  
// eslint-disable-next-line
  useEffect(() => {
    if (!mounted) return;

    fetchOrders();
    const fetchInterval = setInterval(fetchOrders, 5000);

    return () => clearInterval(fetchInterval);
    // eslint-disable-next-line
  }, [mounted, orders]);

  useEffect(() => {
    if (!mounted) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div style={{ height: `calc(100vh - 5rem)` }} className="w-screen bg-gray-800 text-white">
      <div className="grid grid-cols-4 gap-8 h-full w-11/12 m-auto">
        <div className="col-span-3 h-full flex items-center justify-center flex-col">
          <h1 className="text-3xl lg:text-5xl mb-10 font-semibold text-center text-gray-200">
            Último pedido pronto
          </h1>
          <h2 className="w-3/4 sm:w-48 md:w-72 lg:w-96 min-h-20 py-10 h-auto flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-5xl sm:text-6xl md:text-9xl font-extrabold rounded-lg shadow-lg">
            {orders[0] && String(orders[0].code)}
          </h2>
        </div>

        <div className="col-span-1 h-full flex items-center justify-center flex-col gap-4">
          <h1 className="text-4xl lg:block hidden text-gray-200">Anteriores</h1>
          {orders.slice(1, 6).map((order, index) => (
            <h2
              key={index}
              className="w-full lg:h-32 h-28 flex items-center justify-center bg-gradient-to-r from-green-400 to-teal-500 text-white text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
              {order && String(order.code)}
            </h2>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-0 h-20 bg-gray-900 w-full flex justify-around items-center text-gray-400 text-2xl lg:text-4xl p-4">
        <span>{currentTime.toLocaleDateString()}</span>
        <span>{currentTime.toLocaleTimeString()}</span>
      </footer>
    </div>
  );
}