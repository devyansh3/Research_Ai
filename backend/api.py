from datetime import datetime, timedelta, timezone
from pathlib import Path
import os
from typing import Dict, List

from fastapi import Cookie, Depends, FastAPI, HTTPException, Query, Response, status
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, Field
import pandas as pd
import json
from sqlalchemy import Boolean, DateTime, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker

# ==========================================
# IMPORTS FROM YOUR EXISTING 
# ==========================================
# import  dictionaries and functions directly from  backend files!
from rar27 import (
    PERSONA_PROMPTS, 
    persona_weights, 
    category_map, 
    run_ai_weight_optimization
)
from main import generate_fresh_report, generate_fresh_comparison

# ==========================================
# GLOBAL CONFIGURATION
# ==========================================
app = FastAPI(
    title="Project RAR API",
    description="Backend API for the Research & Analysis multi-agent system",
    version="1.0.0"
)

DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]


def _parse_csv_env(name: str, fallback: List[str]) -> List[str]:
    value = os.getenv(name, "")
    if not value.strip():
        return fallback
    return [item.strip() for item in value.split(",") if item.strip()]


ALLOWED_ORIGINS = _parse_csv_env("CORS_ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS)
ALLOWED_ORIGIN_REGEX = os.getenv("CORS_ALLOWED_ORIGIN_REGEX", "").strip() or None

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

IS_VERCEL = os.getenv("VERCEL", "").lower() in {"1", "true"}
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    db_path = Path("/tmp/auth.db") if IS_VERCEL else Path("./data/auth.db").resolve()
    if not IS_VERCEL:
        db_path.parent.mkdir(parents=True, exist_ok=True)
    DATABASE_URL = f"sqlite:///{db_path}"

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-insecure-change-me")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
AUTH_COOKIE_NAME = os.getenv("AUTH_COOKIE_NAME", "rar_access_token")
AUTH_COOKIE_SECURE = os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true"
AUTH_COOKIE_SAMESITE = os.getenv("AUTH_COOKIE_SAMESITE", "lax").lower()
if AUTH_COOKIE_SAMESITE not in {"lax", "strict", "none"}:
    AUTH_COOKIE_SAMESITE = "lax"

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="member", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


Base.metadata.create_all(bind=engine)

SECTOR_PATHS = {
    "Manufacturing": r"./data/data_file.xlsx",
}

# Shared column list from your Streamlit app to ensure we pull the exact right data
ALL_COLUMNS = [
    'Tool Name', 'Tool Type', 'Vendor', 'Region', 'Cost', 'Number of Integrations', 
    'Efficiency', 'Version', 'Core Features', 'Customizability', 'Integration Capability', 
    'Multi-Modal Support', 'Automation', 'Knowledge Management', 'Speed / Latency', 
    'Scalability', 'Robustness', 'Adaptability', 'Energy Efficiency', 'UX/UI', 'Accessibility', 
    'Support & Community', 'Gamification', 'Architecture', 'Security & Privacy', 'Interoperability', 
    'Updates & Maintenance', 'Resilience Engineering', 'Geo-Sovereignty', 'Licensing Model', 
    'TCO (Total Cost of Ownership)', 'ROI / Value Creation', 'Vendor Stability', 
    'Procurement Flexibility', 'Cash Flow Impact', 'Revenue Enablement', 'Cost Optimization', 
    'Profitability Impact', 'Risk Exposure', 'Sustainable Finance Impact', 'Competitive Advantage', 
    'Market Fit', 'Time-to-Market', 'Ecosystem Partnerships', 'Innovation Potential', 
    'Customer Retention Impact', 'Global Expansion Enabler', 'Brand Reputation Impact', 
    'Data Governance', 'Ethical AI Practices', 'Cyber Resilience', 'Business Continuity', 
    'Geopolitical Risk', 'Collaboration Features', 'Customer/User Value', 'Futuristic Readiness'
]

# ==========================================
# CHUNK 1: DATA MODELS 
# ==========================================

class WeightOptimizationRequest(BaseModel):
    """Payload expected when asking DSPy to optimize weights"""
    sector: str
    stage: str
    tool: str
    persona: str
    feature_categories: List[str]
    initial_weights: Dict[str, float]

class MainReportRequest(BaseModel):
    """ payload for the main report. Only needs the string name of the input tool, not the whole dict."""
    sector: str
    stage: str
    input_tool_name: str  
    persona: str
    weights: Dict[str, float]

class ComparisonReportRequest(BaseModel):
    """payload for 1-on-1 comparison. Only needs string names of the two tools."""
    sector: str
    stage: str
    input_tool_name: str
    compare_tool_name: str 
    persona: str
    weights: Dict[str, float]

class BaseConfigurationResponse(BaseModel):
    sectors: List[str]
    personas: List[str]
    default_weights: Dict[str, Dict[str, float]]
    feature_categories: List[str]

class WeightOptimizationResponse(BaseModel):
    status: str
    optimized_weights: Dict[str, float]
    reasoning: str

class StagesResponse(BaseModel):
    sector: str
    stages: List[str]

class ToolsResponse(BaseModel):
    sector: str
    stage: str
    tools: List[str]

class ReportResponse(BaseModel):
    status: str
    report_markdown: str
    token_usage: Dict[str, int] = Field(default_factory=dict)


class AuthCredentialsRequest(BaseModel):
    email: str
    password: str


class AuthUserResponse(BaseModel):
    id: int
    email: str
    role: str


class LogoutResponse(BaseModel):
    status: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(user: User) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": expires_at,
    }
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=AUTH_COOKIE_NAME,
        value=token,
        max_age=JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=AUTH_COOKIE_SECURE,
        samesite=AUTH_COOKIE_SAMESITE,
        path="/",
    )


def clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=AUTH_COOKIE_NAME,
        path="/",
        secure=AUTH_COOKIE_SECURE,
        samesite=AUTH_COOKIE_SAMESITE,
    )


def get_current_user(
    auth_cookie: str | None = Cookie(default=None, alias=AUTH_COOKIE_NAME),
    db: Session = Depends(get_db),
) -> User:
    if not auth_cookie:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = jwt.decode(auth_cookie, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = int(payload.get("sub", "0"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()  # noqa: E712
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def require_role(allowed_roles: List[str]):
    def _require_role(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")
        return current_user

    return _require_role


@app.post("/api/v1/auth/signup", response_model=AuthUserResponse)
def signup(payload: AuthCredentialsRequest, response: Response, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    if len(payload.password) < 8:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must be at least 8 characters")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        role="member",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user)
    set_auth_cookie(response, token)
    return AuthUserResponse(id=user.id, email=user.email, role=user.role)


@app.post("/api/v1/auth/login", response_model=AuthUserResponse)
def login(payload: AuthCredentialsRequest, response: Response, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User account is inactive")

    token = create_access_token(user)
    set_auth_cookie(response, token)
    return AuthUserResponse(id=user.id, email=user.email, role=user.role)


@app.post("/api/v1/auth/logout", response_model=LogoutResponse)
def logout(response: Response):
    clear_auth_cookie(response)
    return LogoutResponse(status="success")


@app.get("/api/v1/auth/me", response_model=AuthUserResponse)
def me(current_user: User = Depends(get_current_user)):
    return AuthUserResponse(id=current_user.id, email=current_user.email, role=current_user.role)

# ==========================================
# CHUNK 2: BASE CONFIGURATION & DSPY AI
# ==========================================

@app.get("/api/v1/base-config", response_model=BaseConfigurationResponse)
def get_base_configuration(current_user: User = Depends(get_current_user)):
    """
    Returns only the static, hardcoded configuration data for dropdowns.
    """
    return {
        "sectors": list(SECTOR_PATHS.keys()),
        "personas": list(PERSONA_PROMPTS.keys()),
        "default_weights": persona_weights,
        "feature_categories": list(category_map.keys())
    }

@app.post("/api/v1/optimize-weights", response_model=WeightOptimizationResponse)
def optimize_weights(request: WeightOptimizationRequest, current_user: User = Depends(get_current_user)):
    """
    Receives user context and triggers the DSPy agent to calculate weights dynamically.
    """
    try:
        final_weights, reasoning = run_ai_weight_optimization(
            sector=request.sector,
            stage=request.stage,
            tool=request.tool,
            persona=request.persona,
            feature_categories=request.feature_categories,
            initial_weights=request.initial_weights
        )
        return {
            "status": "success",
            "optimized_weights": final_weights,
            "reasoning": reasoning
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weight optimization failed: {str(e)}")


# ==========================================
# CHUNK 3:  EXCEL DATA EXRACTION Event Listeners 
# ==========================================

@app.get("/api/v1/stages", response_model=StagesResponse)
def get_stages(sector: str = Query(..., description="The selected sector"), current_user: User = Depends(get_current_user)):
    """
    Returns the available lifecycle stages (Excel sheets) for a sector.
    """
    if sector not in SECTOR_PATHS:
        raise HTTPException(status_code=404, detail="Sector not found or data in progress")
        
    try:
        xls = pd.ExcelFile(SECTOR_PATHS[sector])
        return {"sector": sector, "stages": xls.sheet_names}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading data: {str(e)}")


@app.get("/api/v1/tools", response_model=ToolsResponse)
def get_tools(
    sector: str = Query(..., description="The selected sector"),
    stage: str = Query(..., description="The selected stage/sheet"),
    current_user: User = Depends(get_current_user),
):
    """
    Returns the list of available tools in that specific sheet.
    """
    if sector not in SECTOR_PATHS:
        raise HTTPException(status_code=404, detail="Sector not found")
        
    try:
        df = pd.read_excel(SECTOR_PATHS[sector], sheet_name=stage)
        df.columns = df.columns.str.strip()
        tools = df['Tool Name'].dropna().unique().tolist()
        return {"sector": sector, "stage": stage, "tools": tools}
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Stage '{stage}' not found in {sector}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading tools: {str(e)}")


# ==========================================
# CHUNK 4: LANGGRAPH GENERATION ENDPOINTS
# ==========================================

@app.post("/api/v1/generate-report", response_model=ReportResponse)
def create_main_report(request: MainReportRequest, current_user: User = Depends(get_current_user)):
    """
    Reads data from Excel based on the requested tool name and triggers the main report generation.
    """
    try:
        excel_path = SECTOR_PATHS.get(request.sector)
        if not excel_path:
            raise HTTPException(status_code=404, detail="Sector data not found")

        # Load and prep data
        df = pd.read_excel(excel_path, sheet_name=request.stage)
        df.columns = df.columns.str.strip()

        # Extract specific dictionaries based on the string name
        tool_row = df[df['Tool Name'] == request.input_tool_name].iloc[0]
        input_tool_dict = tool_row[ALL_COLUMNS].to_dict()
        
        compare_tools_list = df[df['Tool Name'] != request.input_tool_name][ALL_COLUMNS].to_dict('records')

        # Run LangGraph workflow
        result = generate_fresh_report(
            _input_tool_json=json.dumps(input_tool_dict),
            _compare_tools_json=json.dumps(compare_tools_list),
            _persona=request.persona,
            _weights_json=json.dumps(request.weights)
        )
        
        return {
            "status": "success",
            "report_markdown": result["report"],
            "token_usage": result.get("actual_tokens", {})
        }
    except IndexError:
        raise HTTPException(status_code=404, detail="Tool not found in the specified sheet")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Main report generation failed: {str(e)}")


@app.post("/api/v1/compare-tools", response_model=ReportResponse)
def create_comparison_report(request: ComparisonReportRequest, current_user: User = Depends(get_current_user)):
    """
    Reads data from Excel for two specific tools and triggers the 1-on-1 comparison generation.
    """
    try:
        excel_path = SECTOR_PATHS.get(request.sector)
        if not excel_path:
            raise HTTPException(status_code=404, detail="Sector data not found")

        df = pd.read_excel(excel_path, sheet_name=request.stage)
        df.columns = df.columns.str.strip()

        # Extract specific dictionaries for BOTH tools
        tool_row = df[df['Tool Name'] == request.input_tool_name].iloc[0]
        input_tool_dict = tool_row[ALL_COLUMNS].to_dict()

        alt_row = df[df['Tool Name'] == request.compare_tool_name].iloc[0]
        alt_tool_dict = alt_row[ALL_COLUMNS].to_dict()

        # Run LangGraph 1-on-1 workflow
        result = generate_fresh_comparison(
            _input_tool_json=json.dumps(input_tool_dict),
            _compare_tool_json=json.dumps(alt_tool_dict),
            _persona=request.persona,
            _weights_json=json.dumps(request.weights)
        )
        
        return {
            "status": "success",
            "report_markdown": result["new_report"],
            "token_usage": result.get("actual_tokens", {})
        }
    except IndexError:
        raise HTTPException(status_code=404, detail="One or both tools not found in the specified sheet")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison report generation failed: {str(e)}")
