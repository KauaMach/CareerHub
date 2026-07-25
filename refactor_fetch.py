import os
import re

directory = 'frontend/src/app'

for root, _, files in os.walk(directory):
    for file in files:
        if not file.endswith('.tsx') and not file.endswith('.ts'):
            continue
            
        filepath = os.path.join(root, file)
        with open(filepath, 'r') as f:
            content = f.read()

        if 'fetch(' not in content and 'localStorage' not in content:
            continue

        # Modify layout.tsx specific
        if 'layout.tsx' in file:
            content = re.sub(r'const token = localStorage\.getItem\("token"\);\s*if \(!token\) \{\s*router\.push\("/login"\);\s*\}', r'api.get("/auth/me").catch(() => router.push("/login"));', content)
            content = content.replace('localStorage.removeItem("token");', 'api.post("/auth/logout");')
            
        # Modify login page
        if 'login/page.tsx' in file:
            content = content.replace('localStorage.setItem("token", data.access_token)', '// Token is handled by HttpOnly cookie')
        
        # Remove token fetching
        content = re.sub(r'\s*const token = localStorage\.getItem\("token"\);', '', content)
        
        # Replace fetch URLs
        content = content.replace('fetch("http://localhost:8000/api/v1/', 'api.fetch("/')
        content = content.replace('fetch(`http://localhost:8000/api/v1/', 'api.fetch(`/')
        
        # Remove Authorization headers
        # Because we might have: headers: { "Content-Type": "...", "Authorization": `Bearer ${token}` }
        content = re.sub(r'headers:\s*\{[^}]*"Authorization":\s*`Bearer \$\{token\}`[^}]*\},?', '', content)
        content = re.sub(r'headers:\s*\{\s*"Authorization":\s*`Bearer \$\{token\}`\s*\},?', '', content)
        # Sometime we only have Authorization
        
        # We need to make sure we don't break json syntax if there was body
        # Let's just fix headers manually if regex breaks them. Wait, safer regex:
        content = re.sub(r'"Authorization":\s*`Bearer \$\{token\}`', '', content)
        # Cleanup empty headers
        content = re.sub(r'headers:\s*\{\s*,\s*\}', '', content)
        content = re.sub(r'headers:\s*\{\s*\}', '', content)
        
        # Import api if not there and api is used
        if 'api.' in content and 'import { api } from "@/lib/api"' not in content:
            content = 'import { api } from "@/lib/api";\n' + content

        with open(filepath, 'w') as f:
            f.write(content)
            
print("Refactor complete")
