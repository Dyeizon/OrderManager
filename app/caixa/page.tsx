"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Items } from "../models/Item";
import { Table, TextInput, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import OrderPrint from "../components/OrderPrint";
import { Cart, OrderData } from "../types";
import Image from "next/image";
import { IOrderDataModel } from "../models/Order";
import PaymentButtons from "../components/PaymentButtons";

export default function Caixa() {
  const {data: session, status} = useSession();

  const [items, setItems] = useState<Items[]>([]);
  const [filteredItems, setFilteredItems] = useState<Items[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [error, setError] = useState('');
  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [sequence, setSequence] = useState<number | null>(null);
  const [cart, setCart] = useState<Cart>({});
  const [cartSum, setCartSum] = useState(0);
  const [orderData, setOrderData] = useState<OrderData>();
  const [isQRReady, setIsQRReady] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');
  const [showPopUp, setShowPopUp] = useState<boolean>(false);

  useEffect(() => {
    if(session) {
      fetchItems();
    } else {
      if(status != 'loading') {
        router.push('/')
      }
    }
  // eslint-disable-next-line
  }, [session])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      if (response.status === 200) {
        setItems(data.data);
        setFilteredItems(data.data);
      } else {
        console.error(data.error);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        console.error("An unexpected error occured.", error);
      }
    }
  };

  const getNextCounter = async (): Promise<number> => {
    try {
      const response = await fetch("/api/counters");
      if (!response.ok) {
        throw new Error("Failed to fetch next sequence number");
      }
      const data = await response.json();
      setSequence(data.nextSequence);
      return data.nextSequence; 
    } catch (error) {
      console.error("Error fetching next sequence:", error);
      throw error;
    }
  };

  const handleOrderPost = async () => {
    setIsQRReady(false);
    if (cartSum == 0) return
    const code = await getNextCounter();
    
    const newOrderData = {
      code: code,
      status: 1,
      total: cartSum,
      cart: transformedCart,
    };
    
    if (!newOrderData.cart || newOrderData.cart.length === 0) {
      setError("Cart is empty!");
      return;
    }
    
    setOrderData(newOrderData);
    setCart({});
    setCartSum(0);
    setQuantities({});
    
    if(!newOrderData) throw new Error("No data.");
    
    try {
      fetch(`/api/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrderData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      return response.json();
    })
    .then(data => {
            setCurrentOrderId(data.data._id);
            return attachPix(data.data);
        })
        .catch(error => {
            console.error("Error creating order or attaching PIX:", error);
        });
    } catch (error) {
        console.error("Error creating order:", error);
    }
  }

  const handleType = (text: string) => {
    setSearchText(text);

    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  }

  const handleQuantityChange = (itemId: string, action: "increment" | "decrement" | number) => {
    if(typeof action == "number") {
      setQuantities(prev => ({
        ...prev,
        [itemId]: action || 0,
      }));
    } else {
      setQuantities((prev) => {
        const newQuantity = action === "increment" 
          ? (prev[itemId] || 0) + 1
          : Math.max((prev[itemId] || 0) - 1, 0);
        return { ...prev, [itemId]: newQuantity };
      });
    }
  };

  const handleAdd = (itemId: string) => {
    const quantity = quantities[itemId] || 0;
    if (quantity <= 0) return;

    setCart((prevCart) => {
      const newCart = {...prevCart};

      if(newCart[itemId]) {
        newCart[itemId].quantity = quantity;
      } else {
        const item = items.find((item) => item._id === itemId);
        if(item) {
          newCart[itemId] = {item, quantity};
        }
      }
      setCartSum(cartSum + quantity * newCart[itemId].item.price);

      if(searchText) handleType("");
      return newCart;
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      setCartSum(cartSum - updatedCart[itemId].quantity * updatedCart[itemId].item.price);
      delete updatedCart[itemId];
      return updatedCart;
    });

    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[itemId];
      return updatedQuantities;
    });
  }

  // eslint-disable-next-line
  const transformedCart = Object.entries(cart).reduce((acc: any, [key, value]) => {
    acc[key] = {
      item: {
        _id: value.item._id,
        name: value.item.name,
        price: value.item.price,
      },
      quantity: value.quantity,
    };
    return acc;
  }, {});

  const attachPix = async (newOrderData: IOrderDataModel) => {
    try {
        const response = await fetch(`/api/pix`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newOrderData),
        });
    
        if (!response.ok) throw new Error("Couldn't generate pix payment.");
        const data = await response.json();


        const mercadoPagoId = String(data.response.id);
        const qrCode64 = data.response.point_of_interaction?.transaction_data?.qr_code_base64;
        const qrCodeLink = data.response.point_of_interaction?.transaction_data?.ticket_url;


        await fetch(`/api/orders?id=${newOrderData._id}`, {
          method: "PUT",
          credentials: "include",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({mercadoPagoId: mercadoPagoId, qrCode64: qrCode64, qrCodeLink: qrCodeLink}),
        }).then(async (res) => {
          setOrderData(await res.json())
          setIsQRReady(true);
          setShowPopUp(true);
        }).catch(err => {
          if (err) throw new Error("Couldn't update the order to attach the pix.");
        });


      } catch (error) {
        console.error("Error attaching pix payment:", error);
      }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {error && <h1 className="text-red-500 text-center mb-4">{error}</h1>}
  
      {isQRReady && <OrderPrint orderData={orderData} />}
  
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6 space-y-4 lg:space-y-0">
        {/* Search Bar */}
        <div className="flex items-center w-full lg:w-1/2 space-x-4 bg-white p-4 rounded-md shadow-sm border border-gray-300">
          <svg
            fill="#000000"
            height="24px"
            width="24px"
            viewBox="0 0 490.4 490.4"
            className="text-gray-500"
          >
            <g>
              <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796 s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z" />
            </g>
          </svg>
          <TextInput
            className="w-full"
            placeholder="Buscar itens..."
            type="text"
            value={searchText}
            onChange={(e) => handleType(e.currentTarget.value)}
          />
        </div>


        {showPopUp && orderData && sequence && (
          <div className="flex items-center px-8 py-3 rounded-xl bg-green-300">
            <span className="mr-4">Pagamento do pedido <b>n°{sequence}</b></span>
            <PaymentButtons onAction={() => setShowPopUp(false)} orderId={currentOrderId} orderData={orderData}/>
          </div>
        )}
      </div>
  
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items Table */}
        <div className="overflow-x-auto w-full lg:w-1/2 bg-white shadow-md rounded-lg border border-gray-300">
          <Table className="text-center">
            <Table.Head>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Imagem</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Item</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Valor</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Quantidade</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredItems
                .filter((item: Items) => !(String(item._id) in cart))
                .map((item: Items) => (
                  <Table.Row key={String(item._id)} className="bg-white hover:bg-gray-50">
                    <Table.Cell>
                      {item.image ? (
                        <Image
                          src={`data:image/png;base64,${item.image}`}
                          width={1}
                          height={1}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md mx-auto"
                        />
                      ) : (
                        <></>
                      )}
                    </Table.Cell>
                    <Table.Cell className="font-medium">{item.name}</Table.Cell>
                    <Table.Cell>R${item.price.toFixed(2)}</Table.Cell>
                    <Table.Cell>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAdd(String(item._id));
                        }}
                        className="flex flex-col items-center"
                      >
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(String(item._id), "decrement")}
                            className="bg-red-500 w-10 h-10 rounded-md text-xl text-white hover:bg-red-600"
                          >
                            -
                          </button>
                          <TextInput
                            style={{ textAlign: "center" }}
                            className="w-14 text-center"
                            type="number"
                            onChange={(e) => handleQuantityChange(String(item._id), parseInt(e.currentTarget.value))}
                            value={quantities[String(item._id)] || 0}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange(String(item._id), "increment")}
                            className="bg-green-500 w-10 h-10 rounded-md text-xl text-white hover:bg-green-600"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="bg-green-200 mt-2 px-4 py-2 rounded-md text-green-600 hover:underline"
                        >
                          Adicionar ao pedido
                        </button>
                      </form>
                    </Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
  
        {/* Cart Table */}
        <div className="overflow-x-auto w-full lg:w-1/2 bg-white shadow-md rounded-lg border border-gray-300">
          <Table className="text-center">
            <Table.Head>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Item</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Valor</Table.HeadCell>
              <Table.HeadCell className="flex justify-end items-center space-x-4" style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>
                  <span className="text-xl text-green-300">R${cartSum.toFixed(2)}</span>
                <Button onClick={() => {handleOrderPost()}} className="bg-green-500 text-white" color="success">Finalizar pedido</Button>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {Object.keys(cart).length === 0 ? (
                <Table.Row className="bg-white">
                  <Table.Cell className="whitespace-nowrap font-medium">O pedido está vazio.</Table.Cell>
                </Table.Row>
              ) : (
                Object.entries(cart).map(([itemId, cartItem]) => (
                  <Table.Row key={String(itemId)} className="bg-white hover:bg-gray-50">
                    <Table.Cell className="font-medium">{cartItem.item.name}</Table.Cell>
                    <Table.Cell>
                      {quantities[String(itemId)] || 0} x R${cartItem.item.price} = R$
                      {(quantities[String(itemId)] || 0) * cartItem.item.price}
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        onClick={() => removeFromCart(String(itemId))}
                        className="bg-red-200 px-4 py-1 rounded-md text-red-600 hover:underline"
                      >
                        Remover do pedido
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );  
}