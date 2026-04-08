import dspy
from typing import Dict, List, TypedDict
#import streamlit as st
import json
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.callbacks import get_openai_callback
#import streamlit.components.v1 as components

if dspy.settings.lm is None:
    main_lm = dspy.LM(
        model="gpt-4o",
        temperature=0,
        max_tokens=8000
    )
    dspy.settings.configure(
    lm=main_lm,
    track_usage=False
)


def normalize_weights(weights: Dict[str, float]) -> Dict[str, float]:
        total = sum(weights.values())

        if total == 0:
            n = len(weights)
            return {k: 1/n for k,v in weights}
        
        return {k:v / total for k,v in weights.items()}

class DynamicWeightSignature(dspy.Signature):
    """
    Decide optimal category weights based on context
    """
    sector: str = dspy.InputField(desc="Industry Sector, e.g. Manufacturing, CyberSecurity etc")
    stage: str = dspy.InputField(desc="LifeCycle, e.g. Design, Planning etc")
    tool: str = dspy.InputField(desc="Tool being evaluated")
    persona: str = dspy.InputField(desc="Decision-maker persona")
    feature_categories: List[str] = dspy.InputField(desc="List of feature categories")
    initial_weights: Dict[str, float]  = dspy.InputField(desc="Initial category weights (0-1)")

    final_weights: Dict[str, float] = dspy.OutputField(desc="Optimized and normalized category weights (sum to 1)")
    reasoning: str = dspy.OutputField(desc="Reasoning and key insights explaining weight adjustments")

class DynamicWeightModule(dspy.Module):
    def __init__(self):
        super().__init__()
        self.reasoner = dspy.ChainOfThought(DynamicWeightSignature)

    def forward(
            self,
            sector: str,
            stage: str,
            tool: str,
            persona: str,
            feature_categories: List[str],
            initial_weights: Dict[str, float],
    ):
        response = self.reasoner(
            sector=sector,
            stage=stage,
            tool=tool,
            persona=persona,
            feature_categories=feature_categories,
            initial_weights=initial_weights
        )

        print(f"\n AI Reasoning for {persona} ({tool}):")
        print(response.reasoning)
        print("-" * 30)

        normalized = normalize_weights(response.final_weights)

        return dspy.Prediction(
            final_weights=normalized,
            reasoning=response.reasoning
        )

    
    

