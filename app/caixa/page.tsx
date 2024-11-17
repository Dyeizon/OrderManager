"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Items } from "../models/Item";
import { Table, TextInput, Button } from "flowbite-react";
import { useRouter } from "next/navigation";


export default function Caixa() {
  const {data: session, status} = useSession();

  const [items, setItems] = useState<Items[]>([]);
  const [filteredItems, setFilteredItems] = useState<Items[]>([]);
  const [searchText, setSearchText] = useState<string>("");

  const [error, setError] = useState(null);
  const router = useRouter();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [cart, setCart] = useState<{ [key: string] : {item: Items, quantity: number } }>({});

  useEffect(() => {
    if(session) {
      fetchItems();
    } else {
      if(status != 'loading') {
        router.push('/')
      }
    }
  }, [session])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items");
      const data = await response.json();
      if (response.status === 200) {
        setItems(data.data);
        setFilteredItems(data.data);
      } else {
        console.log(data.error);
      }
    } catch (error: any) {
      setError(error);
    }
  };

  const handleType = (text: string) => {
    setSearchText(text);

    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredItems(filtered);
  }

  const handleQuantityChange = (itemId: string, action: "increment" | "decrement") => {
    setQuantities((prev) => {
      const newQuantity = action === "increment" 
        ? (prev[itemId] || 0) + 1
        : Math.max((prev[itemId] || 0) - 1, 0);
      return { ...prev, [itemId]: newQuantity };
    });
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
      console.log(newCart)

      if(searchText) handleType("");
      return newCart;
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const updatedCart = { ...prevCart };
      delete updatedCart[itemId];
      return updatedCart;
    });

    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[itemId];
      return updatedQuantities;
    });
  }

  const confirmCart = () => {
    console.log(cart);
  }


  return (
    <div>
      {error && <h1>{error}</h1>}

      
      <div className="w-full flex my-4 justify-between">

        <div className="w-1/2 flex space-x-4 items-center justify-center">
          <svg fill="#000000" height="24px" width="24px" version="1.1" id="search_icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
              viewBox="0 0 490.4 490.4" xmlSpace="preserve">
            <g>
              <path d="M484.1,454.796l-110.5-110.6c29.8-36.3,47.6-82.8,47.6-133.4c0-116.3-94.3-210.6-210.6-210.6S0,94.496,0,210.796
                s94.3,210.6,210.6,210.6c50.8,0,97.4-18,133.8-48l110.5,110.5c12.9,11.8,25,4.2,29.2,0C492.5,475.596,492.5,463.096,484.1,454.796z
                M41.1,210.796c0-93.6,75.9-169.5,169.5-169.5s169.6,75.9,169.6,169.5s-75.9,169.5-169.5,169.5S41.1,304.396,41.1,210.796z"/>
            </g>
          </svg>

          <TextInput className="w-9/12" style={{borderColor: '#AAA'}} type="text" value={searchText} onChange={(e) => handleType(e.currentTarget.value)}/>
        </div>

        <div>
          <Button onClick={() => confirmCart()} className="bg-green-500 text-white px-24">Finalizar pedido</Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="overflow-x-auto w-1/2 border-gray-300 border-2 rounded-lg">
          <Table className="text-center">

            <Table.Head>
            <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Imagem</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Item</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Valor</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Quantidade</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">
              {filteredItems.filter((item: Items) => !(String(item._id) in cart)).map((item: Items) => (
              <Table.Row key={String(item._id)} className="bg-white dark:border-gray-700 dark:bg-gray-800 items-center">
                <Table.Cell>
                {item.image ? (
                  <img src={`data:image/png;base64,${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded-md m-auto" />
                ) : (
                  <></>
                )}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium">{item.name}</Table.Cell>
                <Table.Cell>R${item.price}</Table.Cell>
                <Table.Cell>
                  <div className="flex space-y-2 flex-col items-center">
                    <div className="flex space-x-2 items-center">
                      <button onClick={() => handleQuantityChange(String(item._id), "decrement")} className="bg-red-500 w-10 h-10 rounded-md text-xl text-white">-</button>
                      <TextInput style={{textAlign: 'center'}} className="flex items-center w-14" id={`quantity-${item._id}`} type="number" name="quantity" value={quantities[String(item._id)] || 0} readOnly required />
                      <button onClick={() => handleQuantityChange(String(item._id), "increment")} className="bg-green-500 w-10 h-10 py-1 rounded-md text-xl text-white">+</button>
                    </div>

                    <button onClick={() => handleAdd(String(item._id))} className="bg-green-200 px-4 py-4 rounded-md font-medium text-green-600 hover:underline">Adicionar ao pedido</button>

                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
            </Table.Body>
          </Table>
        </div>

        <div className="overflow-x-auto w-1/2  border-gray-300 border-2 rounded-lg">
          <Table className="text-center">

            <Table.Head>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Item</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Valor</Table.HeadCell>
              <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Remover</Table.HeadCell>
            </Table.Head>

            <Table.Body className="divide-y">

              {
                Object.keys(cart).length === 0 ? (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 items-center">
                    <Table.Cell className="whitespace-nowrap font-medium">O carrinho está vazio.</Table.Cell>
                  </Table.Row>
                ) : (
                  Object.entries(cart).map(([itemId, cartItem]) => (
                    <Table.Row key={String(itemId)} className="bg-white dark:border-gray-700 dark:bg-gray-800 items-center">
                      <Table.Cell className="whitespace-nowrap font-medium">{cartItem.item.name}</Table.Cell>
                      <Table.Cell>{quantities[String(itemId)] || 0} x R${cartItem.item.price} = R$ {(quantities[String(itemId)] || 0) * cartItem.item.price}</Table.Cell>
                      <Table.Cell className="flex justify-center items-center h-full">
                          <button onClick={() => removeFromCart(String(itemId))} className="bg-red-200 px-4 py-1 rounded-md font-medium text-red-600 hover:underline dark:text-cyan-500">
                            Remover do pedido
                          </button>
                      </Table.Cell>
                    </Table.Row>
                  ))
                )
              }
            
            </Table.Body>
          </Table>
        </div>
      </div>
      
    </div>
  );
  
}