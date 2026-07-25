from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, companies, jobs, resumes, certificates, dashboard

app = FastAPI(
    title="CareerHub API",
    description="API para gestao centralizada de carreira.",
    version="0.1.0",
)

# Configurar CORS (ajustar origens permitidas conforme o ambiente)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em producao, definir origens especificas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(companies.router, prefix="/api/v1/companies", tags=["companies"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["jobs"])
app.include_router(resumes.router, prefix="/api/v1/resumes", tags=["resumes"])
app.include_router(certificates.router, prefix="/api/v1/certificates", tags=["certificates"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["dashboard"])

@app.get("/")
def read_root():
    return {"message": "Bem-vindo a API do CareerHub"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
