import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "department" | "ward";
  isLoading: boolean;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  isLoading,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogDescription>
          {type === "department"
            ? "Ви дійсно бажаєте видалити це відділення? Всі палати у відділенні також будуть видалені."
            : "Ви дійсно бажаєте видалити цю палату?"}
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Скасувати
        </Button>
        <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Видалення..." : "Видалити"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
