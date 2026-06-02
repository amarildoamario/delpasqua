import os

file_path = r"c:\Users\Utente\Desktop\React\delpasqua\src\lib\blogTranslationsData.ts"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the unescaped backticks in tec-2
content = content.replace("`[M-H]⁻ = 153.05`", "'[M-H]⁻ = 153.05'")
content = content.replace("`[M-H]⁻ = 539.17`", "'[M-H]⁻ = 539.17'")
content = content.replace("`[M-H]⁻ = 303.12`", "'[M-H]⁻ = 303.12'")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Backticks cleaned up successfully in tec-2!")
