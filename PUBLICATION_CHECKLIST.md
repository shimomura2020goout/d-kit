# Figmaプラグイン公開申請チェックリスト

## ✅ 完了済み

- [x] manifest.jsonの設定更新
  - プラグイン名: D-kit
  - メニュー項目の追加
  - documentAccessの設定
- [x] package.jsonのメタデータ更新
  - 作者: D-kit
  - 説明文（英語）
  - キーワードの追加
- [x] 公開用説明文の作成（英語・日本語）
  - PLUGIN_DESCRIPTION.md に保存済み
- [x] TypeScriptビルドの実行
  - エラーなく完了

## ⚠️ 準備が必要な項目

### 1. プラグインアイコン（必須）
**要件:**
- サイズ: 最低128x128px（推奨: 256x256px または 512x512px）
- フォーマット: PNG（透過背景推奨）
- デザイン: シンプルで認識しやすいもの

**保存場所:** プロジェクトルートに `icon.png` として保存

### 2. カバー画像（強く推奨）
**要件:**
- サイズ: 1920x960px
- フォーマット: PNG または JPG
- 内容: プラグインの主要機能を視覚的に示す

**保存場所:** プロジェクトルートに `cover.png` として保存

### 3. スクリーンショット（強く推奨）
**要件:**
- 最低2枚、推奨3-5枚
- サイズ: 1200x900px 以上
- 内容:
  1. デザインキットの保存画面
  2. デザインキット選択と適用画面
  3. ビフォー/アフターの比較
  4. 変更履歴の表示画面

**保存場所:** プロジェクトルートに `screenshots/` フォルダを作成

## 📝 公開申請手順

### ステップ1: Figma Desktop Appでの確認
1. Figma Desktop Appを起動
2. `Plugins` > `Development` > `Import plugin from manifest...` で読み込み
3. プラグインを実行して最終確認
4. すべての機能が正常に動作することを確認

### ステップ2: プラグインの公開申請
1. Figma Desktop Appでプラグインを起動
2. プラグインメニューから `Plugins` > `Development` を開く
3. 開発中のプラグイン一覧から「D-kit」を見つける
4. 右クリックまたは設定メニューから `Publish plugin...` を選択

### ステップ3: 公開情報の入力
以下の情報を入力します（PLUGIN_DESCRIPTION.mdを参照）:

**基本情報:**
- Plugin name: D-kit
- Short description: Transform your existing designs instantly by applying styles from any design kit.
- Tags: design-system, style-guide, branding, design-kit

**詳細説明:**
PLUGIN_DESCRIPTION.mdの「Full Description (English)」をコピー

**画像:**
- アイコン: icon.png をアップロード
- カバー: cover.png をアップロード
- スクリーンショット: screenshots/ 内の画像を順番にアップロード

**その他:**
- Category: Productivity / Design Systems
- Support email: （あなたのサポートメールアドレス）
- Website: （オプション）

### ステップ4: レビューと承認待ち
- Figmaチームがプラグインをレビュー（通常1-3営業日）
- 問題があれば修正依頼が来る
- 承認されたら自動的に公開される

## 💡 申請前の最終チェック

- [ ] プラグイン名とIDに禁止文字が含まれていないか
- [ ] すべての機能が期待通りに動作するか
- [ ] エラーハンドリングが適切か
- [ ] ユーザーに分かりやすいUIとメッセージか
- [ ] パフォーマンスは許容範囲か（大量データでもフリーズしない）
- [ ] manifest.jsonにネットワークアクセスが正しく設定されているか
- [ ] 他のプラグインと名前が重複していないか確認

## 📚 参考リンク

- [Figma Plugin Publishing Guide](https://help.figma.com/hc/en-us/articles/360042786114-Publish-plugins-to-the-Figma-Community)
- [Plugin Manifest Requirements](https://www.figma.com/plugin-docs/manifest/)
- [Plugin Review Guidelines](https://help.figma.com/hc/en-us/articles/360042843854-Plugin-review-guidelines)

## ⚡ クイックスタート（画像準備後）

1. icon.png, cover.png, screenshots/*.png を準備
2. Figma Desktop Appでプラグインを起動
3. Development > D-kit を右クリック > Publish plugin
4. PLUGIN_DESCRIPTION.mdの内容をコピー&ペースト
5. 画像をアップロード
6. Submit for review

---

**現在の状態:** コード部分は準備完了。画像素材の準備が残っています。
