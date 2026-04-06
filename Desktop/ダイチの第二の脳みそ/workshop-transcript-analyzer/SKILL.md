---
name: workshop-transcript-analyzer
description: Convert WebVTT workshop transcripts into structured implementation textbooks with step-by-step instructions and timestamps. Use when you need to generate implementation guides from workshop recordings. Supports "transcript to textbook conversion", "implementation guide generation", "workshop documentation", or "batch transcript processing".
---

# Workshop Transcript Analyzer

Transforms raw WebVTT workshop transcripts into professionally structured implementation textbooks with automatic timestamp extraction, step-by-step procedures, learning themes, speaker identification, and practical instructions.

## What This Skill Does

**Input:** WebVTT subtitle file (from workshop recording)

**Output:** Markdown implementation textbook (200-250 lines) containing:
- Workshop title, target level, estimated duration
- Speaker/instructor information
- Overview and main learning themes
- Prerequisites and required tools
- 4-8 STEPs with timestamps, speaker names, and procedures
- Technical concepts and code snippets extracted from content
- Troubleshooting guide
- Summary and next steps

## Quick Start (No API Key Required)

### Single File Conversion
```bash
python scripts/smart-convert.py input.vtt [output_dir]
```
This generates `input_実装教科書.md` with extracted content and timestamps.

### Batch Conversion (All Files)
```bash
bash scripts/batch-smart-convert.sh
```
Processes all `.vtt` files in `transcripts_2026-04-06/` and saves to `文字起こしファイル/`

## How It Works

1. **Parse WebVTT** - Extracts timestamps, speakers, and dialogue content
2. **Identify Structure** - Divides transcript into logical steps/sections
3. **Extract Concepts** - Identifies technical terms, learning themes, and tools
4. **Extract Snippets** - Recognizes code patterns, URLs, paths, HTTP methods
5. **Generate Markdown** - Creates structured textbook with STEPs, timestamps, and content
6. **Save Output** - Stores `_実装教科書.md` file in output directory

## File Structure

```
workshop-transcript-analyzer/
├── SKILL.md                         # This file
├── README.md                        # Usage guide
└── scripts/
    ├── smart-convert.py             # Main conversion script (no API key needed)
    ├── batch-smart-convert.sh       # Batch processing script
    ├── simple-convert.py            # Simple template-based converter
    ├── vtt-to-textbook.py          # Legacy Claude API version
    ├── detailed-convert.py          # Advanced template generator
    └── requirements.txt             # Dependencies (for legacy scripts)
```

## How to Use

### Prerequisites
```bash
cd workshop-transcript-analyzer
python3 --version  # Requires Python 3.8+
# No pip dependencies required for smart-convert.py!
```

### Single File Conversion
```bash
python3 scripts/smart-convert.py /path/to/transcript.vtt [output_dir]
```
Example:
```bash
python3 scripts/smart-convert.py ~/Downloads/workshop__transcript.vtt ~/Documents/textbooks/
```

### Batch Conversion (Recommended)
```bash
bash scripts/batch-smart-convert.sh
```
This processes all 183 VTT files and generates improved textbooks automatically.

## Output Example

**Input:** WebVTT transcript with timestamps and speakers
**Output:** Markdown textbook (200-250 lines) with:
- Title, level (初級者向け, etc.), duration estimate
- Main instructors/speakers
- Learning themes automatically identified (HTML, CSS, API, GAS, etc.)
- 4-8 STEPs with timestamps and speaker info
- Extracted procedures and code examples
- Troubleshooting section
- Summary and next steps

## Error Handling

### File not found
```bash
# Make sure the path is correct
ls -la /path/to/transcript.vtt

# Use absolute path
python3 scripts/smart-convert.py $(pwd)/workshop__transcript.vtt
```

### Output directory doesn't exist
```bash
# The script creates it automatically
# Or create manually:
mkdir -p ~/Documents/textbooks/
python3 scripts/smart-convert.py input.vtt ~/Documents/textbooks/
```

### Character encoding issues
The script handles UTF-8 with BOM (byte order mark) automatically.

## Conversion Quality Notes

- **smart-convert.py**: Extracts actual content, timestamps, speakers, learning themes (✅ **Recommended**)
  - Output: 200-250 lines, includes 4-8 STEPs with real content
  - Processing: ~1-5 seconds per file, all 183 files in ~2 minutes
  - No dependencies: pure Python, no API key required
  
- **simple-convert.py**: Template-based, minimal content extraction
  - Output: 100-120 lines, generic structure
  - Use only if you need minimal output
  
- **vtt-to-textbook.py**: Requires Claude API key
  - Legacy approach, higher cost
  - No longer recommended for batch processing

## Batch Processing Results

Process all 183 workshop transcripts:
```bash
bash scripts/batch-smart-convert.sh
```

**Results from April 6, 2026 conversion:**
- Total files: 183
- Successfully converted: 182
- Skipped (manually curated): 1 (260405 file)
- Average output size: 195 lines (vs 38 lines for template)
- Total conversion time: ~2 minutes
- Output directory: `/work/MMSアーカイブ/文字起こしファイル/`

## Performance

- Processing time per file: 1-5 seconds (local processing, no network)
- Batch processing shows progress percentage
- All 183 files convert in ~2 minutes total
- Can be run repeatedly; skips already-converted files
- Minimal memory footprint

## Examples

See `/work/MMSアーカイブ/文字起こしファイル/` for sample outputs:
- `260405_Another MMS朝活_Claudeデスクトップでスキル作成__transcript_実装教科書.md` (manually curated, 368 lines)
- `2025.11.12_Cursorをインストールして使ってみよう__transcript_実装教科書.md` (smart-convert, 238 lines)
- And 181 other auto-converted files...

---

**Updated:** April 6, 2026  
**Version:** 2.1 (Smart Content Extraction, No API Required)  
**Language:** Python 3.8+  
**Author:** Claude Code  
**Status:** Production Ready (All 183 files converted)
