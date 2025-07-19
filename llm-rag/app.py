from constants.gemini_constants import YaplessMode
from model.gemini import ask_gemini_with_custom_prompt

res = ask_gemini_with_custom_prompt(
    "how much MSG does tomato has?", mode=YaplessMode.AUTO.value)
print(res)
