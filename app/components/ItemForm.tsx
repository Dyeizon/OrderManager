
"use client";

import { Button, Label, TextInput, Select } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function ItemForm() {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const {data: session, status} = useSession();

    useEffect(()=>{
        if(session) {
            fetchData();
        }
    }, [status])

    const fetchData = async () => {
        try {
            const response = await fetch("/api/items", {method: "GET"});
            const data = await response.json();
            if (response.status === 200) {
                console.log(data.data)
            } else {
                console.log(data.error);
            }
        } catch (error: any) {

        }   
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            console.log('session before post', session)
            const response = await fetch(`/api/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`, // Add token to headers
                },
                credentials: "include",
                body: JSON.stringify({session, name: name, category: category, price: price}),
            });

            console.log(response);
        
            if (!response.ok) throw new Error("Failed to create item");
        } catch (error) {
            console.error("Error creating item:", error);
        }
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-wrap gap-4">
        <div className="flex-1">
            <div className="mb-2">
            <Label htmlFor="name" value='Nome do item' />
            </div>
            <TextInput id="name" type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} required shadow />
        </div>
        <div className="flex-1">
            <div className="mb-2">
                <Label htmlFor="categories" value="Categoria" />
            </div>
            <Select id="categories" value={category} onChange={(e) => setCategory(e.currentTarget.value)} required>
                <option>Lanche</option>
                <option>Bebida</option>
                <option>Doce</option>
            </Select>
        </div>
        <div className="flex-1">
            <div className="mb-2">
            <Label htmlFor="price" value="Preço" />
            </div>
            <TextInput id="price" type="number" step={0.010} value={price} onChange={(e) => setPrice(e.currentTarget.value)} required shadow />
        </div>
        <Button color="success" type="submit" className="self-end">Cadastrar item</Button>
        </form>
    );
}
