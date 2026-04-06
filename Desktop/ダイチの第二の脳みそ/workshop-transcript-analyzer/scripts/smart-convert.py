#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Smart VTT to Implementation Textbook Converter
Extracts actual procedures, code, and content from transcripts
without requiring API calls
"""

import sys
import re
from pathlib import Path
from datetime import datetime
from collections import defaultdict


def parse_webvtt(vtt_path):
    """Parse WebVTT file and return segments with timestamps"""
    with open(vtt_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if content.startswith('\ufeff'):
        content = content[1:]

    blocks = content.split('\n\n')
    segments = []

    for block in blocks:
        lines = block.strip().split('\n')
        if len(lines) >= 3:  # Need at least: segment number, timestamp, text
            # Timestamp is typically on the second line (after segment number)
            timestamp_match = re.match(
                r'(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)\s+-->\s+(\d{2}:\d{2}:\d{2}(?:\.\d{3})?)',
                lines[1]
            )
            if timestamp_match:
                start_time = timestamp_match.group(1)
                end_time = timestamp_match.group(2)
                text = '\n'.join(lines[2:]).strip()

                if text:
                    speaker_match = re.match(r'(\w+):\s*(.*)', text)
                    if speaker_match:
                        speaker = speaker_match.group(1)
                        content_text = speaker_match.group(2)
                    else:
                        speaker = "Unknown"
                        content_text = text

                    segments.append({
                        'start_time': start_time,
                        'end_time': end_time,
                        'speaker': speaker,
                        'text': content_text
                    })

    return segments


def extract_title(vtt_path):
    """Extract and clean title from filename"""
    filename = Path(vtt_path).stem
    title = filename.replace('__transcript', '').replace('_', ' ')
    return title


def identify_step_boundaries(segments, chunk_size=25):
    """Identify step boundaries by dividing content into logical chunks"""
    steps = []

    # Divide segments into roughly equal chunks
    num_steps = max(4, len(segments) // chunk_size)
    step_size = len(segments) // num_steps

    for step_num in range(num_steps):
        start_idx = step_num * step_size
        end_idx = start_idx + step_size if step_num < num_steps - 1 else len(segments)

        if start_idx < end_idx:
            steps.append({
                'step_num': step_num + 1,
                'segments': segments[start_idx:end_idx],
                'start_idx': start_idx,
                'end_idx': end_idx - 1
            })

    return steps


def extract_code_snippets(text):
    """Extract potential code snippets and technical content"""
    snippets = []

    # Look for paths, URLs, common programming patterns
    code_patterns = [
        (r'[a-zA-Z_][a-zA-Z0-9_]*\s*[=:]\s*["\']?[^\'"\s]+["\']?', 'assignment'),
        (r'localhost[:\d]*/\S+', 'url'),
        (r'/\w+(?:/\w+)*', 'path'),
        (r'(?:POST|GET|DELETE|PUT|PATCH)\s+/\S+', 'http_method'),
        (r'views\s*\\\s*\w+', 'view_reference'),
        (r'blade\.php', 'template'),
    ]

    for pattern, snippet_type in code_patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        snippets.extend([(m, snippet_type) for m in matches])

    return list(set(snippets))


def extract_key_concepts(segments):
    """Extract key technical concepts mentioned"""
    concepts = defaultdict(int)

    technical_terms = [
        'ルーティング', 'routing',
        'コントローラー', 'controller',
        'ビュー', 'view',
        'モデル', 'model',
        'データベース', 'database',
        'HTML', 'CSS', 'JavaScript',
        'PHP', 'Laravel',
        'GET', 'POST', 'PUT', 'DELETE',
        'API', 'REST',
        'ローカルホスト', 'localhost',
        'サーバー', 'server',
        'クライアント', 'client',
    ]

    all_text = ' '.join([seg['text'] for seg in segments])
    all_text_lower = all_text.lower()

    for term in technical_terms:
        if term.lower() in all_text_lower:
            concepts[term] += all_text_lower.count(term.lower())

    # Return top concepts
    sorted_concepts = sorted(concepts.items(), key=lambda x: x[1], reverse=True)
    return [c[0] for c in sorted_concepts[:10]]


def format_step_content(step, all_segments):
    """Format a single step's content"""
    segments = step['segments']
    start_time = segments[0]['start_time']
    end_time = segments[-1]['end_time']

    lines = []

    # Timestamp
    lines.append(f"**タイムスタンプ: {start_time} - {end_time}**\n")

    # Extract speakers in this step
    speakers = set(seg['speaker'] for seg in segments)
    lines.append(f"**話者**: {', '.join(sorted(speakers))}\n")

    # Learning content header
    lines.append("### 学習内容\n")

    # Extract key points from segments
    key_snippets = []
    for segment in segments:
        snippets = extract_code_snippets(segment['text'])
        key_snippets.extend(snippets)

    if key_snippets:
        lines.append("**技術的なポイント:**\n")
        unique_snippets = list(set(key_snippets))[:8]
        for snippet, snippet_type in unique_snippets:
            lines.append(f"- `{snippet}` ({snippet_type})\n")
        lines.append("\n")

    # Content - show ALL segments, not abbreviated
    lines.append("**手順:**\n")
    for i, segment in enumerate(segments, 1):
        text = segment['text']
        # Truncate very long individual segments at 200 chars, but don't skip any
        if len(text) > 200:
            text = text[:200] + "..."
        lines.append(f"{i}. {text}\n")

    lines.append("\n")

    return ''.join(lines)


