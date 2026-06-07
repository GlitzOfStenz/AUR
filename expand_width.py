import os
import re

directory = 'd:/yci/AUR/src/app'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as file:
        content = file.read()
        
    # Replace 'max-w-7xl', 'max-w-6xl', 'max-w-5xl' with 'w-full'
    new_content = re.sub(r'\bmax-w-[567]xl\b', 'w-full', content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Updated: {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
