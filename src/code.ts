// ===========================
// 型定義
// ===========================

// デザインキットのデータ構造
interface DesignKit {
  name: string;
  sourceFile: string;
  exportedAt: string;
  colors: ColorStyleData[];
  textStyles: TextStyleData[];
  effects: EffectStyleData[];
  components: ComponentData[];
}

// カラースタイル
interface ColorStyleData {
  name: string;
  id: string;
  paints: readonly Paint[];
  description: string;
}

// テキストスタイル
interface TextStyleData {
  name: string;
  id: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string;
  fontWeight: number;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  textCase: TextCase;
  textDecoration: TextDecoration;
  description: string;
}

// エフェクトスタイル
interface EffectStyleData {
  name: string;
  id: string;
  effects: readonly Effect[];
  description: string;
}

// コンポーネント情報
interface ComponentData {
  name: string;
  id: string;
  description: string;
  type: string;
}

// 元に戻すためのデータ型
type UndoData =
  | { type: 'fills'; fills: Paint[] }
  | { type: 'strokes'; strokes: Paint[] }
  | { type: 'text'; fontName: FontName; fontSize: number; lineHeight: LineHeight; letterSpacing: LetterSpacing }
  | { type: 'effects'; effects: Effect[] }
  | { type: 'cornerRadius'; cornerRadius: number };

// 変更記録
interface Change {
  type: 'color' | 'text' | 'effect' | 'corner' | 'component';
  nodeId: string;
  nodeName: string;
  property: string;
  before: string;
  after: string;
  description: string;
  undoData?: UndoData;
}

// UI - プラグイン間のメッセージ型
type MessageToPlugin =
  | { type: 'export-kit' }
  | { type: 'load-kits' }
  | { type: 'kit-selected'; kitName: string }
  | { type: 'apply-kit'; kitName: string }
  | { type: 'focus-node'; nodeId: string }
  | { type: 'undo-change'; change: Change }
  | { type: 'undo-all'; changes: Change[] }
  | { type: 'cancel' };

type MessageToUI =
  | { type: 'export-complete'; kitName: string }
  | { type: 'export-error'; message: string }
  | { type: 'kits-loaded'; kits: DesignKit[] }
  | { type: 'kit-capabilities'; capabilities: KitCapabilities }
  | { type: 'select-layers'; message: string }
  | { type: 'apply-complete'; changes: Change[] }
  | { type: 'apply-error'; message: string }
  | { type: 'no-selection'; message: string }
  | { type: 'undo-complete'; message: string }
  | { type: 'undo-error'; message: string };

// デザインキットの適用可能な機能
interface KitCapabilities {
  colors: number;
  textStyles: number;
  effects: number;
  components: number;
  colorNames: string[];
  textStyleNames: string[];
  effectNames: string[];
  componentNames: string[];
}

// ===========================
// プラグインのメインエントリーポイント
// ===========================
figma.showUI(__html__, { width: 400, height: 600 });

// UIにメッセージを送信するヘルパー
function sendMessage(message: MessageToUI) {
  figma.ui.postMessage(message);
}

// ===========================
// ステップ1: デザインキットのエクスポート
// ===========================

