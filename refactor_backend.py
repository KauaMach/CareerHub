import os
import shutil
import re

base_dir = "backend"
modules_dir = os.path.join(base_dir, "modules")

os.makedirs(modules_dir, exist_ok=True)

modules = {
    "Identity": ["auth"],
    "Companies": ["companies"],
    "Career": ["jobs"],
    "Documents": ["resumes", "certificates"],
    "Analytics": ["dashboard"]
}

# 1. Create module folders
for mod in modules.keys():
    os.makedirs(os.path.join(modules_dir, mod), exist_ok=True)
    with open(os.path.join(modules_dir, mod, "__init__.py"), "w") as f:
        pass

# We will NOT split models and schemas right now because of complex circular dependencies in SQLAlchemy relationships.
# We will just move the routers into modules/{Module}/router.py, and create service.py
# ADR-003 says: "Dentro de cada módulo, manteremos a infraestrutura técnica (rotas, serviços, modelos)".
# Splitting models via script is too risky for syntax errors. Let's start by moving Routers to Modules and creating empty services.

for mod, endpoints in modules.items():
    # Merge endpoints into a single router.py for the module, or keep them separate?
    # Let's keep them as router_{endpoint}.py for now, or just router.py if 1 endpoint
    router_code = ""
    for endpoint in endpoints:
        old_router = os.path.join(base_dir, "routers", f"{endpoint}.py")
        if os.path.exists(old_router):
            with open(old_router, "r") as f:
                content = f.read()
                
            # Replace absolute imports with relative or correct ones
            # from auth import ... -> from modules.Identity.auth import ...
            
            # Since we keep models and schemas in root for now to avoid breaking imports, we just move routers.
            new_router = os.path.join(modules_dir, mod, f"{endpoint}_router.py")
            with open(new_router, "w") as f:
                f.write(content)
            
            # Create a basic service file
            service_file = os.path.join(modules_dir, mod, f"{endpoint}_service.py")
            if not os.path.exists(service_file):
                with open(service_file, "w") as sf:
                    sf.write(f"# Service layer for {endpoint}\n\nclass {endpoint.capitalize()}Service:\n    pass\n")
                    
print("Backend router modularization step 1 complete.")
