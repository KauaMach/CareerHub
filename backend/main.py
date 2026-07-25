from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth

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

@app.get("/")
def read_root():
    return {"message": "Bem-vindo a API do CareerHub"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok"}
