import os
import re

directory = 'frontend/src/app'

for root, _, files in os.walk(directory):
    for file in files:
        if not file.endswith('.tsx'):
            continue
            
        filepath = os.path.join(root, file)
        with open(filepath, 'r') as f:
            content = f.read()
            
        # Fix missing token checks
        content = re.sub(r'\s*if \(!token\) return;', '', content)
        
        # Fix implicit any on prev
        content = content.replace('prev => ({ ...prev', '(prev: any) => ({ ...prev')
        content = content.replace('prev => ({\n', '(prev: any) => ({\n')
        
        # And just in case, some `if(!token) return` might be formatted differently
        
        with open(filepath, 'w') as f:
            f.write(content)

print("Fixes complete")