train_examples = [
    dspy.Example(
        sector="Manufacturing",
        stage="Production",
        tool="Tulip",
        persona="Board/Executive Sponsor",
        feature_categories=[
            "Strategic & Market Alignment",
            "Revenue and Financial Impact",
            "Risk, Security & Privacy",
            "Vendor & Ecosystem Stability",
            "Sustainability, ESG & Change Management"

        ],
        initial_weights={
            "Strategic & Market Alignment": 0.25,
            "Revenue and Financial Impact": 0.25,
            "Risk, Security & Privacy": 0.20,
            "Vendor & Ecosystem Stability": 0.15,
            "Sustainability, ESG & Change Management": 0.15,
        },
        final_weights={
            "Strategic & Market Alignment": 0.27,
            "Revenue and Financial Impact": 0.27,
            "Risk, Security & Privacy": 0.18,
            "Vendor & Ecosystem Stability": 0.16,
            "Sustainability, ESG & Change Management": 0.12,
        },
        reasoning=("Board sponsors prioritize strategic direction and revenue impact in production decisions. Risk and vendor stability are important but secondary, while ESG is considered a supporting factor.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),



    dspy.Example(
        sector="Manufacturing",
        stage="Supply Chain",
        tool="Infor Nexus",
        persona="Board/Executive Sponsor",
        feature_categories=[
            "Strategic & Market Alignment",
            "Revenue and Financial Impact",
            "Risk, Security & Privacy",
            "Vendor & Ecosystem Stability",
            "Sustainability, ESG & Change Management"

        ],
        initial_weights={
            "Strategic & Market Alignment": 0.25,
            "Revenue and Financial Impact": 0.25,
            "Risk, Security & Privacy": 0.20,
            "Vendor & Ecosystem Stability": 0.15,
            "Sustainability, ESG & Change Management": 0.15,
        },
        final_weights={
            "Strategic & Market Alignment": 0.26,
            "Revenue and Financial Impact": 0.26,
            "Risk, Security & Privacy": 0.19,
            "Vendor & Ecosystem Stability": 0.17,
            "Sustainability, ESG & Change Management": 0.12,
        },
        reasoning=("In supply chain contexts, board leaders maintain focus on revenue and strategy, with slightly higher attention to vendor reliability due to dependency risks.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),
    
    dspy.Example(
        sector="Manufacturing",
        stage="Sales&Distribution",
        tool="HubSpot Sales Hub",
        persona="Board/Executive Sponsor",
        feature_categories=[
            "Strategic & Market Alignment",
            "Revenue and Financial Impact",
            "Risk, Security & Privacy",
            "Vendor & Ecosystem Stability",
            "Sustainability, ESG & Change Management"

        ],
        initial_weights={
            "Strategic & Market Alignment": 0.25,
            "Revenue and Financial Impact": 0.25,
            "Risk, Security & Privacy": 0.20,
            "Vendor & Ecosystem Stability": 0.15,
            "Sustainability, ESG & Change Management": 0.15,
        },
        final_weights={
            "Strategic & Market Alignment": 0.28,
            "Revenue and Financial Impact": 0.30,
            "Risk, Security & Privacy": 0.17,
            "Vendor & Ecosystem Stability": 0.13,
            "Sustainability, ESG & Change Management": 0.12,
        },
        reasoning=(
"Sales and distribution decisions emphasize revenue growth most strongly. Strategic alignment supports go-to-market success, while ESG and vendor factors play minor roles."
)
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),



    dspy.Example(
        sector="Manufacturing",
        stage="Design",
        tool="Siemens NX",
        persona="CIO/CTO",
        feature_categories=[
            "Revenue and Financial Impact",
            "Integrations, Interoperability & Flexibility",
            "Operational Efficiency & Performance",
            "Technical Fit & Architecture",
            "User Experience & Adoption",
            "Strategic & Market Alignment1",
            "Risk, Security & Privacy1",
            "Disaster Recovery & Business Continuity",
            "Vendor & Ecosystem Stability",
            "Maintainability, Extensibility & Customization",
            "Sustainability & ESG",
            "Data Ownership & Portability"

        ],
        initial_weights={
            "Revenue and Financial Impact": 0.15,
            "Integrations, Interoperability & Flexibility": 0.14,
            "Operational Efficiency & Performance": 0.12,
            "Technical Fit & Architecture": 0.10,
            "User Experience & Adoption": 0.09,
            "Strategic & Market Alignment1": 0.08,
            "Risk, Security & Privacy1": 0.07,
            "Disaster Recovery & Business Continuity" : 0.06,
            "Vendor & Ecosystem Stability": 0.06,
            "Maintainability, Extensibility & Customization": 0.05,
            "Sustainability & ESG": 0.03,
            "Data Ownership & Portability": 0.05
        },
        final_weights={
            "Integrations, Interoperability & Flexibility": 0.17,
            "Technical Fit & Architecture": 0.14,
            "Revenue and Financial Impact": 0.14,
            "Operational Efficiency & Performance": 0.13,
            "Risk, Security & Privacy1": 0.08,
            "User Experience & Adoption": 0.07,
            "Disaster Recovery & Business Continuity" : 0.07,
            "Vendor & Ecosystem Stability": 0.06,
            "Maintainability, Extensibility & Customization": 0.05,
            "Data Ownership & Portability": 0.05,
            "Strategic & Market Alignment1": 0.03,
            "Sustainability & ESG": 0.01,
        },
        reasoning=("CIOs prioritize system integration, architectural fit, and performance in design phases.Revenue impact is evaluated through technical feasibility rather than business growth alone.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Planning",
        tool="Oracle Supply Chain Planning Cloud",
        persona="CIO/CTO",
        feature_categories=[
            "Revenue and Financial Impact",
            "Integrations, Interoperability & Flexibility",
            "Operational Efficiency & Performance",
            "Technical Fit & Architecture",
            "User Experience & Adoption",
            "Strategic & Market Alignment1",
            "Risk, Security & Privacy1",
            "Disaster Recovery & Business Continuity",
            "Vendor & Ecosystem Stability",
            "Maintainability, Extensibility & Customization",
            "Sustainability & ESG",
            "Data Ownership & Portability"

        ],
        initial_weights={
            "Revenue and Financial Impact": 0.15,
            "Integrations, Interoperability & Flexibility": 0.14,
            "Operational Efficiency & Performance": 0.12,
            "Technical Fit & Architecture": 0.10,
            "User Experience & Adoption": 0.09,
            "Strategic & Market Alignment1": 0.08,
            "Risk, Security & Privacy1": 0.07,
            "Disaster Recovery & Business Continuity" : 0.06,
            "Vendor & Ecosystem Stability": 0.06,
            "Maintainability, Extensibility & Customization": 0.05,
            "Sustainability & ESG": 0.03,
            "Data Ownership & Portability": 0.05
        },
        final_weights={
            "Integrations, Interoperability & Flexibility": 0.16,
            "Revenue and Financial Impact": 0.15,
            "Operational Efficiency & Performance": 0.14,
            "Technical Fit & Architecture": 0.13,
            "Strategic & Market Alignment1": 0.08,
            "Risk, Security & Privacy1": 0.08,
            "User Experience & Adoption": 0.07,
            "Disaster Recovery & Business Continuity" : 0.07,
            "Vendor & Ecosystem Stability": 0.07,
            "Maintainability, Extensibility & Customization": 0.05,
            "Data Ownership & Portability": 0.02,
            "Sustainability & ESG": 0.01,
        },
        reasoning=("During planning stages, CIOs balance integration and performance with financial predictability and vendor reliability."
)
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Quality & Testing",
        tool="MiniTab",
        persona="CIO/CTO",
        feature_categories=[
            "Revenue and Financial Impact",
            "Integrations, Interoperability & Flexibility",
            "Operational Efficiency & Performance",
            "Technical Fit & Architecture",
            "User Experience & Adoption",
            "Strategic & Market Alignment1",
            "Risk, Security & Privacy1",
            "Disaster Recovery & Business Continuity",
            "Vendor & Ecosystem Stability",
            "Maintainability, Extensibility & Customization",
            "Sustainability & ESG",
            "Data Ownership & Portability"

        ],
        initial_weights={
            "Revenue and Financial Impact": 0.15,
            "Integrations, Interoperability & Flexibility": 0.14,
            "Operational Efficiency & Performance": 0.12,
            "Technical Fit & Architecture": 0.10,
            "User Experience & Adoption": 0.09,
            "Strategic & Market Alignment1": 0.08,
            "Risk, Security & Privacy1": 0.07,
            "Disaster Recovery & Business Continuity" : 0.06,
            "Vendor & Ecosystem Stability": 0.06,
            "Maintainability, Extensibility & Customization": 0.05,
            "Sustainability & ESG": 0.03,
            "Data Ownership & Portability": 0.05
        },
        final_weights={
            "Operational Efficiency & Performance": 0.16,
            "Integrations, Interoperability & Flexibility": 0.14,
            "Technical Fit & Architecture": 0.14,
            "Revenue and Financial Impact": 0.12,
            "Risk, Security & Privacy1": 0.10,
            "Disaster Recovery & Business Continuity" : 0.08,
            "User Experience & Adoption": 0.07,
            "Strategic & Market Alignment1": 0.02,
            "Vendor & Ecosystem Stability": 0.06,
            "Maintainability, Extensibility & Customization": 0.05,
            "Sustainability & ESG": 0.01,
            "Data Ownership & Portability": 0.05
        },
        reasoning=("Quality and testing phases require emphasis on performance stability, reliability, and risk control,while revenue considerations are secondary."
)

    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),



    dspy.Example(
    sector="Manufacturing",
    stage="R&D",
    tool="Solid Edge",
    persona="CDO / Head of Digital / Innovation",
    feature_categories=[
        "Strategic Alignment & Innovation Differentiation",
            "Innovation Velocity & Future Readiness",
            "AI/ML & Intelligent Capabilities",
            "User Experience Adoption & Cultural Fit",
            "Risk, Security & Privacy1",
            "Sustainability & ESG"

        ],
        initial_weights={
            "Strategic Alignment & Innovation Differentiation": 0.25,
            "Innovation Velocity & Future Readiness": 0.25,
            "AI/ML & Intelligent Capabilities": 0.20, 
            "User Experience Adoption & Cultural Fit": 0.15,
            "Risk, Security & Privacy1": 0.10,
            "Sustainability & ESG": 0.05
        },
        final_weights={
            "Innovation Velocity & Future Readiness": 0.27,
            "Strategic Alignment & Innovation Differentiation": 0.26,
            "AI/ML & Intelligent Capabilities": 0.22, 
            "User Experience Adoption & Cultural Fit": 0.14,
            "Risk, Security & Privacy1": 0.07,
            "Sustainability & ESG": 0.04
        },
            reasoning=("In R&D contexts, digital leaders prioritize innovation speed, AI capabilities,and future differentiation. Risk and ESG are acknowledged but intentionally deprioritized."
)
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Packaging",
        tool="LabelFlow",
        persona="CDO / Head of Digital / Innovation",
        feature_categories=[
            "Strategic Alignment & Innovation Differentiation",
            "Innovation Velocity & Future Readiness",
            "AI/ML & Intelligent Capabilities",
            "User Experience Adoption & Cultural Fit",
            "Risk, Security & Privacy1",
            "Sustainability & ESG"

        ],
        initial_weights={
            "Strategic Alignment & Innovation Differentiation": 0.25,
            "Innovation Velocity & Future Readiness": 0.25,
            "AI/ML & Intelligent Capabilities": 0.20, 
            "User Experience Adoption & Cultural Fit": 0.15,
            "Risk, Security & Privacy1": 0.10,
            "Sustainability & ESG": 0.05
        },
        final_weights={
            "Innovation Velocity & Future Readiness": 0.26,
            "Strategic Alignment & Innovation Differentiation": 0.25,
            "AI/ML & Intelligent Capabilities": 0.21, 
            "User Experience Adoption & Cultural Fit": 0.17,
            "Risk, Security & Privacy1": 0.07,
            "Sustainability & ESG": 0.04
        },
        reasoning=("In packaging workflows, the CDO emphasizes fast experimentation and user adoption, while maintaining moderate focus on AI enablement.")

    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Design",
        tool="Rhino 3D",
        persona="CDO / Head of Digital / Innovation",
        feature_categories=[
            "Strategic Alignment & Innovation Differentiation",
            "Innovation Velocity & Future Readiness",
            "AI/ML & Intelligent Capabilities",
            "User Experience Adoption & Cultural Fit",
            "Risk, Security & Privacy1",
            "Sustainability & ESG"

        ],
        initial_weights={
            "Strategic Alignment & Innovation Differentiation": 0.25,
            "Innovation Velocity & Future Readiness": 0.25,
            "AI/ML & Intelligent Capabilities": 0.20, 
            "User Experience Adoption & Cultural Fit": 0.15,
            "Risk, Security & Privacy1": 0.10,
            "Sustainability & ESG": 0.05
        },
        final_weights={
            "Strategic Alignment & Innovation Differentiation": 0.27,
            "Innovation Velocity & Future Readiness": 0.26,
            "AI/ML & Intelligent Capabilities": 0.20, 
            "User Experience Adoption & Cultural Fit": 0.17,
            "Risk, Security & Privacy1": 0.06,
            "Sustainability & ESG": 0.04
        },
        reasoning=("Design-stage tools are evaluated primarily on creativity enablement, UX adoption,and innovation flexibility rather than security or sustainability concerns.")

    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Production",
        tool="ProShop ERP",
        persona="CISO / Head of Cyber",
        feature_categories=[
            "Cyber Risk Identification",
            "Security Standards Compliance & Legal Requirements",
            "Access Control Authentication & Identity",
            "Data Governance Privacy Controls & Geo Sovereignity",
            "Network Security Infrastructure Protection",
            "Vendor Risk Stability & Roadmap",
            "Disaster Recovery & Business Continuity",
            "Geo Political & Supply Chain Security Risk",
            "Technical Risk",
            "Change Management Risk",
            "Sustainability & ESG"

        ],
        initial_weights={
            "Cyber Risk Identification": 0.15,
            "Security Standards Compliance & Legal Requirements": 0.14,
            "Access Control Authentication & Identity": 0.12,
            "Data Governance Privacy Controls & Geo Sovereignity": 0.11,
            "Network Security Infrastructure Protection": 0.10,
            "Vendor Risk Stability & Roadmap": 0.09,
            "Disaster Recovery & Business Continuity": 0.09,
            "Geo Political & Supply Chain Security Risk": 0.07,
            "Technical Risk": 0.07,
            "Change Management Risk": 0.04,
            "Sustainability & ESG": 0.02
        },
        final_weights={
            "Cyber Risk Identification": 0.18,
            "Security Standards Compliance & Legal Requirements": 0.16,
            "Access Control Authentication & Identity": 0.13,
            "Data Governance Privacy Controls & Geo Sovereignity": 0.12,
            "Network Security Infrastructure Protection": 0.11,
            "Disaster Recovery & Business Continuity": 0.11,
            "Vendor Risk Stability & Roadmap": 0.09,
            "Geo Political & Supply Chain Security Risk": 0.05,
            "Technical Risk": 0.03,
            "Change Management Risk": 0.01,
            "Sustainability & ESG": 0.01
        },
        reasoning=("In production environments, CISOs heavily prioritize cyber risk identification, compliance, access control, and business continuity. ESG is not a decision driver.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Design",
        tool="SketchUp",
        persona="CISO / Head of Cyber",
        feature_categories=[
            "Cyber Risk Identification",
            "Security Standards Compliance & Legal Requirements",
            "Access Control Authentication & Identity",
            "Data Governance Privacy Controls & Geo Sovereignity",
            "Network Security Infrastructure Protection",
            "Vendor Risk Stability & Roadmap",
            "Disaster Recovery & Business Continuity",
            "Geo Political & Supply Chain Security Risk",
            "Technical Risk",
            "Change Management Risk",
            "Sustainability & ESG"

        ],
        initial_weights={
            "Cyber Risk Identification": 0.15,
            "Security Standards Compliance & Legal Requirements": 0.14,
            "Access Control Authentication & Identity": 0.12,
            "Data Governance Privacy Controls & Geo Sovereignity": 0.11,
            "Network Security Infrastructure Protection": 0.10,
            "Vendor Risk Stability & Roadmap": 0.09,
            "Disaster Recovery & Business Continuity": 0.09,
            "Geo Political & Supply Chain Security Risk": 0.07,
            "Technical Risk": 0.07,
            "Change Management Risk": 0.04,
            "Sustainability & ESG": 0.02
        },
        final_weights={
            "Cyber Risk Identification": 0.16,
            "Security Standards Compliance & Legal Requirements": 0.15,
            "Access Control Authentication & Identity": 0.13,
            "Data Governance Privacy Controls & Geo Sovereignity": 0.12,
            "Network Security Infrastructure Protection": 0.10,
            "Vendor Risk Stability & Roadmap": 0.09,
            "Disaster Recovery & Business Continuity": 0.10,
            "Geo Political & Supply Chain Security Risk": 0.07,
            "Technical Risk": 0.05,
            "Change Management Risk": 0.02,
            "Sustainability & ESG": 0.01
        },
        reasoning=(" During design phases, CISOs maintain strong focus on compliance, access controls, and data governance while slightly relaxing infrastructure risk concerns."
)
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),



    dspy.Example(
        sector="Manufacturing",
        stage="Planning",
        tool="Oracle Supply Chain Planning Cloud",
        persona="CISO / Head of Cyber",
        feature_categories=[
            "Cyber Risk Identification",
            "Security Standards Compliance & Legal Requirements",
            "Access Control Authentication & Identity",
            "Data Governance Privacy Controls & Geo Sovereignity",
            "Network Security Infrastructure Protection",
            "Vendor Risk Stability & Roadmap",
            "Disaster Recovery & Business Continuity",
            "Geo Political & Supply Chain Security Risk",
            "Technical Risk",
            "Change Management Risk",
            "Sustainability & ESG"

        ],
        initial_weights={
            "Cyber Risk Identification": 0.15,
            "Security Standards Compliance & Legal Requirements": 0.14,
            "Access Control Authentication & Identity": 0.12,
            "Data Governance Privacy Controls & Geo Sovereignity": 0.11,
            "Network Security Infrastructure Protection": 0.10,
            "Vendor Risk Stability & Roadmap": 0.09,
            "Disaster Recovery & Business Continuity": 0.09,
            "Geo Political & Supply Chain Security Risk": 0.07,
            "Technical Risk": 0.07,
            "Change Management Risk": 0.04,
            "Sustainability & ESG": 0.02
        },
        final_weights={
            "Cyber Risk Identification": 0.17,
            "Security Standards Compliance & Legal Requirements": 0.16,
            "Access Control Authentication & Identity": 0.12,
            "Data Governance Privacy Controls & Geo Sovereignity": 0.12,
            "Disaster Recovery & Business Continuity": 0.11,
            "Network Security Infrastructure Protection": 0.10,
            "Vendor Risk Stability & Roadmap": 0.10,
            "Geo Political & Supply Chain Security Risk": 0.07,
            "Technical Risk": 0.03,
            "Change Management Risk": 0.01,
            "Sustainability & ESG": 0.01
        },
        reasoning="Planning phases for CISOs emphasize risk identification and compliance with moderate vendor focus."
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="Design",
        tool="Alias Design",
        persona="Enterprise / Solution Architect",
        feature_categories=[
            "Technical Fit & Architecture1 ",
            "Integrations, Interoperability & Flexibility1",
            "Security Governance & Compliance Alignment",
            "Extensibility Customization & Future Readiness"

        ],
        initial_weights={
            "Technical Fit & Architecture1 ": 0.4,
            "Integrations, Interoperability & Flexibility1": 0.2,
            "Security Governance & Compliance Alignment": 0.2,
            "Extensibility Customization & Future Readiness": 0.2
        },
        final_weights={
            "Technical Fit & Architecture1 ": 0.45,
            "Integrations, Interoperability & Flexibility1": 0.25,
            "Security Governance & Compliance Alignment": 0.15,
            "Extensibility Customization & Future Readiness": 0.15
        },
        reasoning=("Enterprise architects prioritize architectural fit and integration capabilities during early design stages.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),



    dspy.Example(
        sector="Manufacturing",
        stage="Planning",
        tool="Syncron Inventory",
        persona="Enterprise / Solution Architect",
        feature_categories=[
            "Technical Fit & Architecture1 ",
            "Integrations, Interoperability & Flexibility1",
            "Security Governance & Compliance Alignment",
            "Extensibility Customization & Future Readiness"

        ],
        initial_weights={
            "Technical Fit & Architecture1 ": 0.4,
            "Integrations, Interoperability & Flexibility1": 0.2,
            "Security Governance & Compliance Alignment": 0.2,
            "Extensibility Customization & Future Readiness": 0.2
        },
        final_weights={
            "Technical Fit & Architecture1 ": 0.40,
            "Integrations, Interoperability & Flexibility1": 0.30,
            "Security Governance & Compliance Alignment": 0.15,
            "Extensibility Customization & Future Readiness": 0.15
        },
        reasoning=("Planning systems require stronger interoperability across platforms, while maintaining architectural consistency.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),


    dspy.Example(
        sector="Manufacturing",
        stage="R&D",
        tool="Altium Designer",
        persona="Enterprise / Solution Architect",
        feature_categories=[
            "Technical Fit & Architecture1 ",
            "Integrations, Interoperability & Flexibility1",
            "Security Governance & Compliance Alignment",
            "Extensibility Customization & Future Readiness"

        ],
        initial_weights={
            "Technical Fit & Architecture1 ": 0.4,
            "Integrations, Interoperability & Flexibility1": 0.2,
            "Security Governance & Compliance Alignment": 0.2,
            "Extensibility Customization & Future Readiness": 0.2
        },
        final_weights={
            "Technical Fit & Architecture1 ": 0.42,
            "Integrations, Interoperability & Flexibility1": 0.28,
            "Security Governance & Compliance Alignment": 0.15,
            "Extensibility Customization & Future Readiness": 0.15
        },
        reasoning=("In R&D tools, solution architects focus on extensible architectures and seamless integration with existing engineering ecosystems.")
    ).with_inputs("sector", "stage", "tool", "persona", "feature_categories", "initial_weights"),
]




def dynamic_weight_metric(gold, pred, trace, pred_name=None, pred_trace=None):
    """
    gold: expected output from training example (final_weights)
    pred: model prediction (dspy.Prediction)
    trace: internal execution trace 
    pred_name: name of the prediction field
    pred_trace: trace for that prediction
    """
    if gold is None or pred is None:
        return 0.0
    
    if not hasattr(pred, "final_weights"):
        return 0.0
    
    score = 0.0
    count = 0
    for k, gold_value in gold.items():
        pred_value = pred.final_weights.get(k, 0.0)

        try:
            p_val = float(pred_value)
        except:
            p_val = 0.0

        score += max(0.0, 1.0 - abs(gold_value - p_val))
        count += 1

    if count == 0:
        return 0.0
    
    return score/count


def get_compiled_optimizer():
    reflection_lm = dspy.LM(
        model = "gpt-4o",
        temperature = 0,
        max_tokens = 2000
    )

    optimizer = dspy.GEPA(
    metric=dynamic_weight_metric,
    reflection_lm=reflection_lm,  
    max_metric_calls = 10
    )
    optimized_module = optimizer.compile(
        DynamicWeightModule(),
        trainset=train_examples
    )

    return optimized_module


def run_ai_weight_optimization(sector, stage, tool, persona, feature_categories, initial_weights):
    optimized_module = get_compiled_optimizer()
    result = optimized_module(
        sector=sector,
        stage=stage,
        tool=tool,
        persona=persona,
        feature_categories=feature_categories,
        initial_weights=initial_weights
    )
    return result.final_weights, result.reasoning

class New_ComparisonState(TypedDict):
    input_tool: Dict
    alternative_tool: Dict
    persona: str
    weights: Dict[str, float]
    weight_mode: str
    new_report: str
    estimated_tokens: int
    actual_tokens: Dict[str, int]
    estimation_done: bool

def preparation_data(state: New_ComparisonState) -> New_ComparisonState:
    # if state.get("estimation_done", False):
    #     return state
    
    # selected_json = json.dumps(state["input_tool"], separators=(',', ':'))
    # alternative_json = json.dumps(state["alternative_tool"], separators=(',', ':'))
    
    # # Rough but better estimation
    # base_prompt = f"""Compare {selected_json} vs {len(state["alternative_tool"])} tools as {state.get('persona', 'Executive')} 
    # with SWOT, GAP, Market Share, and Recommendation."""
    
    # total_chars = len(base_prompt) + len(selected_json) + len(alternative_json) + 3000  # buffer for full prompt
    # state["estimated_tokens"] = int(total_chars / 4)
    # state["estimation_done"] = True
    return state

PERSONA_PROMPTS = {
    "Board / Executive Sponsor": {
        "icon": "🏛️",
        "tone": "Strategic, financial, risk-focused",
        "focus": "ROI, auditability, large spends, strategic alignment, business case"
    },
    "CIO / CTO": {
        "icon": "🖥️",
        "tone": "Technical strategy & architecture",
        "focus": "Integration, TCO, standards, scalability, IT roadmap"
    },
    "CDO / Head of Digital / Innovation": {
        "icon": "🚀",
        "tone": "Innovation & transformation",
        "focus": "AI-readiness, UX, modernization, data access, speed to value"
    },
    "CISO / Head of Cyber": {
        "icon": "🔒",
        "tone": "Security & compliance first",
        "focus": "Risk exposure, data protection, compliance, vendor security posture"
    },
    "Enterprise / Solution Architect": {
        "icon": "⚙️",
        "tone": "Deep technical architecture",
        "focus": "Interoperability, APIs, data models, technical debt, migration paths"
    }
}

# ==================== FEATURE CATEGORIES FOR SCORING ==========================================================================================
strategic_market_alignment = ["Market Fit", "Scalability", "Competitive Advantage", "Innovation Potential", "Customer/User Value", "Customer Retention Impact", "Adaptability", "Business Continuity", "Time-to-Market", "Productivity", "Global Expansion Enabler", "Global Reach", "Vendor Product Roadmap/Future Vision", "Future Readiness"] 
revenue_and_financial_impact = ["TCO (Total Cost of Ownership)", "ROI", "Revenue Enablement", "Profitability Impact", "Cost Optimization", "Cash Flow Impact", "Licensing Model"] 
risk_security_privacy = ["Security & Privacy", "Data Governance", "Cyber Resilience", "Risk Exposure", "Geopolitical Risk / Geo-Sovereignty", "Ethical AI Practices", "Disaster Recovery capabilities - RTO, RPO, multi-region, automated failover, backup frequency", "Data Ownership & IP Rights", "Compliant with Global Regulations, (GDPR, CCPA, HIPAA, SOC2)", "Security & Risk Profile (Access Controls, Encryption, Audit logs, Zero Trust principles)"] 
vendor_ecosystem_stability = ["Vendor Stability", "Ecosystem Partnerships", "Support & Community", "Procurement Flexibility", "Vendor Profile (Venture-Capital Backed, Self-Funded/Bootstrapped, Private-Equity Owned)", "Merger & Aquisition", "Vendor Lock-In Exposure (Vendor Contract Terms & Exit Clauses)",  "Vendor Product Roadmap/Future Vision", "Any Proprietary Language (Does The tool uses a private, vendor-specific language)"] 
sustanaibility_esg_change_management = ["Brand Reputation Impact", "Business Continuity", "Change Management", "Cultural Fit", "Customer/User Value", "Sustainability", "Social Impact", "Support & Community", "Energy and carbon footprint of running the tool"]
integrations_interoperability_flexibility  = ["Integration Capability", "Interoperability", "Number of Integrations", "Multi-Modal Support", "Customizability", "Collaboration Features"] 
operational_efficiency_performance = ["Efficiency", "Speed / Latency", "Throughput" "Robustness", "Productivity", "Resilience Engineering", "Energy Efficiency", "Accuracy / Precision", "Automation", "Resilience Engineering", "MTTR (Mean Time to Repair / Mean Time to Recovery)", "FTE Full-Time Equivalent", "Monitoring & Observability (Any metrics, logs, traces)", "Automation"] 
technical_fit_architecture= ["Architecture", "Scalability", "Updates & Maintenance", "Does it Support Devops Practices (CI/CD, infrastructure‑as‑code, automated deployments etc.)", "Legacy-in-Waiting ( Does the  tool looks modern but becomes outdated very quickly)", "Any Proprietary Language (Does The tool uses a private, vendor-specific language)"] 
risk_security_privacy1 = ["Security & Privacy", "Data Governance", "Cyber Resilience", "Risk Exposure", "Geopolitical Risk / Geo-Sovereignty", "Zero Trust principles (mTLS, micro-segmentation, continuous verification, policy enforcement etc.)", "Any security baseline? (Encryption at rest & transit, MFA, SSO, RBAC, audit logs”, Any regulatory obligations? (GDPR, HIPAA, PCI-DSS, SOC2, ISO 27001, FedRAMP, local data laws", "Zero Trust principles (mTLS, micro-segmentation, continuous verification, policy enforcement etc.)"] 
disaster_recovery_business_continuity = ["Disaster Recovery capabilities - RTO, RPO, multi-region, automated failover, backup frequency)", "SLA Uptime"] 
User_experience_adoption = ["UI/UX", "Human-Centric Design", "Innovation Potential", "Version", "Primary Users", "Training & Documentation"] 
Sustainability_esg = ["Sustainability", "Ethical AI Practices", "Energy and carbon footprint of running the tool", "Social Impact"] 
maintainability_extensiblity_customization = ["customization", "Version", "Updates & Maintenance"] 
data_ownership_portability = ["Who Owns the data", "Metadata Generated by tool - Format in which we can export data - (formats, APIs, bulk export)", "Any data retention, archival, and deletion policies configurable"] 
strategic_market_alignment1 = [ "Competitive Advantage", "Futuristic Readiness", "Customer/User Value", "Adaptability", "Business Continuity", "Vendor Product Roadmap/Future Vision"] 
strategic_alignment_innovation_differentiation = ["Innovation Potential", "Competitive Advantage", "Ecosystem Partnerships", "Futuristic Readiness",  "Version", "Updates & Maintenance"] 
Innovation_velocity_future_readiness = ["Vendor Product Roadmap/Future Vision", "Innovation Potential", "Futuristic Readiness", "Is it AI-native / Gen-AI-first or just retrofitted AI?", "Any Built-in experimentation framework (A/B testing, personalization engines etc.)"] 
ai_ml_intelligent_capabilities = ["Is it AI-ready? (Clean, structured, secure, accessible data + model hosting capabilities", "Any AI/ML capabilities"] 
risk_security_privacy1 = ["Security & Privacy", "Data Governance", "Cyber Resilience", "Risk Exposure", "Geopolitical Risk / Geo-Sovereignty", "Ethical AI Practices", "Any security baselines? (Encryption at rest & transit, MFA, SSO, RBAC, audit logs)", "Any regulatory obligations? (GDPR, HIPAA, PCI-DSS, SOC2, ISO 27001, FedRAMP, local data laws", "Zero Trust principles (mTLS, micro-segmentation, continuous verification, policy enforcement etc.)"] 
user_experience_adoption_cultural_fit = ["UI/UX", "Human Centric Design", "Learning Curve", "Adaptability", "Collaboration Features", "Gamification", "Accessibility"]  
cyber_risk_identification = ["Security & Privacy","Cyber Resilience", "Integration with any threat intelligence sources (STIX/TAXII, OTX, MISP)?", "Detect insider threats, anomalies, and unknown attacks (Any ML-based detection)?"] 
security_standards_compliance_legal_requirements = ["All sensitive data encrypted in storage and in transit (AES-256, TLS 1.3)?", "Any regulatory obligations? (GDPR, HIPAA, PCI-DSS, SOC2, ISO 27001, FedRAMP, local data laws", "Does the vendor undergo regular security audits and penetration testing?"] 
access_control_authentication_identity = ["Any security baselines? (Encryption at rest & transit, MFA, SSO, RBAC, audit logs", "Offer any granular roles and permissions (RBAC/ABAC)?", "Integrate with any IAM Systems (Azure AD, Okta, Ping)"] 
network_security_infrastructure_protection = ["Integration with firewalls, NDR, cloud security groups, and network access controls?"] 
data_governance_privacy_controls_geo_sovereignity = ["Geo-Sovereignty", "Data Governance", "Data Ownership (Who owns the data, logs, detections, and alerts?", "Any data retention, archival, and deletion policies configurable?"] 
geo_political_supply_chain_security_risk = ["Geopolitical Risk", "Any supply chain security risks (libraries, components, third-party dependencies)?"] 
vendor_risk_stability_roadmap = ["Vendor Product Roadmap/Future Vision", "Ecosystem Partnerships", "Does the vendor undergo regular security audits and penetration testing?"] 
technical_risk = ["Integration Capability", "Interoperability", "Zero Trust principles (mTLS, micro-segmentation, continuous verification, policy enforcement etc.)"] 
change_management_risk = ["Change Management", "Learning Curve", "Cultural Fit"] 
technical_fit_architecture1= ["Architecture", "Scalability", "Resilience Engineering",  "Knowledge Management", "Innovation Potential", "Futuristic Readiness", "Does it Support Devops Practices (CI/CD, infrastructure‑as‑code, automated deployments etc.)", "Monitoring & Observability (Any metrics, logs, traces)"] 
integrations_interoperability_flexibility1  = ["Integration Capability", "Interoperability", "Number of Integrations", "Multi-Modal Support", "Does it provide SDKs in common languages (.NET, Java, Python, JS)?", "Training & Documentation"] 
security_governance_compliance_alignment = ["Integrate with any IAM Systems (Azure AD, Okta, Ping)", "Offer any granular roles and permissions (RBAC/ABAC)?", "Is All sensitive data encrypted in storage and in transit (AES-256, TLS 1.3)?", "Any regulatory obligations? (GDPR, HIPAA, PCI-DSS, SOC2, ISO 27001, FedRAMP, local data laws", "Any data retention, archival, and deletion policies configurable?", "Disaster Recovery capabilities - RTO, RPO, multi-region, automated failover, backup frequency)"] 
extensiblity_customization_future_readiness = ["Product Roadmap & Vision" "Customizability", "Automation",  "Updates & Maintenance","Version", "Innovation Potential", "Futuristic Readiness"] 


persona_weights = {
    "Board / Executive Sponsor": {
        "Strategic & Market Alignment": 0.25,
        "Revenue and Financial Impact": 0.25,
        "Risk, Security & Privacy": 0.20,
        "Vendor & Ecosystem Stability": 0.15,
        "Sustainability, ESG & Change Management": 0.15,

    },
    "CIO / CTO": {
        "Revenue and Financial Impact": 0.15,
        "Integrations, Interoperability & Flexibility": 0.14,
        "Operational Efficiency & Performance": 0.12,
        "Technical Fit & Architecture": 0.10,
        "User Experience & Adoption": 0.09,
        "Strategic & Market Alignment1": 0.08,
        "Risk, Security & Privacy1": 0.07,
        "Disaster Recovery & Business Continuity" : 0.06,
        "Vendor & Ecosystem Stability": 0.06,
        "Maintainability, Extensibility & Customization": 0.05,
        "Sustainability & ESG": 0.03,
        "Data Ownership & Portability": 0.05
    },
    "CDO / Head of Digital / Innovation": {
        "Strategic Alignment & Innovation Differentiation": 0.25,
        "Innovation Velocity & Future Readiness": 0.25,
        "AI/ML & Intelligent Capabilities": 0.20, 
        "User Experience Adoption & Cultural Fit": 0.15,
        "Risk, Security & Privacy1": 0.10,
        "Sustainability & ESG": 0.05
    },
    "CISO / Head of Cyber": {
        "Cyber Risk Identification": 0.15,
        "Security Standards Compliance & Legal Requirements": 0.14,
        "Access Control Authentication & Identity": 0.12,
        "Data Governance Privacy Controls & Geo Sovereignity": 0.11,
        "Network Security Infrastructure Protection": 0.10,
        "Vendor Risk Stability & Roadmap": 0.09,
        "Disaster Recovery & Business Continuity": 0.09,
        "Geo Political & Supply Chain Security Risk": 0.07,
        "Technical Risk": 0.07,
        "Change Management Risk": 0.04,
        "Sustainability & ESG": 0.02
    },
    "Enterprise / Solution Architect": {
        "Technical Fit & Architecture1 ": 0.4,
        "Integrations, Interoperability & Flexibility1": 0.2,
        "Security Governance & Compliance Alignment": 0.2,
        "Extensibility Customization & Future Readiness": 0.2
    }
}

category_map = {
    "Strategic & Market Alignment": strategic_market_alignment,
    "Revenue and Financial Impact": revenue_and_financial_impact,
    "Risk, Security & Privacy": risk_security_privacy,
    "Vendor & Ecosystem Stability": vendor_ecosystem_stability,
    "Sustainability, ESG & Change Management": sustanaibility_esg_change_management,
    "Operational Efficiency & Performance": operational_efficiency_performance,
    "Technical Fit & Architecture": technical_fit_architecture,
    "Integrations, Interoperability & Flexibility": integrations_interoperability_flexibility,
    "User Experience & Adoption": User_experience_adoption,
    "Strategic & Market Alignment1": strategic_market_alignment1,
    "Risk, Security & Privacy1": risk_security_privacy1,
    "Disaster Recovery & Business Continuity" : disaster_recovery_business_continuity ,
    "Vendor & Ecosystem Stability": vendor_ecosystem_stability,
    "Maintainability, Extensibility & Customization": maintainability_extensiblity_customization,
    "Sustainability & ESG": Sustainability_esg,
    "Data Ownership & Portability": data_ownership_portability,
    "Strategic Alignment & Innovation Differentiation": strategic_alignment_innovation_differentiation,
    "Innovation Velocity & Future Readiness": Innovation_velocity_future_readiness,
    "AI/ML & Intelligent Capabilities": ai_ml_intelligent_capabilities, 
    "User Experience Adoption & Cultural Fit": user_experience_adoption_cultural_fit,
    "Cyber Risk Identification": cyber_risk_identification,
    "Security Standards Compliance & Legal Requirements": security_standards_compliance_legal_requirements,
    "Access Control Authentication & Identity": access_control_authentication_identity,
    "Data Governance Privacy Controls & Geo Sovereignity": data_governance_privacy_controls_geo_sovereignity,
    "Network Security Infrastructure Protection": network_security_infrastructure_protection,
    "Vendor Risk Stability & Roadmap": vendor_risk_stability_roadmap,
    "Disaster Recovery & Business Continuity": disaster_recovery_business_continuity,
    "Geo Political & Supply Chain Security Risk": geo_political_supply_chain_security_risk,
    "Technical Risk": technical_risk,
    "Change Management Risk": change_management_risk,
    "Technical Fit & Architecture1 ": technical_fit_architecture1,
    "Integrations, Interoperability & Flexibility1": integrations_interoperability_flexibility1,
    "Security Governance & Compliance Alignment": security_governance_compliance_alignment,
    "Extensibility Customization & Future Readiness": extensiblity_customization_future_readiness
}


def get_effective_weights(selected_persona, weight_mode, active_weights=None, dynamic_weights=None):
    """
    Get effective weights 
    """

    if weight_mode == "static(Default Weights)":
        weights = persona_weights[selected_persona]
    elif weight_mode == "User Based":
        weights = active_weights if active_weights else persona_weights[selected_persona]
    elif weight_mode == "Dynamic (AI Optimized)":
        weights = dynamic_weights if dynamic_weights else persona_weights[selected_persona]
    else:
        weights = persona_weights[selected_persona]

    return weights

    

def build_persona_focus_text(selected_persona, weights=None):
    
    if weights is None:
        persona_focus_weights = persona_weights.get(selected_persona, {})
    else:
        persona_focus_weights = weights

    sorted_weights = sorted(
        persona_focus_weights.items(),
        key=lambda x: x[1],
        reverse=True
    )

    focus_lines = []
    for rank, (category, weight) in enumerate(sorted_weights, start=1):
        criteria = category_map.get(category, [])
        line = (
            f"{rank}. {category} "
            f"(importance rank: {rank}, weight: {weight}) → "
            f"{', '.join(criteria)}"
        )
        focus_lines.append(line)

    dominant_category = focus_lines[0]   

    return dominant_category, "\n".join(focus_lines)


def alternative_tool_comparison(state: New_ComparisonState) -> New_ComparisonState:

    selected_persona = state.get("persona", "Board/Executive Sponsor")
    weights = state.get("weights", persona_weights.get(selected_persona, {}))
    persona_focus_block = build_persona_focus_text(selected_persona, weights)

    print(f"Persona: {selected_persona}")
    print(f"Weights: {weights}")
    print(f"Focus Block:\n{persona_focus_block}")

    prompt_template = """Generate a highly tailored and deterministic comparison report between "{tool_name}"
    vs. "{alternative_tool_name}" written exclusively for a {persona}. 

    
    ### Constriants (Strict - Non Negotiable)
    - Do not paraphrase.
    - Do not introduce synonyms
    - Each section must be written in factual, neutral language.
    
    Audience: {persona}
    Tone & Focus: {tone}. Prioritize: {focus}.

    Base analysis strictly and only from the provided Excel data inside:
    -  tool_name(selected tool)
    -  alternative_tool (alternative_tool))
    Do NOT use external knowledge (Gartner, internet, case studies, ROI assumptions, market share, brand position).

    Persona Focus & Category Weights
    Use the persona_focus_block below which already contains persona-specific weightage, category mapping, feature list for each category
    {persona_focus_block}

    ### Selected Tool - Excel Data (Must use)
    {input_tool_data}

    ### Alternative Tool - Excel Data (Must Use)
    {alternative_tool_data}
   
     Use persona specific their tone, language and priorities."""

    prompt = PromptTemplate.from_template(prompt_template)

    model = ChatOpenAI(model="gpt-4o", temperature=0, max_tokens=2000)

    vars_for_prompt = {
        "tool_name": state["input_tool"].get("Tool Name", "Selected Tool"),
        "alternative_tool_name": state["alternative_tool"].get("Tool Name", " "),
        "persona": state.get("persona", "Board / Executive Sponsor"),
        "tone": PERSONA_PROMPTS[state.get("persona", "Board / Executive Sponsor")]["tone"],
        "focus": PERSONA_PROMPTS[state.get("persona", "Board / Executive Sponsor")]["focus"],
        "dominant_category": build_persona_focus_text(state.get("persona", "Board / Executive Sponsor"), weights)[0],
        "persona_focus_block": build_persona_focus_text(state.get("persona", "Board / Executive Sponsor"), weights)[1],
        "input_tool_data": json.dumps(state["input_tool"], separators=(',', ':')),
        "alternative_tool_data": json.dumps(state["alternative_tool"], separators=(',', ':'))
    }
    
    full_prompt = prompt.invoke(vars_for_prompt)  
    prompt_str = full_prompt.to_string() 

    # js_code = f"console.log({json.dumps(prompt_str)});"
    # components.html(f"<script>{js_code}</script>", height=0)

    chain = (
        {
            "tool_name": lambda x: x["input_tool"].get("Tool Name", "Selected_Tool"),
            "alternative_tool_name": lambda x: x["alternative_tool"].get("Tool Name", ""),
            "persona": lambda x: x.get("persona", "Board/Executive Sponsor"),
            "tone": lambda x: PERSONA_PROMPTS[x.get("persona", "Board/Executive Sponsor")]["tone"],
            "focus": lambda x: PERSONA_PROMPTS[x.get("persona", "Board/Executive Sponsor")]["focus"],
            "dominant_category": lambda x: build_persona_focus_text(x.get("persona", "Board / Executive Sponsor"),x.get("weights"))[0],
            "persona_focus_block": lambda x: build_persona_focus_text(x.get("persona", "Board / Executive Sponsor"), x.get("weights"))[1],
            "input_tool_data": lambda x: json.dumps(x["input_tool"], separators=(',', ':')),
            "alternative_tool_data": lambda x: json.dumps(x["alternative_tool"], separators=(',', ':'))
        }
        | prompt
        | model
        | StrOutputParser()
    ) 

   # print("Prompt Input", state)

    with get_openai_callback() as cb1:
        response = chain.invoke(state)

   # print("LLM Raw Output", repr(response))


    state["actual_tokens"] = {
        "prompt_tokens": cb1.prompt_tokens,
        "completion_tokens": cb1.completion_tokens,
        "total_tokens": cb1.total_tokens
    }

    state["new_report"] = response
    return state

def build_new_graph():
    wf1 = StateGraph(New_ComparisonState)

    wf1.add_node("prepare", preparation_data)
    wf1.add_node("comparison", alternative_tool_comparison)
    wf1.set_entry_point("prepare")
    wf1.add_edge("prepare", "comparison")
    wf1.add_edge("comparison", END)
    return wf1.compile()

graph1 = build_new_graph()


