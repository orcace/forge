import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getByRole("link", { name: "JSON Formatter" })).toBeInTheDocument();
  });

  it("opens the command palette with the keyboard shortcut", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.keyboard("{Control>}k{/Control}");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Search tools" })).toHaveFocus();
  });
});
