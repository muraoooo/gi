#!/usr/bin/env python3
"""
SVGからPNGアイコンを生成するスクリプト
Pillowとcairosvgが必要です: pip install Pillow cairosvg
"""

try:
    from cairosvg import svg2png
    import os
    
    # SVGファイルを読み込んでPNGに変換
    svg_path = 'icon.svg'
    
    if os.path.exists(svg_path):
        # 192x192のアイコンを生成
        svg2png(url=svg_path, write_to='icon-192.png', output_width=192, output_height=192)
        print('✓ icon-192.png を生成しました')
        
        # 512x512のアイコンを生成
        svg2png(url=svg_path, write_to='icon-512.png', output_width=512, output_height=512)
        print('✓ icon-512.png を生成しました')
        
        print('\n完了！アイコン画像が生成されました。')
    else:
        print(f'エラー: {svg_path} が見つかりません')
        
except ImportError:
    print('必要なライブラリがインストールされていません。')
    print('以下のコマンドでインストールしてください:')
    print('  pip install cairosvg')
    print('\nまたは、オンラインツールを使用してください:')
    print('  https://cloudconvert.com/svg-to-png')
    print('  https://convertio.co/ja/svg-png/')
