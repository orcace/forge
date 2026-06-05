import type { JSX } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ClearButtonProps {
  onClear: () => void;
}

export function ClearButton({ onClear }: ClearButtonProps): JSX.Element {
  return (
    <Button aria-label="Clear" onClick={onClear} size="icon" variant="ghost">
      <X aria-hidden="true" className="h-4 w-4" />
    </Button>
  );
}
