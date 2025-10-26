# D-kit Figma プラグイン公開ガイド

このガイドでは、D-kitをFigma Communityに公開するための手順を説明します。

## 📋 公開前チェックリスト

### 必須アセット

- [x] **icon.png** (512x512px) - `icon/icon.png`
  - ✅ 既存: 512x512px PNG（Figmaが自動リサイズ）

- [x] **cover.png** (1920x960px) - `cover/cover.png`
  - ✅ 既存: 1920x960px PNG

- [ ] **screenshots/** (最低2枚、推奨3-5枚)
  - 📸 撮影が必要です
  - サイズ: 1200x900px以上
  - `SCREENSHOT_GUIDE.md` を参照して撮影してください

### ドキュメント

- [x] **README.md** - プロジェクト説明
- [x] **DESIGN_KIT_DETAILS.md** - 機能詳細
- [x] **SCREENSHOT_GUIDE.md** - スクリーンショット撮影ガイド
- [x] **manifest.json** - プラグイン設定

---

## 🎯 ステップ1: スクリーンショット撮影

スクリーンショットがまだの場合、以下の手順で撮影してください：

### 推奨スクリーンショット構成（3-5枚）

1. **デザインキット保存画面** - プラグインの基本機能
2. **デザインキット適用画面** - メイン機能の使用シーン
3. **適用された変更の表示** - 結果の確認
4. （オプション）ビフォー/アフター比較
5. （オプション）進捗バー表示

### 撮影手順

詳細は `SCREENSHOT_GUIDE.md` を参照してください。

**クイックガイド:**

```
1. Figmaでデザインキットファイルを開く
2. D-kitプラグインを起動
3. 「デザインキットを保存」セクションを展開
4. スクリーンショット撮影（Cmd + Shift + 4）
5. screenshots/ フォルダに保存
```

---

## 🚀 ステップ2: Figma Communityへの公開申請

### 2-1. Figma Desktop Appで準備

1. **Figma Desktop Appを開く**

2. **プラグインを開発モードで読み込み**
   ```
   Plugins > Development > Import plugin from manifest...
   ```
   - `manifest.json` を選択
   - Figmaが自動的にIDを生成します

3. **プラグインをテスト**
   - デザインキットを保存してみる
   - 適用機能を試す
   - すべての機能が正常に動作することを確認

### 2-2. 公開申請

1. **Figma Desktop Appのメニューから**
   ```
   Plugins > Development > D-kit > Publish...
   ```

2. **プラグイン情報を入力**

   **基本情報:**
   - **Plugin Name**: `D-kit`
   - **Tagline**: `Transform your existing designs by applying styles from any design kit`
   - **Description**:
     ```
     D-kit は、既存のデザインを選択したデザインキットのスタイルで自動的に置き換えるFigmaプラグインです。

     ✨ 主な機能
     • デザインキットの無制限エクスポート（カラー、テキスト、エフェクト、コンポーネント）
     • コンポーネント自動置き換え（バリアント保持）
     • スタイルの自動適用とマッチング
     • 変更履歴の完全可視化
     • リアルタイム進捗表示
     • 非破壊ワークフロー

     🎯 こんな方におすすめ
     • ランディングページのリブランディングを素早く行いたいデザイナー
     • 複数のブランドバリエーションを管理するデザインチーム
     • Figma Communityのデザインシステムを活用したい方

     ⚡ スケーラブル
     大規模デザインシステム（500+コンポーネント）にも対応。
     すべての機能が無制限で利用可能です。
     ```

   **カテゴリ:**
   - Primary: `Productivity`
   - Secondary: `Design Systems`

   **タグ:**
   - `design-system`
   - `style-transfer`
   - `productivity`
   - `automation`
   - `branding`

3. **アセットをアップロード**

   - **Icon**: `icon/icon.png` (512x512px)
   - **Cover Image**: `cover/cover.png` (1920x960px)
   - **Screenshots**: `screenshots/` から3-5枚

4. **リンクを追加**

   - **Website**: `https://shimomura2020goout.github.io/d-kit/`
   - **GitHub**: `https://github.com/shimomura2020goout/d-kit`
   - **Documentation**: `https://github.com/shimomura2020goout/d-kit#readme`

5. **レビュー用のノート（オプション）**

   ```
   このプラグインは、デザインシステムの適用を効率化するために開発されました。

   テスト方法:
   1. Figma Communityからデザインシステムを複製
   2. D-kitで「デザインキットを保存」
   3. 別のファイルでレイヤーを選択
   4. 「デザインキットを適用」ボタンをクリック

   特記事項:
   - ネットワークアクセス不要（完全ローカル動作）
   - 非破壊ワークフロー（元データは保持）
   - 大規模プロジェクトにも対応（無制限）
   ```

6. **Submit for Review ボタンをクリック**

---

## 📝 ステップ3: レビュー待ち

### レビュープロセス

- **所要時間**: 通常2-7営業日
- **ステータス確認**: Figma Desktop App > Plugins > Your Plugins

### レビュー基準

Figmaは以下の点を確認します：

✅ **機能性**
- プラグインが正常に動作するか
- エラーが発生しないか
- 説明と実際の機能が一致しているか

✅ **品質**
- UIが使いやすいか
- パフォーマンスが適切か
- エラーハンドリングが適切か

✅ **アセット**
- アイコンとカバー画像が規定サイズか
- スクリーンショットが機能を適切に説明しているか

✅ **安全性**
- ユーザーデータを適切に扱っているか
- 外部への不要な通信がないか

---

## 🔄 ステップ4: フィードバック対応（必要な場合）

レビューで修正が必要な場合：

1. Figmaからのフィードバックを確認
2. 必要な修正を実施
3. `npm run build` で再ビルド
4. 再度 Submit for Review

---

## ✅ ステップ5: 公開完了後

公開が承認されたら：

1. **Figma Communityでプラグインを確認**
   - プラグインページのURLを保存
   - 説明やスクリーンショットが正しく表示されているか確認

2. **GitHubページを更新**
   - `index.html` にFigma CommunityリンクURLを追加
   - README.md に公開済みバッジを追加

3. **プロモーション**
   - SNSで公開をアナウンス
   - Figma Communityで他のユーザーからのフィードバックに対応

---

## 🛠️ トラブルシューティング

### スクリーンショットが大きすぎる

```bash
# ImageMagickを使用してリサイズ
convert input.png -resize 1200x900 output.png
```

または、Figmaでリサイズ:
1. スクリーンショットをFigmaにドラッグ
2. 1200x900pxにリサイズ
3. Export as PNG

### アイコンが正方形でない

アイコンは512x512pxの正方形である必要があります。
`icon/icon.png` を確認してください。

### manifest.jsonのIDが無効

初回読み込み時、FigmaがIDを自動生成します。
手動でIDを編集しないでください。

---

## 📞 サポート

問題が発生した場合：

- [Figma Plugin Documentation](https://www.figma.com/plugin-docs/)
- [Figma Community Guidelines](https://help.figma.com/hc/en-us/articles/360038743654)
- [GitHub Issues](https://github.com/shimomura2020goout/d-kit/issues)

---

## 🎉 次のステップ

公開後も継続的に改善していきましょう：

- ユーザーフィードバックの収集
- バグ修正とパフォーマンス改善
- 新機能の追加
- ドキュメントの拡充

頑張ってください！
