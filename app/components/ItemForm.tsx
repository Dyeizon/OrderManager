
"use client";

import { Button, Label, TextInput, Select, FileInput } from "flowbite-react";
import {  useState, useRef } from "react";
import { ItemFormData } from "../types";

interface ItemFormProps {
    onSub: (formData: ItemFormData) => void;
  }

export function ItemForm({onSub}: ItemFormProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState<ItemFormData>({
        name: '',
        category: 'Lanche',
        price: 0,
        image: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
      };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData((prevData) => ({
            ...prevData,
            image: file,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSub(formData);
        setFormData({
            name: '',
            category: 'Lanche',
            price: 0,
            image: null,
        })
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
        <div className="flex-1">
            <div className="mb-2">
            <Label htmlFor="name" value='Nome' />
            </div>
            <TextInput id="name" name="name" type="text" value={formData.name} onChange={handleChange} required shadow />
        </div>
        <div className="flex-1">
            <div className="mb-2">
                <Label htmlFor="categories" value="Categoria" />
            </div>
            <Select id="categories" name="category" value={formData.category} onChange={handleChange} required>
                <option>Lanche</option>
                <option>Bebida</option>
                <option>Doce</option>
            </Select>
        </div>
        <div className="flex-1">
            <div className="mb-2">
            <Label htmlFor="price" value="Preço" />
            </div>
            <TextInput id="price" type="number" name="price" step={0.010} value={formData.price} onChange={handleChange} required shadow />
        </div>

        <div>
            <div className="mb-2">
                <Label htmlFor="image" value="Imagem"/>
            </div>
            <FileInput id="image" ref={fileInputRef} name="image" onChange={handleFileChange} required accept="image/*" />
        </div>
        <Button color="success" type="submit" className="self-end">Cadastrar item</Button>
        </form>
    );
}
