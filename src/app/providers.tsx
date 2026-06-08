import type { JSX, ReactNode } from "react";
import { BrowserRouter } from "react-router";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps): JSX.Element {
  return <BrowserRouter>{children}</BrowserRouter>;
}
