import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "@/app/App";

describe("App", () => {
  it("renders the Forge app shell", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", {
        name: "Developer tools that behave like one product",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "JSON Formatter Soon" })).toBeInTheDocument();
  });
});
