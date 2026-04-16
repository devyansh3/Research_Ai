import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GeneratePage from "./GeneratePage";

const navigateMock = vi.fn();
const fetchBaseConfigMock = vi.fn();
const fetchStagesMock = vi.fn();
const fetchToolsMock = vi.fn();
const generateMainReportMock = vi.fn();
const getApiErrorMessageMock = vi.fn();
const saveReportSessionMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../lib/api/report-api", () => ({
  fetchBaseConfig: (...args: unknown[]) => fetchBaseConfigMock(...args),
  fetchStages: (...args: unknown[]) => fetchStagesMock(...args),
  fetchTools: (...args: unknown[]) => fetchToolsMock(...args),
  generateMainReport: (...args: unknown[]) => generateMainReportMock(...args),
  getApiErrorMessage: (...args: unknown[]) => getApiErrorMessageMock(...args),
}));

vi.mock("../../lib/report-store", () => ({
  saveReportSession: (...args: unknown[]) => saveReportSessionMock(...args),
}));

describe("GeneratePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchBaseConfigMock.mockResolvedValue({
      sectors: ["Manufacturing", "Aerospace"],
      personas: ["Board / Executive Sponsor", "R&D Lead"],
      default_weights: {
        "Board / Executive Sponsor": { capabilities: 0.5, cost: 0.3, risk: 0.2 },
        "R&D Lead": { capabilities: 0.6, cost: 0.2, risk: 0.2 },
      },
      feature_categories: ["Strategic Fit", "Total Cost"],
    });
    fetchStagesMock.mockImplementation(async (sector: string) => {
      if (sector === "Aerospace") {
        return { sector, stages: ["Procurement"] };
      }
      return { sector, stages: ["R&D", "Operations"] };
    });
    fetchToolsMock.mockImplementation(async (sector: string, stage: string) => {
      if (sector === "Aerospace") {
        return { sector, stage, tools: ["CATIA"] };
      }
      return { sector, stage, tools: ["Siemens NX", "SolidWorks"] };
    });
    getApiErrorMessageMock.mockImplementation((error: unknown) =>
      error instanceof Error ? error.message : "API failed",
    );
    generateMainReportMock.mockResolvedValue({
      status: "success",
      report_markdown: "# Generated Report",
      token_usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
    });
  });

  it("bootstraps and cascades sector -> stages -> tools", async () => {
    const user = userEvent.setup();
    render(<GeneratePage />);

    await waitFor(() => expect(fetchBaseConfigMock).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(fetchStagesMock).toHaveBeenCalledWith("Manufacturing"));
    await waitFor(() =>
      expect(fetchToolsMock).toHaveBeenCalledWith("Manufacturing", "R&D"),
    );

    const sectorSelect = screen.getAllByRole("combobox")[0];
    await user.click(sectorSelect);
    await user.click(await screen.findByRole("option", { name: "Aerospace" }));

    await waitFor(() => expect(fetchStagesMock).toHaveBeenCalledWith("Aerospace"));
    await waitFor(() => expect(fetchToolsMock).toHaveBeenCalledWith("Aerospace", "Procurement"));
  });

  it("submits generation, saves report session, and navigates to detail page", async () => {
    const user = userEvent.setup();
    vi.spyOn(Date, "now").mockReturnValue(1777777777777);
    render(<GeneratePage />);

    await waitFor(() => {
      const generateButtons = screen.getAllByRole("button", { name: /generate report/i });
      expect(generateButtons.some((button) => !button.hasAttribute("disabled"))).toBe(true);
    });
    const generateButtons = screen
      .getAllByRole("button", { name: /generate report/i })
      .filter((button) => !button.hasAttribute("disabled"));
    for (const button of generateButtons) {
      await user.click(button);
      if (saveReportSessionMock.mock.calls.length > 0) break;
    }

    expect(generateMainReportMock).toHaveBeenCalledWith({
      sector: "Manufacturing",
      stage: "R&D",
      input_tool_name: "Siemens NX",
      persona: "Board / Executive Sponsor",
      weights: { capabilities: 0.5, cost: 0.3, risk: 0.2 },
    });
    await waitFor(() => expect(saveReportSessionMock).toHaveBeenCalledTimes(1));
    expect(saveReportSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "1777777777777",
        sector: "Manufacturing",
        stage: "R&D",
        tool: "Siemens NX",
        persona: "Board / Executive Sponsor",
        featureCategory: "Strategic Fit",
        weightMode: "static",
        weights: { capabilities: 0.5, cost: 0.3, risk: 0.2 },
        reportMarkdown: "# Generated Report",
        tokenUsage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
      }),
    );

    expect(navigateMock).toHaveBeenCalledWith("/reports/1777777777777");
  });

  it("shows API error when bootstrap fails", async () => {
    fetchBaseConfigMock.mockRejectedValueOnce(new Error("Base config failed"));
    render(<GeneratePage />);

    expect(await screen.findByText("Base config failed")).toBeInTheDocument();
  });
});
