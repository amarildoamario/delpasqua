import json
import os

log_path = r"C:\Users\Utente\.gemini\antigravity\brain\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8') as f:
    for idx, line in enumerate(f):
        line = line.strip()
        if not line:
            continue
        # Check if line contains HomeAboutFamily
        if 'HomeAboutFamily' in line and 'VIEW_FILE' in line:
            # Let's extract JSON block
            pos = line.find('{')
            if pos != -1:
                try:
                    data = json.loads(line[pos:])
                    if data.get('type') == 'VIEW_FILE':
                        print(f"FOUND VIEW_FILE at line {idx}, step {data.get('step_index')}")
                        content_str = data.get('content', '')
                        # Let's print the length and save it to scratch
                        print("Content length:", len(content_str))
                        with open(f"C:\\Users\\Utente\\.gemini\\antigravity\\brain\\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\\scratch\\family_view_{data.get('step_index')}.txt", 'w', encoding='utf-8') as out_f:
                            out_f.write(content_str)
                except Exception as e:
                    print("Error parsing:", e)
        
        # Also do the same for HomeAboutTerritory
        if 'HomeAboutTerritory' in line and 'VIEW_FILE' in line:
            pos = line.find('{')
            if pos != -1:
                try:
                    data = json.loads(line[pos:])
                    if data.get('type') == 'VIEW_FILE':
                        print(f"FOUND VIEW_FILE for Territory at line {idx}, step {data.get('step_index')}")
                        content_str = data.get('content', '')
                        print("Content length:", len(content_str))
                        with open(f"C:\\Users\\Utente\\.gemini\\antigravity\\brain\\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\\scratch\\territory_view_{data.get('step_index')}.txt", 'w', encoding='utf-8') as out_f:
                            out_f.write(content_str)
                except Exception as e:
                    print("Error parsing:", e)
