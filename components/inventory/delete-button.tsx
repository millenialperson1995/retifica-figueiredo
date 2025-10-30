"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { apiService } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteButtonProps {
  id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.')) return;
    setLoading(true);
    try {
      await apiService.deleteInventoryItem(id);
      toast.success('Item excluído com sucesso');
      router.push('/inventory');
    } catch (err: any) {
      console.error('Erro ao deletar item:', err);
      toast.error(err?.message || 'Erro ao deletar item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
      {loading ? 'Excluindo...' : 'Excluir Item'}
    </Button>
  );
}
