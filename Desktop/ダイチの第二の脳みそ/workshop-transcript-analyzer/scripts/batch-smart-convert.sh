#!/bin/bash

TRANSCRIPTS_DIR="/Users/muraokadaichi/Desktop/ダイチの第二の脳みそ/work/MMSアーカイブ/transcripts_2026-04-06"
OUTPUT_DIR="/Users/muraokadaichi/Desktop/ダイチの第二の脳みそ/work/MMSアーカイブ/文字起こしファイル"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

total=$(find "$TRANSCRIPTS_DIR" -name "*.vtt" | wc -l)
count=0
success=0
skipped=0
failed=0

echo "Starting smart batch conversion..."
echo "Total VTT files: $total"
echo "Output directory: $OUTPUT_DIR"
echo ""

for vtt_file in "$TRANSCRIPTS_DIR"/*.vtt; do
    count=$((count + 1))
    percentage=$((count * 100 / total))
    filename=$(basename "$vtt_file")
    output_file="$OUTPUT_DIR/${filename%.vtt}_実装教科書.md"

    # Skip if already converted
    if [ -f "$output_file" ]; then
        echo "[$count/$total] ($percentage%) SKIP: $filename"
        skipped=$((skipped + 1))
    else
        echo "[$count/$total] ($percentage%) CONVERT: $filename"
        if python3 "$SCRIPT_DIR/smart-convert.py" "$vtt_file" "$OUTPUT_DIR" 2>&1 | grep -q "✓"; then
            success=$((success + 1))
        else
            failed=$((failed + 1))
            echo "  ⚠ Conversion had issues"
        fi
    fi
done

echo ""
echo "================================"
echo "Conversion Complete"
echo "================================"
echo "Total:    $total files"
echo "Success:  $success files"
echo "Skipped:  $skipped files"
echo "Failed:   $failed files"
echo "================================"
