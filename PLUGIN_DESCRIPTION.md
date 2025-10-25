# D-kit - Plugin Description for Figma Community

## Short Description (English)
Transform your existing designs instantly by applying styles from any design kit. Automatically match colors, text styles, and effects while preserving your layout.

## Short Description (日本語)
既存のデザインを瞬時に変換。任意のデザインキットのスタイルを自動適用し、レイアウトを保持したまま、カラー、テキストスタイル、エフェクトをマッチングします。

---

## Full Description (English)

**D-kit** is a powerful Figma plugin designed for design teams who need to quickly adapt existing designs to different design systems or style guides.

### ✨ Key Features

- **Export Design Kits**: Save color styles, text styles, effects, and component information from any Figma file
- **Automatic Style Matching**: Intelligently matches colors using proximity algorithms and text styles based on font size
- **Visual Change Log**: See exactly what changed after applying a design kit
- **Non-Destructive Workflow**: Creates duplicates of your original layers, so you can always go back
- **Local Storage**: Your design kits are saved locally and available across all your Figma files

### 🎯 Perfect For

- Campaign designers who need to quickly rebrand landing pages
- Design teams maintaining multiple brand variations
- Designers working with Figma Community design systems
- Anyone who wants to experiment with different style directions

### 🚀 How It Works

**First Time Setup:**
1. Open a Figma file with the design kit you want to save (e.g., a Figma Community file)
2. Run D-kit and click "Save Current File as Design Kit"
3. Your design kit is now saved and ready to use

**Daily Workflow:**
1. Open your working file with existing designs
2. Select the layers you want to transform
3. Run D-kit and choose a saved design kit from the dropdown
4. Click "Apply Design Kit to Selection"
5. A duplicate layer is created with the new styles applied

### 🔧 Technical Details

- Matches colors using Euclidean distance in RGB color space
- Selects text styles based on closest font size match
- Normalizes corner radius to common values (4, 8, 16px, etc.)
- Preserves layout, spacing, and layer hierarchy
- Supports frames, groups, sections, and individual elements

### 📋 Requirements

- Figma Desktop App or Browser
- Design kits must be Figma files with defined color styles, text styles, or effects

### 🔮 Coming Soon

- Multiple design kit management
- Custom mapping rules
- Batch processing
- Style override options

---

## Full Description (日本語)

**D-kit**は、既存のデザインを異なるデザインシステムやスタイルガイドに素早く適応させる必要があるデザインチーム向けの強力なFigmaプラグインです。

### ✨ 主な機能

- **デザインキットのエクスポート**: 任意のFigmaファイルからカラースタイル、テキストスタイル、エフェクト、コンポーネント情報を保存
- **自動スタイルマッチング**: 近接アルゴリズムを使用して色をインテリジェントにマッチング、フォントサイズに基づいてテキストスタイルを適用
- **変更履歴の可視化**: デザインキット適用後に何が変更されたかを正確に確認
- **非破壊ワークフロー**: オリジナルレイヤーの複製を作成するため、いつでも元に戻せます
- **ローカルストレージ**: デザインキットはローカルに保存され、すべてのFigmaファイルで利用可能

### 🎯 こんな方におすすめ

- ランディングページのリブランディングを素早く行いたいキャンペーンデザイナー
- 複数のブランドバリエーションを管理するデザインチーム
- Figma Communityのデザインシステムを活用するデザイナー
- 異なるスタイルの方向性を試してみたい方

### 🚀 使い方

**初回セットアップ:**
1. 保存したいデザインキットのFigmaファイルを開く（例: Figma Communityファイル）
2. D-kitを起動し、「現在のファイルをデザインキットとして保存」をクリック
3. デザインキットが保存され、使用準備が完了

**日常のワークフロー:**
1. 既存のデザインがある作業ファイルを開く
2. 変換したいレイヤーを選択
3. D-kitを起動し、ドロップダウンから保存済みのデザインキットを選択
4. 「選択レイヤーにデザインキットを適用」をクリック
5. 新しいスタイルが適用された複製レイヤーが作成されます

### 🔧 技術仕様

- RGB色空間のユークリッド距離を使用して色をマッチング
- 最も近いフォントサイズに基づいてテキストスタイルを選択
- 角丸を一般的な値（4、8、16pxなど）に正規化
- レイアウト、間隔、レイヤー階層を保持
- フレーム、グループ、セクション、個別要素をサポート

### 📋 必要要件

- Figma Desktop AppまたはBrowser
- デザインキットは、カラースタイル、テキストスタイル、またはエフェクトが定義されたFigmaファイルである必要があります

### 🔮 近日公開予定

- 複数のデザインキット管理
- カスタムマッピングルール
- バッチ処理
- スタイルオーバーライドオプション

---

## Tags/Keywords

design-system, style-guide, branding, design-kit, color-palette, typography, automation, productivity, design-tokens, rebranding

## Category

Productivity, Design Systems
