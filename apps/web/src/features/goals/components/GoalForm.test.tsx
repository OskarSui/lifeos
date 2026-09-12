import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import GoalForm from "./GoalForm";

describe("GoalForm", () => {
  it("creates a goal with the entered title", async () => {
    const user = userEvent.setup();

    const onCreate = vi.fn().mockResolvedValue(undefined);

    render(<GoalForm onCreate={onCreate} />);

    const input = screen.getByPlaceholderText("e.g. Build my portfolio");

    await user.type(input, "Become a senior engineer");

    const button = screen.getByRole("button", {
      name: /create/i,
    });

    await user.click(button);

    expect(onCreate).toHaveBeenCalledWith("Become a senior engineer", "");
  });

  it("does not create a goal when the title is empty", async () => {
    const user = userEvent.setup();

    const onCreate = vi.fn().mockResolvedValue(undefined);

    render(<GoalForm onCreate={onCreate} />);

    const button = screen.getByRole("button", {
      name: /create/i,
    });

    await user.click(button);

    expect(onCreate).not.toHaveBeenCalled();
  });
});
