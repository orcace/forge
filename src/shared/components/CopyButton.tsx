import type { JSX } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface CopyButtonProps {
  onCopy: () => void;
}

export function CopyButton({ onCopy }: CopyButtonProps): JSX.Element {
  return (
    <Button aria-label="Copy" onClick={onCopy} size="icon" variant="ghost">
      <Copy aria-hidden="true" className="h-4 w-4" />
    </Button>
  );
}