async function handleExportKit() {
  try {
    // dynamic-page の場合、全ページをロードする必要がある
    await figma.loadAllPagesAsync();

    const fileName = figma.root.name;

    // ローカルスタイルを取得（非同期版を使用）
    const localPaintStyles = await figma.getLocalPaintStylesAsync();
    const localTextStyles = await figma.getLocalTextStylesAsync();
    const localEffectStyles = await figma.getLocalEffectStylesAsync();
    const components = figma.root.findAll(node => node.type === 'COMPONENT') as ComponentNode[];

    // カラースタイルの変換
    const colors: ColorStyleData[] = localPaintStyles.map(style => ({
      name: style.name,
      id: style.id,
      paints: style.paints,
      description: style.description
    }));

    // テキストスタイルの変換
    const textStyles: TextStyleData[] = localTextStyles.map(style => ({
      name: style.name,
      id: style.id,
      fontSize: style.fontSize as number,
      fontFamily: style.fontName ? (style.fontName as FontName).family : 'Unknown',
      fontStyle: style.fontName ? (style.fontName as FontName).style : 'Regular',
      fontWeight: style.fontName ? getFontWeight((style.fontName as FontName).style) : 400,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      textCase: style.textCase,
      textDecoration: style.textDecoration,
      description: style.description
    }));

    // エフェクトスタイルの変換
    const effects: EffectStyleData[] = localEffectStyles.map(style => ({
      name: style.name,
      id: style.id,
      effects: style.effects,
      description: style.description
    }));

    // コンポーネント情報の取得
    const componentData: ComponentData[] = components.slice(0, 50).map(comp => ({
      name: comp.name,
      id: comp.id,
      description: comp.description,
      type: comp.type
    }));

    const designKit: DesignKit = {
      name: fileName,
      sourceFile: fileName,
      exportedAt: new Date().toLocaleString('ja-JP'),
      colors,
      textStyles,
      effects,
      components: componentData
    };

    // figma.clientStorageに保存
    const existingKits = await getStoredKits();
    const kitIndex = existingKits.findIndex(k => k.name === fileName);

    if (kitIndex >= 0) {
      existingKits[kitIndex] = designKit; // 上書き
    } else {
      existingKits.push(designKit);
    }

    await figma.clientStorage.setAsync('designKits', existingKits);

    sendMessage({
      type: 'export-complete',
      kitName: fileName
    });

    figma.notify(`✓ デザインキット「${fileName}」を保存しました`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'エクスポートに失敗しました';
    sendMessage({
      type: 'export-error',
      message: errorMessage
    });
    figma.notify(`エラー: ${errorMessage}`, { error: true });
  }
}

// ===========================
// 保存されたキットの読み込み
// ===========================

async function handleLoadKits() {
  try {
    const kits = await getStoredKits();
    sendMessage({
      type: 'kits-loaded',
      kits
    });

    // 最初のキットが選択された場合、その機能情報も送信
    if (kits.length > 0) {
      // UIで選択されたキットの機能を表示するために、選択イベントを待つ
    }
  } catch (error) {
    console.error('Failed to load kits:', error);
  }
}

// 保存されたキットを取得
async function getStoredKits(): Promise<DesignKit[]> {
  const kits = await figma.clientStorage.getAsync('designKits');
  return kits || [];
}

// UIからのメッセージを受信
figma.ui.onmessage = async (msg: MessageToPlugin) => {
  try {
    switch (msg.type) {
      case 'export-kit':
        await handleExportKit();
        break;
      case 'load-kits':
        await handleLoadKits();
        break;
      case 'kit-selected':
        await handleKitSelected(msg.kitName);
        break;
      case 'apply-kit':
        await handleApplyKit(msg.kitName);
        break;
      case 'focus-node':
        await handleFocusNode(msg.nodeId);
        break;
      case 'undo-change':
        await handleUndoChange(msg.change);
        break;
      case 'undo-all':
        await handleUndoAll(msg.changes);
        break;
      case 'cancel':
        figma.closePlugin();
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    sendMessage({
      type: 'apply-error',
      message: errorMessage
    });
  }
};

// キット選択時の処理
async function handleKitSelected(kitName: string) {
  const kits = await getStoredKits();
  const selectedKit = kits.find(k => k.name === kitName);

  if (!selectedKit) {
    return;
  }

  // キットの機能情報を作成
  const capabilities: KitCapabilities = {
    colors: selectedKit.colors.length,
    textStyles: selectedKit.textStyles.length,
    effects: selectedKit.effects.length,
    components: selectedKit.components.length,
    colorNames: selectedKit.colors.map(c => c.name),
    textStyleNames: selectedKit.textStyles.map(t => t.name),
    effectNames: selectedKit.effects.map(e => e.name),
    componentNames: selectedKit.components.map(c => c.name)
  };

  sendMessage({
    type: 'kit-capabilities',
    capabilities
  });
}

// ===========================
// ステップ2: デザインキットの適用
// ===========================

async function handleApplyKit(kitName: string) {
  try {
    // dynamic-page の場合、全ページをロードする必要がある
    await figma.loadAllPagesAsync();

    // 選択レイヤーのチェック
    if (figma.currentPage.selection.length === 0) {
      sendMessage({
        type: 'no-selection',
        message: 'レイヤーを選択してください。フレーム、グループ、またはセクションを選択できます。'
      });
      return;
    }

    // キットの取得
    const kits = await getStoredKits();
    const selectedKit = kits.find(k => k.name === kitName);

    if (!selectedKit) {
      throw new Error('選択されたデザインキットが見つかりません');
    }

    const changes: Change[] = [];

    // 選択された各ノードを処理
    for (const selectedNode of figma.currentPage.selection) {
      // ノードを複製
      const duplicatedNode = selectedNode.clone();

      // 複製したノードを元のノードの横に配置
      if ('x' in selectedNode && 'y' in selectedNode && 'width' in selectedNode) {
        duplicatedNode.x = selectedNode.x + selectedNode.width + 50;
        duplicatedNode.y = selectedNode.y;
      }

      // 複製したノードにスタイルを適用
      await applyKitToNode(duplicatedNode, selectedKit, changes);

      // 名前を変更
      duplicatedNode.name = `${selectedNode.name} (変換済み)`;
    }

    // 変更内容を最大10件に制限して送信
    sendMessage({
      type: 'apply-complete',
      changes: changes.slice(0, 50) // 最大50件
    });

    figma.notify(`✓ デザインキットを適用しました（${changes.length}箇所を変更）`);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '適用に失敗しました';
    sendMessage({
      type: 'apply-error',
      message: errorMessage
    });
    figma.notify(`エラー: ${errorMessage}`, { error: true });
  }
}

// ノードとその子孫にデザインキットを適用
async function applyKitToNode(node: SceneNode, kit: DesignKit, changes: Change[]) {
  // カラースタイルの適用
  if ('fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
    const newFills = await applyColorStyles(node, kit, changes);
    if (newFills) {
      node.fills = newFills;
    }
  }

  if ('strokes' in node && Array.isArray(node.strokes)) {
    const newStrokes = await applyStrokeStyles(node, kit, changes);
    if (newStrokes) {
      node.strokes = newStrokes;
    }
  }

  // テキストスタイルの適用
  if (node.type === 'TEXT') {
    await applyTextStyles(node, kit, changes);
  }

  // エフェクトの適用
  if ('effects' in node) {
    await applyEffectStyles(node, kit, changes);
  }

  // 角丸の適用
  if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
    applyCornerRadius(node as SceneNode & { cornerRadius: number }, kit, changes);
  }

  // 子ノードを再帰的に処理
  if ('children' in node) {
    for (const child of node.children) {
      await applyKitToNode(child, kit, changes);
    }
  }
}

// カラースタイルの適用
async function applyColorStyles(
  node: SceneNode & { fills: readonly Paint[] | typeof figma.mixed },
  kit: DesignKit,
  changes: Change[]
): Promise<Paint[] | null> {
  if (node.fills === figma.mixed || !Array.isArray(node.fills) || node.fills.length === 0) {
    return null;
  }

  const originalFills = Array.from(node.fills);
  const fills = Array.from(node.fills);
  let hasChanges = false;

  for (let i = 0; i < fills.length; i++) {
    const fill = fills[i];
    if (fill.type === 'SOLID') {
      // 最も近い色を見つける
      const closestColor = findClosestColor(fill.color, kit.colors);
      if (closestColor) {
        const oldColor = rgbToHex(fill.color);
        fills[i] = Object.assign({}, fill, {
          color: (closestColor.paints[0] as SolidPaint).color
        });
        const newColor = rgbToHex((closestColor.paints[0] as SolidPaint).color);

        if (oldColor !== newColor) {
          changes.push({
            type: 'color',
            nodeId: node.id,
            nodeName: node.name,
            property: 'fill',
            before: oldColor,
            after: newColor,
            description: `${closestColor.name} に変更`,
            undoData: { type: 'fills', fills: originalFills as Paint[] }
          });
          hasChanges = true;
        }
      }
    }
  }

  return hasChanges ? fills : null;
}

// ストロークスタイルの適用
async function applyStrokeStyles(
  node: SceneNode & { strokes: readonly Paint[] | typeof figma.mixed },
  kit: DesignKit,
  changes: Change[]
): Promise<Paint[] | null> {
  if (node.strokes === figma.mixed || !Array.isArray(node.strokes) || node.strokes.length === 0) {
    return null;
  }

  const originalStrokes = Array.from(node.strokes);
  const strokes = Array.from(node.strokes);
  let hasChanges = false;

  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i];
    if (stroke.type === 'SOLID') {
      const closestColor = findClosestColor(stroke.color, kit.colors);
      if (closestColor) {
        const oldColor = rgbToHex(stroke.color);
        strokes[i] = Object.assign({}, stroke, {
          color: (closestColor.paints[0] as SolidPaint).color
        });
        const newColor = rgbToHex((closestColor.paints[0] as SolidPaint).color);

        if (oldColor !== newColor) {
          changes.push({
            type: 'color',
            nodeId: node.id,
            nodeName: node.name,
            property: 'stroke',
            before: oldColor,
            after: newColor,
            description: `ストローク色を${closestColor.name}に変更`,
            undoData: { type: 'strokes', strokes: originalStrokes as Paint[] }
          });
          hasChanges = true;
        }
      }
    }
  }

  return hasChanges ? strokes : null;
}