def generate_smart_textbook(vtt_path):
    """Generate textbook using content extraction"""

    title = extract_title(vtt_path)
    segments = parse_webvtt(vtt_path)

    # Estimate level based on content
    all_text = ' '.join([seg['text'] for seg in segments])
    if any(term in all_text.lower() for term in ['初心者', 'はじめて', '基本', '導入']):
        level = "初級者向け"
    elif any(term in all_text.lower() for term in ['発展', '応用', '実践']):
        level = "中級者向け"
    else:
        level = "初級者～中級者向け"

    # Estimate duration (rough: 300 segments ≈ 1 hour, assuming ~10-15 sec per segment)
    hours = max(1, len(segments) // 300)
    if hours == 0:
        duration = "30分～1時間"
    else:
        duration = f"{hours}～{hours + 1}時間"

    # Identify steps
    steps = identify_step_boundaries(segments, chunk_size=20)

    # Extract key concepts
    key_concepts = extract_key_concepts(segments)

    # Start building textbook
    lines = []
    lines.append(f"# {title} 実装教科書\n")
    lines.append(f"対象レベル: {level}")
    lines.append(f"所要時間: {duration}\n")

    # Get speakers
    speakers = set(seg['speaker'] for seg in segments)
    if speakers and 'Unknown' in speakers:
        speakers.discard('Unknown')
    if speakers:
        lines.append(f"進行: {', '.join(sorted(speakers))}\n")

    lines.append("---\n")

    # Introduction
    lines.append("## はじめに\n")
    lines.append(f"このワークショップ「{title}」では、以下の内容について学びます。\n")

    if key_concepts:
        lines.append("**主な学習テーマ:**\n")
        for concept in key_concepts[:5]:
            lines.append(f"- {concept}\n")
        lines.append("\n")

    lines.append("このガイドは、ワークショップの内容を実装可能な形で再構成したものです。")
    lines.append("各ステップに従うことで、講義と同じスキルを習得できます。\n")

    lines.append("---\n")

    # Prerequisites section
    lines.append("## 準備物\n")
    lines.append("このワークショップに必要なツール・環境：\n")

    # Try to identify required tools from content
    tools_keywords = {
        'Laravel': 'PHP Laravel フレームワーク',
        'localhost': 'ローカル開発環境（localhost）',
        'blade': 'Bladeテンプレートエンジン',
        'composer': 'Composer（PHPパッケージマネージャー）',
        'node': 'Node.js',
        'npm': 'NPM',
        'discord': 'Discord',
        'gas': 'Google Apps Script',
        'sheets': 'Google Sheets',
        'docs': 'Google Docs',
    }

    identified_tools = []
    for keyword, tool_name in tools_keywords.items():
        if keyword.lower() in all_text.lower():
            identified_tools.append(tool_name)

    if identified_tools:
        for tool in identified_tools[:5]:
            lines.append(f"- {tool}\n")
    else:
        lines.append("- テキストエディタまたはIDE\n")
        lines.append("- ウェブブラウザ\n")

    lines.append("- インターネット接続\n\n")
    lines.append("---\n")

    # Steps
    for step in steps[:8]:  # Limit to 8 steps to keep textbook readable
        lines.append(f"## STEP {step['step_num']}: ワークショップの進行\n")
        lines.append(format_step_content(step, segments))
        lines.append("---\n")

    # Troubleshooting
    lines.append("## トラブルシューティング\n")
    lines.append("**実装時に問題が発生した場合：**\n")
    lines.append("1. エラーメッセージを確認して、該当のSTEPを見直す\n")
    lines.append("2. ワークショップのアーカイブ動画を該当タイムスタンプで確認\n")
    lines.append("3. 講師またはコミュニティに質問する\n\n")

    # Summary
    lines.append("---\n")
    lines.append("## まとめ\n")
    lines.append(f"このワークショップ「{title}」で学んだ内容を、実際のプロジェクトに応用してください。\n")
    lines.append("継続的な実践を通じて、スキルを定着させることが重要です。\n")
    lines.append(f"\n作成日: {datetime.now().strftime('%Y年%m月%d日')}")
    lines.append(f"対応ツール: {', '.join(identified_tools[:3]) if identified_tools else 'Various'}")

    return '\n'.join(lines)


def save_textbook(vtt_path, content, output_dir):
    """Save textbook to file"""
    filename = Path(vtt_path).stem
    output_filename = f"{filename}_実装教科書.md"
    output_path = Path(output_dir) / output_filename

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return output_path


def main():
    if len(sys.argv) < 2:
        print("Usage: python smart-convert.py <input.vtt> [output_dir]")
        sys.exit(1)

    vtt_file = sys.argv[1]
    vtt_path = Path(vtt_file).resolve()

    if not vtt_path.exists():
        print(f"Error: File not found: {vtt_path}")
        sys.exit(1)

    output_dir = sys.argv[2] if len(sys.argv) > 2 else vtt_path.parent.parent / "文字起こしファイル"
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"Converting: {vtt_path.name}")

    try:
        content = generate_smart_textbook(str(vtt_path))
        output_path = save_textbook(vtt_path, content, output_dir)
        print(f"✓ Saved: {output_path.name}")
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
