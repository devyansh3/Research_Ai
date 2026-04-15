import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import OnboardingPage from "./OnboardingPage";

const completeOnboardingMock = vi.fn();

vi.mock("../../lib/auth-context", () => ({
  useAuth: () => ({
    completeOnboarding: completeOnboardingMock,
  }),
}));

async function selectOptionByLabel(
  user: ReturnType<typeof userEvent.setup>,
  comboboxIndex: number,
  option: string,
): Promise<void> {
  const select = screen.getAllByRole("combobox")[comboboxIndex];
  await user.click(select);
  await user.click(await screen.findByRole("option", { name: option }));
}

describe("OnboardingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enforces step validation and completes onboarding", async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    const continueButton = screen.getByRole("button", { name: "Continue" });
    expect(continueButton).toBeDisabled();

    await user.type(screen.getByLabelText("First Name"), "John");
    expect(continueButton).toBeDisabled();
    await user.type(screen.getByLabelText("Last Name"), "Doe");
    expect(continueButton).toBeEnabled();
    await user.click(continueButton);

    expect(screen.getByRole("heading", { name: "Location" })).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
    await selectOptionByLabel(user, 0, "Seattle");
    await waitFor(() => expect(continueButton).toBeEnabled());
    await user.click(continueButton);

    expect(screen.getByRole("heading", { name: "Business Details" })).toBeInTheDocument();
    expect(continueButton).toBeDisabled();
    await selectOptionByLabel(user, 0, "Manufacturing");
    await user.type(screen.getByLabelText("Company Name"), "Acme Inc.");
    expect(continueButton).toBeDisabled();
    await selectOptionByLabel(user, 1, "Startup");
    await waitFor(() => expect(continueButton).toBeEnabled());
    await user.click(continueButton);

    const completeButton = await screen.findByRole("button", { name: "Complete Setup" });
    expect(completeButton).toBeDisabled();
    await selectOptionByLabel(user, 0, "Google Search");
    await waitFor(() => expect(completeButton).toBeEnabled());
    await user.click(completeButton);

    expect(completeOnboardingMock).toHaveBeenCalledTimes(1);
  });

  it("shows all company type options in Business Details step", async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);

    await user.type(screen.getByLabelText("First Name"), "John");
    await user.type(screen.getByLabelText("Last Name"), "Doe");
    await user.click(screen.getAllByRole("button", { name: "Continue" })[0]);

    await selectOptionByLabel(user, 0, "Seattle");
    await user.click(screen.getAllByRole("button", { name: "Continue" })[0]);

    const companyTypeSelect = screen.getAllByRole("combobox")[1];
    await user.click(companyTypeSelect);

    expect(await screen.findByRole("option", { name: "Startup" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "SMB" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Mid size enterprises" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Enterprises" })).toBeInTheDocument();
  });
});
