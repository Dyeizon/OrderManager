"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Items } from "../models/Item";
import { Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { ItemForm } from "../components/ItemForm";
import { ItemFormData } from "../types";
import Image from "next/image";

export default function Admin() {
  const {data: session, status} = useSession();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  // eslint-disable-next-line
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

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      setItems((prevItems) => prevItems.filter((item: Items) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  const handlePost = async (data: ItemFormData) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", data.name);
      formDataToSend.append("category", data.category);
      formDataToSend.append("price", data.price.toString());

      if (data.image) {
          formDataToSend.append("image", data.image);
      }
        const response = await fetch(`/api/items`, {
            method: "POST",
            credentials: "include",
            body: formDataToSend,
        });
    
        if (!response.ok) throw new Error("Failed to create item");
        fetchItems();
    } catch (error) {
        console.error("Error creating item:", error);
    }
  }

  return (
    <div>
      {error && <h1>{error}</h1>}
      <div className="w-9/12 m-auto my-4">
        <ItemForm onSub={handlePost}/>
      </div>

      <div className="overflow-x-auto w-5/6 m-auto border-gray-300 border-2 rounded-lg">
        <Table className="text-center">

          <Table.Head>
          <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Imagem</Table.HeadCell>
            <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Nome do item</Table.HeadCell>
            <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Categoria</Table.HeadCell>
            <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Preço</Table.HeadCell>
            <Table.HeadCell style={{backgroundColor: 'var(--theme-color)', color: 'white'}}>Ações</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
          {items.map((item: Items) => (
            <Table.Row key={String(item._id)} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>
              {item.image ? (
                <Image src={`data:image/png;base64,${item.image}`} width={1} height={1} alt={item.name} className="w-24 h-24 object-cover rounded-md m-auto" />
              ) : (
                <></>
              )}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-medium">{item.name}</Table.Cell>
              <Table.Cell>{item.category}</Table.Cell>
              <Table.Cell>R${item.price.toFixed(2)}</Table.Cell>
              <Table.Cell className="flex justify-center items-center h-full">
                <div className="flex space-x-6">
                  <button onClick={() => handleDelete(String(item._id))} className="bg-red-200 px-4 py-1 rounded-md font-medium text-red-600 hover:underline dark:text-cyan-500">
                    Excluir
                  </button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
          </Table.Body>
        </Table>
      </div>
      
    </div>
  );
  
}