// components/dashboard/team/AddMemberButton.tsx
"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import AddMemberModal from "./AddMemberModal";

interface AddMemberButtonProps {
  currentUserRole: string;
}

export default function AddMemberButton({ currentUserRole }: AddMemberButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn btn-primary gap-2"
      >
        <UserPlus className="w-5 h-5" />
        Ajouter un membre
      </button>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserRole={currentUserRole}
      />
    </>
  );
}