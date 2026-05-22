import json

log_path = r"C:\Users\Utente\.gemini\antigravity\brain\905ffc34-9bf3-4fe1-a278-67f44cf1cb54\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for i, line in enumerate(f):
        if "HomeAboutFamily" in line:
            try:
                step = json.loads(line)
            except Exception as e:
                print(f"Line {i} error: {e}")
                continue
            
            print(f"Line {i}: type={step.get('type')}, source={step.get('source')}, status={step.get('status')}")
            # Print keys of the step
            print("Keys:", list(step.keys()))
            if "tool_calls" in step:
                print("tool_calls:", len(step["tool_calls"]))
            if "content" in step:
                print("content length:", len(step["content"]))
                # Print a snippet of content
                print("content snippet:", step["content"][:200])
            print("="*60)
            
            # Let's break after 10 matches to not flood the logs
            # but wait, let's keep searching for the ones with WRITE_FILE or similar
