import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import TodayProgress from "./TodayProgress";

describe("TodayProgress", () => {
  it("displays today's progress percentage", () => {
    render(
      <TodayProgress
        progress={{
          completed: 2,
          total: 5,
          percentage: 40,
        }}
        counts={{
          total: 5,
          inbox: 1,
          inProgress: 2,
          done: 2,
        }}
      />,
    );

    expect(
      screen.getByRole("progressbar", {
        name: "Today's progress",
      }),
    ).toHaveAttribute("aria-valuenow", "40");
  });

  it("displays task status counts", () => {
    render(
      <TodayProgress
        progress={{
          completed: 2,
          total: 5,
          percentage: 40,
        }}
        counts={{
          total: 5,
          inbox: 1,
          inProgress: 2,
          done: 2,
        }}
      />,
    );

    const inbox = screen.getByText("Inbox").parentElement!;
    const inProgress = screen.getByText("In progress").parentElement!;
    const done = screen.getByText("Done").parentElement!;

    expect(within(inbox).getByText("1")).toBeInTheDocument();
    expect(within(inProgress).getByText("2")).toBeInTheDocument();
    expect(within(done).getByText("2")).toBeInTheDocument();

    expect(screen.getByText("2 of 5 completed")).toBeInTheDocument();

    expect(screen.getByText(/inbox/i)).toBeInTheDocument();
    expect(screen.getByText(/in progress/i)).toBeInTheDocument();
    expect(screen.getByText(/done/i)).toBeInTheDocument();
  });

  it("displays 0% when there are no completed tasks", () => {
    render(
      <TodayProgress
        progress={{
          completed: 0,
          total: 0,
          percentage: 0,
        }}
        counts={{
          total: 0,
          inbox: 0,
          inProgress: 0,
          done: 0,
        }}
      />,
    );

    expect(screen.getByRole("progressbar", { name: "Today's progress" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
  });
});
