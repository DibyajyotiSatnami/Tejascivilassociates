#!/bin/bash
# Generates one image with the FLUX.1 Krea Hugging Face Space (Gradio API).
# Needs a Hugging Face token: here it is injected by the network proxy; elsewhere add
#   -H "Authorization: Bearer $HF_TOKEN" to the two curl calls to the Space.
# Prompts for every image slot are in prompts.tsv (name, width, height, prompt).
# usage: gen.sh <out> <width> <height> <prompt>
H=https://mcp-tools-flux-1-krea-dev.hf.space
OUT=$1; W=$2; HT=$3; P=$4
BODY=$(python3 -c 'import json,sys; print(json.dumps({"data":[sys.argv[1],0,True,int(sys.argv[2]),int(sys.argv[3]),4.5,28]}))' "$P" "$W" "$HT")
EID=$(curl -s -m 30 -X POST "$H/gradio_api/call/infer" -H 'Content-Type: application/json' -d "$BODY" | python3 -c 'import json,sys; print(json.load(sys.stdin)["event_id"])')
RES=$(curl -s -N -m 300 "$H/gradio_api/call/infer/$EID")
URL=$(echo "$RES" | grep '^data:' | tail -1 | sed 's/^data: //' | python3 -c 'import json,sys
d=json.load(sys.stdin)
x=d[0] if isinstance(d,list) else d
print(x["url"] if isinstance(x,dict) else "")' 2>/dev/null)
if [ -z "$URL" ]; then echo "FAIL $OUT: $(echo "$RES" | tail -3)"; exit 1; fi
curl -s -m 60 -o "$OUT" "$URL" && echo "OK $OUT $(file -b "$OUT" | cut -c1-40)"
