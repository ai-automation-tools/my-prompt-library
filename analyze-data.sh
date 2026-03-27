#!/bin/bash

echo "📊 Data Analysis Report"
echo "============================================================"
echo ""

echo "📁 Library Structure:"
find library -type d -mindepth 1 -maxdepth 1 | while read dir; do
  count=$(find "$dir" -name "*.md" | wc -l)
  size=$(du -sh "$dir" | cut -f1)
  echo "  $dir: $count files, $size"
done

echo ""
echo "📈 Total Statistics:"
total_files=$(find library -name "*.md" | wc -l)
total_size=$(du -sh library | cut -f1)
avg_size=$(find library -name "*.md" -exec wc -c {} \; | awk '{total+=$1; count++} END {print int(total/count/1024)}')

echo "  Total markdown files: $total_files"
echo "  Total size: $total_size"
echo "  Average file size: ${avg_size}KB"

echo ""
echo "🔝 Largest Files:"
find library -name "*.md" -exec du -h {} \; | sort -rh | head -10

echo ""
echo "📦 Estimated Payload Sizes:"
# Count total chars in first 200 chars of each file (lightweight mode)
lightweight_size=$(find library -name "*.md" -exec head -c 200 {} \; | wc -c)
echo "  Lightweight mode (~200 chars/file): $((lightweight_size / 1024))KB"

# Actual total size
full_size=$(find library -name "*.md" -exec cat {} \; | wc -c)
echo "  Full content mode: $((full_size / 1024 / 1024))MB"

echo ""
echo "⚡ Performance Impact:"
if [ $total_files -gt 1000 ]; then
  echo "  ⚠️  LARGE DATASET: $total_files files will cause performance issues"
  echo "  Recommendations:"
  echo "    - Implement pagination (50-100 items per page)"
  echo "    - Use virtual scrolling for grid views"
  echo "    - Add search/filter before loading all data"
fi

if [ $((full_size / 1024 / 1024)) -gt 5 ]; then
  echo "  ⚠️  LARGE PAYLOAD: ${full_size}MB is too large for single request"
  echo "  Recommendations:"
  echo "    - NEVER load full content for all prompts"
  echo "    - Keep lightweight mode mandatory"
  echo "    - Consider CDN or static file serving"
fi

echo ""
echo "============================================================"
