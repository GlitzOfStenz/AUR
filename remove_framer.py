import os
import re

def strip_framer_props(text):
    props = ['initial', 'animate', 'exit', 'transition', 'variants', 'whileHover', 'whileTap', 'whileInView', 'layoutId', 'layout', 'custom', 'viewport']
    
    # Simple state machine to remove prop={...} or prop="..."
    for prop in props:
        while True:
            # Find the prop boundary (whitespace before, '=' after)
            match = re.search(r'\s' + prop + r'(?:=|\s|>)', text)
            if not match:
                break
                
            start_idx = match.start() + 1
            idx = start_idx + len(prop)
            
            # If it's just `layout ` without `=`
            if text[idx] != '=':
                text = text[:start_idx] + text[idx:]
                continue
                
            idx += 1 # skip '='
            if text[idx] == '{':
                # find matching brace
                brace_count = 1
                end_idx = idx + 1
                while brace_count > 0 and end_idx < len(text):
                    if text[end_idx] == '{': brace_count += 1
                    elif text[end_idx] == '}': brace_count -= 1
                    end_idx += 1
                text = text[:start_idx] + text[end_idx:]
            elif text[idx] in ['"', "'", "`"]:
                quote = text[idx]
                end_idx = text.find(quote, idx + 1)
                if end_idx != -1:
                    text = text[:start_idx] + text[end_idx + 1:]
                else:
                    break
            else:
                break
    return text

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Remove imports
    content = re.sub(r'import\s*\{[^}]*motion[^}]*\}\s*from\s*[\'"`]framer-motion[\'"`];?', '', content)
    content = re.sub(r'import\s+motion\s+from\s*[\'"`]framer-motion[\'"`];?', '', content)
    content = re.sub(r'import\s*\{[^}]*AnimatePresence[^}]*\}\s*from\s*[\'"`]framer-motion[\'"`];?', '', content)
    content = re.sub(r'import\s*\{[^}]*Variants[^}]*\}\s*from\s*[\'"`]framer-motion[\'"`];?', '', content)
    content = re.sub(r'import\s*\{[^}]*useInView[^}]*\}\s*from\s*[\'"`]framer-motion[\'"`];?', '', content)
    content = re.sub(r'import\s*\{[^}]*useAnimation[^}]*\}\s*from\s*[\'"`]framer-motion[\'"`];?', '', content)
    
    # 2. Fix tags
    content = re.sub(r'<motion\.([a-zA-Z0-9]+)', r'<\1', content)
    content = re.sub(r'</motion\.([a-zA-Z0-9]+)>', r'</\1>', content)
    
    content = re.sub(r'<AnimatePresence[^>]*>', '<>', content)
    content = re.sub(r'</AnimatePresence>', '</>', content)

    # 3. Strip props
    content = strip_framer_props(content)
    
    # 4. Clean up stray variants objects (optional, they won't hurt if left as unused consts)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned {filepath}")

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))
