"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DeleteButton from "./delete-button";

interface Props {
  id: string;
}

export default function InventoryActions({ id }: Props) {
  return (
    <div className="flex gap-3">
      <Link href="/inventory">
        <Button variant="outline">Voltar para Estoque</Button>
      </Link>

      <Link href={`/inventory/${id}/edit`}>
        <Button>Editar Item</Button>
      </Link>

      <DeleteButton id={id} />
    </div>
  );
}
