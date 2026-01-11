"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductModal from "./AddProductModal";

export default function AddProductButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary gap-2"
      >
        <Plus className="w-5 h-5" />
        Ajouter un produit
      </button>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}