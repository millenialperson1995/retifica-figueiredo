"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { apiServiceOptimized } from "@/lib/apiOptimized";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DeleteButtonProps {
  id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.')) return;
    setLoading(true);
    try {
      await apiServiceOptimized.deleteInventoryItem(id);
      toast({
        title: "Item excluído",
        description: "O item foi excluído com sucesso!",
      });
      router.push('/inventory');
    } catch (err: any) {
      console.error('Erro ao deletar item:', err);
      toast({
        title: "Erro ao excluir item",
        description: err?.message || 'Erro ao deletar item',
        variant: "destructive",
      });
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
