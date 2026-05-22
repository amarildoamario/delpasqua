import os

log_path = r"C:\Users\Utente\.gemini\antigravity\brain\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for "export default function HomeAboutFamily"
import re

matches = [m.start() for m in re.finditer("export default function HomeAboutFamily", content)]
print(f"Found {len(matches)} matches for export default function HomeAboutFamily")

for i, pos in enumerate(matches):
    start = max(0, pos - 100)
    end = min(len(content), pos + 4000)
    # Let's save each match to a separate file in scratch
    out_path = f"C:\\Users\\Utente\\.gemini\\antigravity\\brain\\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\\scratch\\extracted_family_{i}.txt"
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(content[start:end])
    print(f"Saved match {i} to {out_path}")

matches_t = [m.start() for m in re.finditer("export default function HomeAboutTerritory", content)]
print(f"Found {len(matches_t)} matches for export default function HomeAboutTerritory")

for i, pos in enumerate(matches_t):
    start = max(0, pos - 100)
    end = min(len(content), pos + 4000)
    out_path = f"C:\\Users\\Utente\\.gemini\\antigravity\\brain\\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\\scratch\\extracted_territory_{i}.txt"
    with open(out_path, 'w', encoding='utf-8') as out_f:
        out_f.write(content[start:end])
    print(f"Saved match {i} to {out_path}")
