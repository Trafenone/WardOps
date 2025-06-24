import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  entityName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  loadingText?: string;
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Підтвердження видалення",
  description,
  entityName = "цей елемент",
  confirmButtonText = "Видалити",
  cancelButtonText = "Скасувати",
  loadingText = "Видалення...",
}) => {
  const finalDescription =
    description ||
    `Ви дійсно бажаєте видалити ${entityName}? Цю дію неможливо буде скасувати.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{finalDescription}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            {cancelButtonText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? loadingText : confirmButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
