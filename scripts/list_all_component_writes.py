import json
import os

log_path = r"C:\Users\Utente\.gemini\antigravity\brain\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\.system_generated\logs\transcript.jsonl"

writes = []

with open(log_path, 'r', encoding='utf-8') as f:
    for line_num, line in enumerate(f):
        try:
            step = json.loads(line)
        except Exception:
            continue
        
        step_type = step.get("type", "")
        step_index = step.get("step_index", line_num)
        
        tool_calls = step.get("tool_calls", [])
        for tc in tool_calls:
            name = tc.get("name", "")
            args = tc.get("args", {})
            target = args.get("TargetFile", "") or args.get("Target", "")
            
            if target and ("HomeAboutFamily" in target or "HomeAboutTerritory" in target):
                writes.append({
                    "step": step_index,
                    "tool": name,
                    "file": os.path.basename(target),
                    "description": args.get("Description") or step.get("content") or ""
                })

for w in writes:
    print(f"Step {w['step']}: {w['tool']} on {w['file']} - {w['description'][:150]}")
