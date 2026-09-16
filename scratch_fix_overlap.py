import json

f = "public/index.html"
s = open(f, encoding="utf-8").read()

def extract_json_obj(s, start_marker):
    idx = s.find(start_marker)
    brace_start = s.find("{", idx)
    depth = 0
    i = brace_start
    in_str = False
    esc = False
    while i < len(s):
        c = s[i]
        if in_str:
            if esc:
                esc = False
            elif c == '\\':
                esc = True
            elif c == '"':
                in_str = False
        else:
            if c == '"':
                in_str = True
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return s[brace_start:i+1], i+1
        i += 1
    return None, None

raw, end = extract_json_obj(s, "SR7.JSON['SR7_2_1']")
data = json.loads(raw)
node = data["slides"]["36"]
l0 = node["layers"]["0"]  # heading "Relax In Style"
l3 = node["layers"]["3"]  # subtitle
l4 = node["layers"]["4"]  # Shop now button

print("layer0 pos.y:", l0["pos"]["y"])
print("layer3 font.size:", l3["font"]["size"], "lh:", l3["lh"], "pos.y:", l3["pos"]["y"])
print("layer4 pos.y:", l4["pos"]["y"])
