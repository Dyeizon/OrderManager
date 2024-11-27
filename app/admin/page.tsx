"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Items } from "../models/Item";
import { Table } from "flowbite-react";
import { useRouter } from "next/navigation";
import { ItemForm } from "../components/ItemForm";
import { ItemFormData } from "../types";
import Image from "next/image";

export default function Admin() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchItems();
    } else {
      if (status !== 'loading') {
        router.push('/');
      }
    }
  }, [session, status, router]);

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
        console.error("An unexpected error occurred.", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/items?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete item");

      setItems((prevItems) =>
        prevItems.filter((item: Items) => item._id !== id)
      );
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

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
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Mensagem de erro */}
      {error && (
        <div className="text-center text-red-600 py-4 font-bold">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="w-11/12 lg:w-9/12 m-auto mb-4 p-6 bg-white rounded-lg shadow-md border border-gray-300">
        <h1 className="text-2xl font-semibold text-orange-600 mb-4 text-center">
          Adicionar Novo Item
        </h1>
        <ItemForm onSub={handlePost} />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto w-11/12 lg:w-9/12 m-auto bg-white rounded-lg shadow-md border border-gray-300">
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
              <Table.Row
                key={String(item._id)}
                className="hover:bg-gray-100 transition-colors"
              >
                {/* Imagem */}
                <Table.Cell className="p-4">
                  {item.image ? (
                    <Image
                      src={`data:image/png;base64,${item.image}`}
                      width={100}
                      height={100}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-md m-auto border border-gray-300"
                    />
                  ) : (
                    <span className="text-gray-500">Sem imagem</span>
                  )}
                </Table.Cell>

                {/* Nome */}
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                  {item.name}
                </Table.Cell>

                {/* Categoria */}
                <Table.Cell className="text-gray-700">{item.category}</Table.Cell>

                {/* Preço */}
                <Table.Cell className="text-gray-700">
                  R${item.price.toFixed(2)}
                </Table.Cell>

                {/* Ações */}
                <Table.Cell>
                  <button
                    onClick={() => handleDelete(String(item._id))}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
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