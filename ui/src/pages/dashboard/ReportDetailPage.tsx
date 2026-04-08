import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Drawer,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import ShareIcon from "@mui/icons-material/Share";
import RefreshIcon from "@mui/icons-material/Refresh";
import DescriptionIcon from "@mui/icons-material/Description";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import type { BaseConfigurationResponse, ComparisonReportRequest, MainReportRequest } from "../../lib/api/generated/model";
import {
  fetchBaseConfig,
  fetchStages,
  fetchTools,
  generateComparisonReport,
  generateMainReport,
  getApiErrorMessage,
} from "../../lib/api/report-api";
import { getReportSession, saveReportSession } from "../../lib/report-store";

type WeightMode = "static" | "user" | "dynamic";

type EditFormData = {
  sector: string;
  stage: string;
  tool: string;
  audience: string;
  featureCategory: string;
  weightMode: WeightMode;
};

const weightModes: Array<{
  value: WeightMode;
  label: string;
  description: string;
  disabled?: boolean;
}> = [
  { value: "static", label: "Static (Default Weights)", description: "Use predefined weightings" },
  { value: "user", label: "User Based", description: "Coming next pass", disabled: true },
  { value: "dynamic", label: "Dynamic (AI Optimized)", description: "Coming next pass", disabled: true },
];

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(() => (id ? getReportSession(id) : undefined));
  const [baseConfig, setBaseConfig] = useState<BaseConfigurationResponse | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState("");
  const [showComparison, setShowComparison] = useState(Boolean(session?.comparisonMarkdown));
  const [comparisonTool, setComparisonTool] = useState(session?.comparisonTool ?? "");
  const [comparisonOptions, setComparisonOptions] = useState<string[]>([]);
  const [editStages, setEditStages] = useState<string[]>([]);
  const [editTools, setEditTools] = useState<string[]>([]);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    sector: session?.sector ?? "",
    stage: session?.stage ?? "",
    tool: session?.tool ?? "",
    audience: session?.persona ?? "",
    featureCategory: session?.featureCategory ?? "",
    weightMode: "static",
  });

  useEffect(() => {
    setSession(id ? getReportSession(id) : undefined);
  }, [id]);

  useEffect(() => {
    if (!session) return;
    setEditFormData({
      sector: session.sector,
      stage: session.stage,
      tool: session.tool,
      audience: session.persona,
      featureCategory: session.featureCategory,
      weightMode: "static",
    });
    setComparisonTool(session.comparisonTool ?? "");
    setShowComparison(Boolean(session.comparisonMarkdown));
  }, [session]);

  useEffect(() => {
    let cancelled = false;
    async function loadConfig(): Promise<void> {
      try {
        const config = await fetchBaseConfig();
        if (cancelled) return;
        setBaseConfig(config);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      }
    }
    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!editFormData.sector) return;
    let cancelled = false;
    async function loadStages(): Promise<void> {
      try {
        const response = await fetchStages(editFormData.sector);
        if (cancelled) return;
        setEditStages(response.stages);
        setEditFormData((prev) => ({
          ...prev,
          stage: response.stages.includes(prev.stage) ? prev.stage : (response.stages[0] ?? ""),
          tool: "",
        }));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      }
    }
    void loadStages();
    return () => {
      cancelled = true;
    };
  }, [editFormData.sector]);

  useEffect(() => {
    if (!editFormData.sector || !editFormData.stage) return;
    let cancelled = false;
    async function loadEditTools(): Promise<void> {
      try {
        const response = await fetchTools(editFormData.sector, editFormData.stage);
        if (cancelled) return;
        setEditTools(response.tools);
        setEditFormData((prev) => ({
          ...prev,
          tool: response.tools.includes(prev.tool) ? prev.tool : (response.tools[0] ?? ""),
        }));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      }
    }
    void loadEditTools();
    return () => {
      cancelled = true;
    };
  }, [editFormData.sector, editFormData.stage]);

  useEffect(() => {
    if (!session) return;
    const currentSession = session;
    let cancelled = false;
    async function loadComparisonTools(): Promise<void> {
      try {
        const response = await fetchTools(currentSession.sector, currentSession.stage);
        if (cancelled) return;
        setComparisonOptions(response.tools.filter((tool) => tool !== currentSession.tool));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      }
    }
    void loadComparisonTools();
    return () => {
      cancelled = true;
    };
  }, [session?.sector, session?.stage, session?.tool]);

  const updateEdit = <K extends keyof EditFormData>(field: K, value: EditFormData[K]) =>
    setEditFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!session || !baseConfig) return;
    try {
      setError("");
      setIsWorking(true);
      setDrawerOpen(false);
      const weights = baseConfig.default_weights[editFormData.audience] ?? {};
      const payload: MainReportRequest = {
        sector: editFormData.sector,
        stage: editFormData.stage,
        input_tool_name: editFormData.tool,
        persona: editFormData.audience,
        weights,
      };
      const response = await generateMainReport(payload);
      const updated = {
        ...session,
        sector: editFormData.sector,
        stage: editFormData.stage,
        tool: editFormData.tool,
        persona: editFormData.audience,
        featureCategory: editFormData.featureCategory,
        weights,
        reportMarkdown: response.report_markdown,
        tokenUsage: response.token_usage,
      };
      saveReportSession(updated);
      setSession(updated);
      setShowComparison(false);
      setComparisonTool("");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsWorking(false);
    }
  };

  const handleCompare = async () => {
    if (!session || !comparisonTool) return;
    try {
      setError("");
      setIsWorking(true);
      const payload: ComparisonReportRequest = {
        sector: session.sector,
        stage: session.stage,
        input_tool_name: session.tool,
        compare_tool_name: comparisonTool,
        persona: session.persona,
        weights: session.weights,
      };
      const response = await generateComparisonReport(payload);
      const updated = {
        ...session,
        comparisonTool,
        comparisonMarkdown: response.report_markdown,
        comparisonTokenUsage: response.token_usage,
      };
      saveReportSession(updated);
      setSession(updated);
      setShowComparison(true);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsWorking(false);
    }
  };

  if (!session) {
    return (
      <Box sx={{ p: 4, maxWidth: 680 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Report Not Available
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          This page uses in-memory report data. If you refreshed, regenerate from the Generate page.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/generate")}>
          Go To Generate
        </Button>
      </Box>
    );
  }

  if (isWorking) {
    return (
      <Box sx={{ display: "flex", minHeight: "60vh", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ position: "relative", width: 72, height: 72, mb: 3 }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              bgcolor: "primary.main",
              opacity: 0.15,
              animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
              "@keyframes ping": { "0%": { transform: "scale(1)", opacity: 0.2 }, "75%,100%": { transform: "scale(1.6)", opacity: 0 } },
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 10,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AutoAwesomeIcon
              sx={{
                color: "#fff",
                fontSize: 22,
                animation: "pulse 1.5s ease-in-out infinite",
                "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
              }}
            />
          </Box>
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Processing report...
        </Typography>
        <Typography color="text.secondary">This may take a moment</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100%", bgcolor: "background.default" }}>
      <Box sx={{ borderBottom: "1px solid", borderColor: "divider", bgcolor: "background.paper", px: 3, py: 2 }}>
        <Box sx={{ maxWidth: 1100, mx: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/reports")} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {session.tool} Analysis Report
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Report ID: {session.id}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setDrawerOpen(true)} size="small">
              Edit Sections
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} size="small">
              Export
            </Button>
            <Button variant="outlined" startIcon={<ShareIcon />} size="small">
              Share
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: "auto", p: 3 }}>
        {error ? (
          <Typography color="error.main" sx={{ mb: 2 }}>
            {error}
          </Typography>
        ) : null}

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 280px" }, gap: 3 }}>
          <Box>
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(91,91,214,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DescriptionIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={600}>Generated Report</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {session.persona}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    "& h1,& h2,& h3": { color: "text.primary", fontWeight: 700, mt: 2, mb: 1 },
                    "& h1": { fontSize: "1.5rem" },
                    "& h2": { fontSize: "1.2rem" },
                    "& h3": { fontSize: "1rem" },
                    "& p": { color: "text.primary", lineHeight: 1.7, mb: 1.5 },
                    "& ul,& ol": { pl: 3, mb: 1.5 },
                    "& li": { mb: 0.5, color: "text.primary" },
                    "& table": { width: "100%", borderCollapse: "collapse", mb: 2 },
                    "& th,& td": { border: "1px solid", borderColor: "divider", p: 1, textAlign: "left", fontSize: "0.875rem" },
                    "& th": { bgcolor: "rgba(0,0,0,0.03)", fontWeight: 600 },
                    "& code": { bgcolor: "rgba(0,0,0,0.05)", borderRadius: 1, px: 0.5, fontSize: "0.85em", fontFamily: "monospace" },
                    "& pre": { bgcolor: "rgba(0,0,0,0.05)", borderRadius: 2, p: 2, overflow: "auto", mb: 2 },
                    "& pre code": { bgcolor: "transparent", p: 0 },
                    "& hr": { my: 2, borderColor: "divider" },
                    "& strong": { fontWeight: 700 },
                  }}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{session.reportMarkdown}</ReactMarkdown>
                </Box>
              </CardContent>
            </Card>

            {showComparison && session.comparisonMarkdown ? (
              <Card sx={{ mt: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 3, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(91,91,214,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CompareArrowsIcon sx={{ color: "primary.main", fontSize: 20 }} />
                    </Box>
                    <Typography fontWeight={600}>Tool Comparison</Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 3,
                      "& table": { width: "100%", borderCollapse: "collapse", mb: 2 },
                      "& th,& td": { border: "1px solid", borderColor: "divider", p: 1, fontSize: "0.875rem" },
                      "& th": { bgcolor: "rgba(0,0,0,0.03)", fontWeight: 600 },
                      "& h2,& h3": { fontWeight: 700, mt: 2, mb: 1 },
                      "& p": { mb: 1.5, lineHeight: 1.7 },
                      "& ul,& ol": { pl: 3, mb: 1.5 },
                      "& li": { mb: 0.5 },
                      "& strong": { fontWeight: 700 },
                      "& hr": { my: 2, borderColor: "divider" },
                    }}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{session.comparisonMarkdown}</ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            ) : null}
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Report Details
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  {[
                    { label: "Sector", value: session.sector },
                    { label: "Stage", value: session.stage },
                    { label: "Audience", value: session.persona },
                    { label: "Weight Mode", value: "Static" },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="caption" fontWeight={500} sx={{ textAlign: "right" }}>
                        {value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <CompareArrowsIcon sx={{ fontSize: 16, color: "primary.main" }} />
                  <Typography variant="body2" fontWeight={600}>
                    Comparison Between Tools
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select tool to compare</InputLabel>
                    <Select value={comparisonTool} label="Select tool to compare" onChange={(e) => setComparisonTool(e.target.value)}>
                      {comparisonOptions.map((tool) => (
                        <MenuItem key={tool} value={tool}>
                          {tool}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" fullWidth disabled={!comparisonTool} onClick={handleCompare} size="small">
                    Compare {session.tool} vs {comparisonTool || "Tool"}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Select a tool and click compare to see a detailed comparison
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      <Drawer anchor="right" open={drawerOpen} PaperProps={{ sx: { width: { xs: "100%", sm: 460 } } }} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Box>
              <Typography fontWeight={600}>Edit Report Configuration</Typography>
              <Typography variant="caption" color="text.secondary">
                Modify parameters and regenerate
              </Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sector</InputLabel>
                <Select value={editFormData.sector} label="Sector" onChange={(e) => updateEdit("sector", e.target.value)}>
                  {(baseConfig?.sectors ?? []).map((sector) => (
                    <MenuItem key={sector} value={sector}>
                      {sector}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Stage</InputLabel>
                <Select value={editFormData.stage} label="Stage" onChange={(e) => updateEdit("stage", e.target.value)}>
                  {editStages.map((stage) => (
                    <MenuItem key={stage} value={stage}>
                      {stage}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Tool to Analyze</InputLabel>
                <Select value={editFormData.tool} label="Tool to Analyze" onChange={(e) => updateEdit("tool", e.target.value)}>
                  {editTools.map((tool) => (
                    <MenuItem key={tool} value={tool}>
                      {tool}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Divider />

              <FormControl fullWidth size="small">
                <InputLabel>Audience</InputLabel>
                <Select value={editFormData.audience} label="Audience" onChange={(e) => updateEdit("audience", e.target.value)}>
                  {(baseConfig?.personas ?? []).map((persona) => (
                    <MenuItem key={persona} value={persona}>
                      {persona}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Feature Category</InputLabel>
                <Select value={editFormData.featureCategory} label="Feature Category" onChange={(e) => updateEdit("featureCategory", e.target.value)}>
                  {(baseConfig?.feature_categories ?? []).map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 1.5 }}>
                  Weight Selection Mode
                </Typography>
                <RadioGroup value={editFormData.weightMode} onChange={(e) => updateEdit("weightMode", e.target.value as WeightMode)}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {weightModes.map((mode) => {
                      const disabled = Boolean(mode.disabled);
                      return (
                        <Paper
                          key={mode.value}
                          variant="outlined"
                          onClick={() => {
                            if (!disabled) updateEdit("weightMode", mode.value);
                          }}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            cursor: disabled ? "not-allowed" : "pointer",
                            opacity: disabled ? 0.5 : 1,
                            borderColor: editFormData.weightMode === mode.value ? "primary.main" : "divider",
                            bgcolor: editFormData.weightMode === mode.value ? "rgba(91,91,214,0.04)" : "transparent",
                            transition: "all 0.15s",
                          }}
                        >
                          <FormControlLabel
                            value={mode.value}
                            disabled={disabled}
                            control={<Radio size="small" sx={{ p: 0.5 }} />}
                            label={
                              <Box sx={{ ml: 0.5 }}>
                                <Typography variant="body2" fontWeight={500}>
                                  {mode.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {mode.description}
                                </Typography>
                              </Box>
                            }
                            sx={{ m: 0, alignItems: "flex-start" }}
                          />
                        </Paper>
                      );
                    })}
                  </Box>
                </RadioGroup>
              </Box>
            </Box>
          </Box>

          <Box sx={{ px: 3, py: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", gap: 1.5 }}>
            <Button variant="contained" fullWidth onClick={handleSave} startIcon={<RefreshIcon />} sx={{ fontWeight: 600 }}>
              Regenerate Report
            </Button>
            <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
}
