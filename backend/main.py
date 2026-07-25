from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules.Identity.auth_router import router as auth_router
from modules.Companies.companies_router import router as companies_router
from modules.Career.jobs_router import router as jobs_router
from modules.Documents.resumes_router import router as resumes_router
from modules.Documents.certificates_router import router as certificates_router
from modules.Analytics.dashboard_router import router as dashboard_router

app = FastAPI(
    title="CareerHub API",
    description="API para gestao centralizada de carreira.",
    version="0.1.0",
)

# Configurar CORS (ajustar origens permitidas conforme o ambiente)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Em producao, definir origens especificas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(companies_router, prefix="/api/v1/companies", tags=["companies"])
app.include_router(jobs_router, prefix="/api/v1/jobs", tags=["jobs"])
app.include_router(resumes_router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(certificates_router, prefix="/api/v1/certificates", tags=["certificates"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": "Bem-vindo a API do CareerHub"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
