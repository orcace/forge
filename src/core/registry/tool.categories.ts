import {
  Binary,
  Braces,
  FileCode2,
  Hash,
  LayoutGrid,
  type LucideIcon,
  Wrench,
} from "lucide-react";

export const toolCategories = [
  "Workspace",
  "Editors",
  "Data",
  "Encoding",
  "Crypto",
  "Utilities",
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export interface ToolCategoryDefinition {
  description: string;
  icon: LucideIcon;
  id: ToolCategory;
}

export const toolCategoryDefinitions: ToolCategoryDefinition[] = [
  {
    id: "Workspace",
    description: "Navigation, preferences, and workspace-level actions.",
    icon: LayoutGrid,
  },
  {
    id: "Editors",
    description: "Stateful editors and preview tools.",
    icon: FileCode2,
  },
  {
    id: "Data",
    description: "Structured data formatting, validation, and conversion.",
    icon: Braces,
  },
  {
    id: "Encoding",
    description: "Text and binary encoding utilities.",
    icon: Binary,
  },
  {
    id: "Crypto",
    description: "Hashing, HMAC, and password generation tools.",
    icon: Hash,
  },
  {
    id: "Utilities",
    description: "Everyday developer helpers.",
    icon: Wrench,
  },
];
