import type { JSX, ReactNode } from "react";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/core/theme/theme-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
}
