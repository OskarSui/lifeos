import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import QuickCapture from "./QuickCapture";

describe("QuickCapture", () => {
  it("allows the user to capture a task", async () => {
    const user = userEvent.setup();

    const onCreate = vi.fn().mockResolvedValue(undefined);

    render(<QuickCapture onCreate={onCreate} />);

    const input = screen.getByPlaceholderText(/Capture an idea or task/i);

    await user.type(input, "Build frontend tests");

    const button = screen.getByRole("button", {
      name: /add/i,
    });

    await user.click(button);

    expect(onCreate).toHaveBeenCalledWith("Build frontend tests");
  });

  it("does not create a task when the input is empty", async () => {
    const user = userEvent.setup();

    const onCreate = vi.fn().mockResolvedValue(undefined);

    render(<QuickCapture onCreate={onCreate} />);

    const button = screen.getByRole("button", {
      name: /add/i,
    });

    await user.click(button);

    expect(onCreate).not.toHaveBeenCalled();
  });
});