// テキストスタイルの適用
async function applyTextStyles(node: TextNode, kit: DesignKit, changes: Change[]) {
  if (kit.textStyles.length === 0) return;

  // 現在のフォントサイズに最も近いテキストスタイルを見つける
  const currentFontSize = node.fontSize as number;
  const closestTextStyle = kit.textStyles.reduce((prev, curr) => {
    return Math.abs(curr.fontSize - currentFontSize) < Math.abs(prev.fontSize - currentFontSize)
      ? curr
      : prev;
  });

  try {
    // 元の値を保存
    const originalFontName = node.fontName !== figma.mixed ? node.fontName as FontName : { family: 'Roboto', style: 'Regular' };
    const originalFontSize = typeof node.fontSize === 'number' ? node.fontSize : 14;
    const originalLineHeight = node.lineHeight !== figma.mixed ? node.lineHeight : { value: 0, unit: 'AUTO' as const };
    const originalLetterSpacing = node.letterSpacing !== figma.mixed ? node.letterSpacing : { value: 0, unit: 'PIXELS' as const };

    // 現在のフォントをロード（混在している可能性があるため）
    if (node.fontName !== figma.mixed) {
      await figma.loadFontAsync(node.fontName as FontName);
    }

    // 新しいフォントをロード
    const newFontName: FontName = {
      family: closestTextStyle.fontFamily,
      style: closestTextStyle.fontStyle
    };

    await figma.loadFontAsync(newFontName);

    const oldFont = node.fontName !== figma.mixed
      ? `${(node.fontName as FontName).family} ${(node.fontName as FontName).style} ${originalFontSize}px`
      : `Mixed ${originalFontSize}px`;
    const newFont = `${closestTextStyle.fontFamily} ${closestTextStyle.fontStyle} ${closestTextStyle.fontSize}px`;

    if (oldFont !== newFont) {
      node.fontName = newFontName;
      node.fontSize = closestTextStyle.fontSize;
      node.lineHeight = closestTextStyle.lineHeight;
      node.letterSpacing = closestTextStyle.letterSpacing;

      changes.push({
        type: 'text',
        nodeId: node.id,
        nodeName: node.name,
        property: 'font',
        before: oldFont,
        after: newFont,
        description: `テキストスタイルを${closestTextStyle.name}に変更`,
        undoData: {
          type: 'text',
          fontName: originalFontName,
          fontSize: originalFontSize,
          lineHeight: originalLineHeight,
          letterSpacing: originalLetterSpacing
        }
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Failed to apply text style to "${node.name}":`, errorMessage);
    // フォントが見つからない場合は警告を表示するが処理は継続
    figma.notify(`⚠ フォント "${closestTextStyle.fontFamily} ${closestTextStyle.fontStyle}" が見つかりません`, { timeout: 2000 });
  }
}

// エフェクトスタイルの適用
async function applyEffectStyles(
  node: SceneNode & { effects: readonly Effect[] },
  kit: DesignKit,
  changes: Change[]
) {
  if (kit.effects.length === 0 || node.effects.length === 0) return;

  const originalEffects = Array.from(node.effects);
  const firstKitEffect = kit.effects[0];
  const oldEffect = node.effects.length > 0 ? node.effects[0].type : 'なし';
  const newEffect = firstKitEffect.effects.length > 0 ? firstKitEffect.effects[0].type : 'なし';

  if (oldEffect !== newEffect) {
    node.effects = firstKitEffect.effects as Effect[];

    changes.push({
      type: 'effect',
      nodeId: node.id,
      nodeName: node.name,
      property: 'effect',
      before: oldEffect,
      after: newEffect,
      description: `エフェクトを${firstKitEffect.name}に変更`,
      undoData: { type: 'effects', effects: originalEffects as Effect[] }
    });
  }
}

// 角丸の適用
function applyCornerRadius(
  node: SceneNode & { cornerRadius: number },
  kit: DesignKit,
  changes: Change[]
) {

  // デザインキットの典型的な角丸値を推定（4, 8, 16などの一般的な値）
  const commonRadii = [0, 4, 8, 12, 16, 20, 24];
  const oldRadius = node.cornerRadius;
  const newRadius = commonRadii.reduce((prev, curr) => {
    return Math.abs(curr - oldRadius) < Math.abs(prev - oldRadius) ? curr : prev;
  });

  if (oldRadius !== newRadius && newRadius !== oldRadius) {
    node.cornerRadius = newRadius;

    changes.push({
      type: 'corner',
      nodeId: node.id,
      nodeName: node.name,
      property: 'cornerRadius',
      before: `${oldRadius}px`,
      after: `${newRadius}px`,
      description: `角丸を${newRadius}pxに変更`,
      undoData: { type: 'cornerRadius', cornerRadius: oldRadius }
    });
  }
}

// ===========================
// ユーティリティ関数
// ===========================

// 最も近い色を見つける
function findClosestColor(targetColor: RGB, colors: ColorStyleData[]): ColorStyleData | null {
  if (colors.length === 0) return null;

  let closestColor = colors[0];
  let minDistance = Infinity;

  for (const colorStyle of colors) {
    const paint = colorStyle.paints[0];
    if (paint && paint.type === 'SOLID') {
      const distance = colorDistance(targetColor, paint.color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = colorStyle;
      }
    }
  }

  return closestColor;
}

// 色の距離を計算（ユークリッド距離）
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// RGBを16進数に変換
function rgbToHex(rgb: RGB): string {
  const toHex = (n: number): string => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  const r = toHex(rgb.r);
  const g = toHex(rgb.g);
  const b = toHex(rgb.b);
  return `#${r}${g}${b}`.toUpperCase();
}

// フォントウェイトを推定
function getFontWeight(style: string): number {
  const weightMap: { [key: string]: number } = {
    'Thin': 100,
    'Extra Light': 200,
    'Light': 300,
    'Regular': 400,
    'Medium': 500,
    'Semi Bold': 600,
    'Bold': 700,
    'Extra Bold': 800,
    'Black': 900
  };

  return weightMap[style] || 400;
}

// ノードにフォーカスする処理
async function handleFocusNode(nodeId: string) {
  try {
    // dynamic-page の場合、全ページをロードする必要がある
    await figma.loadAllPagesAsync();

    const node = figma.getNodeById(nodeId);

    if (!node) {
      figma.notify('対象のノードが見つかりません', { error: true });
      return;
    }

    // ノードを選択
    figma.currentPage.selection = [node as SceneNode];

    // ビューポートをノードに移動
    figma.viewport.scrollAndZoomIntoView([node as SceneNode]);

    figma.notify(`"${node.name}" を選択しました`);
  } catch (error) {
    console.error('Failed to focus node:', error);
    figma.notify('ノードの選択に失敗しました', { error: true });
  }
}

// 個別の変更を元に戻す
async function handleUndoChange(change: Change) {
  try {
    // dynamic-page の場合、全ページをロードする必要がある
    await figma.loadAllPagesAsync();

    const node = figma.getNodeById(change.nodeId);

    if (!node) {
      sendMessage({
        type: 'undo-error',
        message: 'ノードが見つかりません'
      });
      figma.notify('変更を戻せませんでした: ノードが見つかりません', { error: true });
      return;
    }

    if (!change.undoData) {
      sendMessage({
        type: 'undo-error',
        message: '元に戻すデータがありません'
      });
      figma.notify('変更を戻せませんでした: 元に戻すデータがありません', { error: true });
      return;
    }

    // undoDataの種類に応じて元に戻す
    switch (change.undoData.type) {
      case 'fills':
        if ('fills' in node) {
          (node as any).fills = change.undoData.fills;
        }
        break;
      case 'strokes':
        if ('strokes' in node) {
          (node as any).strokes = change.undoData.strokes;
        }
        break;
      case 'text':
        if (node.type === 'TEXT') {
          await figma.loadFontAsync(change.undoData.fontName);
          node.fontName = change.undoData.fontName;
          node.fontSize = change.undoData.fontSize;
          node.lineHeight = change.undoData.lineHeight;
          node.letterSpacing = change.undoData.letterSpacing;
        }
        break;
      case 'effects':
        if ('effects' in node) {
          (node as any).effects = change.undoData.effects;
        }
        break;
      case 'cornerRadius':
        if ('cornerRadius' in node) {
          (node as any).cornerRadius = change.undoData.cornerRadius;
        }
        break;
    }

    sendMessage({
      type: 'undo-complete',
      message: `${change.description}を元に戻しました`
    });
    figma.notify(`✓ ${change.description}を元に戻しました`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '元に戻せませんでした';
    sendMessage({
      type: 'undo-error',
      message: errorMessage
    });
    figma.notify(`エラー: ${errorMessage}`, { error: true });
  }
}

// 全ての変更を元に戻す
async function handleUndoAll(changes: Change[]) {
  try {
    // dynamic-page の場合、全ページをロードする必要がある
    await figma.loadAllPagesAsync();

    let successCount = 0;
    let errorCount = 0;

    // 変更を逆順で元に戻す（最後の変更から戻す）
    for (const change of [...changes].reverse()) {
      try {
        const node = figma.getNodeById(change.nodeId);

        if (!node || !change.undoData) {
          errorCount++;
          continue;
        }

        // undoDataの種類に応じて元に戻す
        switch (change.undoData.type) {
          case 'fills':
            if ('fills' in node) {
              (node as any).fills = change.undoData.fills;
              successCount++;
            }
            break;
          case 'strokes':
            if ('strokes' in node) {
              (node as any).strokes = change.undoData.strokes;
              successCount++;
            }
            break;
          case 'text':
            if (node.type === 'TEXT') {
              await figma.loadFontAsync(change.undoData.fontName);
              node.fontName = change.undoData.fontName;
              node.fontSize = change.undoData.fontSize;
              node.lineHeight = change.undoData.lineHeight;
              node.letterSpacing = change.undoData.letterSpacing;
              successCount++;
            }
            break;
          case 'effects':
            if ('effects' in node) {
              (node as any).effects = change.undoData.effects;
              successCount++;
            }
            break;
          case 'cornerRadius':
            if ('cornerRadius' in node) {
              (node as any).cornerRadius = change.undoData.cornerRadius;
              successCount++;
            }
            break;
        }
      } catch (error) {
        console.error('Failed to undo change:', error);
        errorCount++;
      }
    }

    sendMessage({
      type: 'undo-complete',
      message: `${successCount}件の変更を元に戻しました${errorCount > 0 ? ` (${errorCount}件は失敗)` : ''}`
    });
    figma.notify(`✓ ${successCount}件の変更を元に戻しました${errorCount > 0 ? ` (${errorCount}件は失敗)` : ''}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '元に戻せませんでした';
    sendMessage({
      type: 'undo-error',
      message: errorMessage
    });
    figma.notify(`エラー: ${errorMessage}`, { error: true });
  }
}
