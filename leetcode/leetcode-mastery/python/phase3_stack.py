"""Phase 3: Stack & Queue"""

# --- #20 Valid Parentheses ---
def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for c in s:
        if c in pairs.values():
            stack.append(c)
        elif c in pairs:
            if not stack or stack.pop() != pairs[c]:
                return False
    return len(stack) == 0

# --- #739 Daily Temperatures ---
def daily_temperatures(temps: list[int]) -> list[int]:
    result = [0] * len(temps)
    stack = []  # indices
    for i, t in enumerate(temps):
        while stack and t > temps[stack[-1]]:
            prev = stack.pop()
            result[prev] = i - prev
        stack.append(i)
    return result

# --- #84 Largest Rectangle in Histogram ---
def largest_rectangle_area(heights: list[int]) -> int:
    stack = []
    max_area = 0
    for i, h in enumerate(heights + [0]):  # sentinel
        while stack and h < heights[stack[-1]]:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        stack.append(i)
    return max_area
