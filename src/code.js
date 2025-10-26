"use strict";
// ===========================
// 型定義
// ===========================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ===========================
// プラグインのメインエントリーポイント
// ===========================
figma.showUI(__html__, { width: 400, height: 600 });
// UIにメッセージを送信するヘルパー
function sendMessage(message) {
    figma.ui.postMessage(message);
}
// ===========================
// ステップ1: デザインキットのエクスポート
// ===========================
function handleExportKit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 進捗通知: 開始
            sendMessage({ type: 'export-progress', progress: 0, message: 'エクスポートを開始しています...' });
            // dynamic-page の場合、全ページをロードする必要がある
            yield figma.loadAllPagesAsync();
            sendMessage({ type: 'export-progress', progress: 10, message: 'ページを読み込みました' });
            const fileName = figma.root.name;
            // ローカルスタイルを取得（非同期版を使用）
            sendMessage({ type: 'export-progress', progress: 20, message: 'カラースタイルを取得中...' });
            const localPaintStyles = yield figma.getLocalPaintStylesAsync();
            sendMessage({ type: 'export-progress', progress: 35, message: 'テキストスタイルを取得中...' });
            const localTextStyles = yield figma.getLocalTextStylesAsync();
            sendMessage({ type: 'export-progress', progress: 50, message: 'エフェクトスタイルを取得中...' });
            const localEffectStyles = yield figma.getLocalEffectStylesAsync();
            sendMessage({ type: 'export-progress', progress: 60, message: 'コンポーネントを検索中...' });
            const components = figma.root.findAll(node => node.type === 'COMPONENT');
            // カラースタイルの変換
            sendMessage({ type: 'export-progress', progress: 65, message: `${localPaintStyles.length}個のカラースタイルを処理中...` });
            const colors = localPaintStyles.map(style => ({
                name: style.name,
                id: style.id,
                paints: style.paints,
                description: style.description
            }));
            // テキストスタイルの変換
            sendMessage({ type: 'export-progress', progress: 70, message: `${localTextStyles.length}個のテキストスタイルを処理中...` });
            const textStyles = localTextStyles.map(style => ({
                name: style.name,
                id: style.id,
                fontSize: style.fontSize,
                fontFamily: style.fontName ? style.fontName.family : 'Unknown',
                fontStyle: style.fontName ? style.fontName.style : 'Regular',
                fontWeight: style.fontName ? getFontWeight(style.fontName.style) : 400,
                lineHeight: style.lineHeight,
                letterSpacing: style.letterSpacing,
                textCase: style.textCase,
                textDecoration: style.textDecoration,
                description: style.description
            }));
            // エフェクトスタイルの変換
            sendMessage({ type: 'export-progress', progress: 75, message: `${localEffectStyles.length}個のエフェクトスタイルを処理中...` });
            const effects = localEffectStyles.map(style => ({
                name: style.name,
                id: style.id,
                effects: style.effects,
                description: style.description
            }));
            // コンポーネント情報の取得（詳細版）
            sendMessage({ type: 'export-progress', progress: 80, message: `${Math.min(components.length, 100)}個のコンポーネントを処理中...` });
            const componentData = components.slice(0, 100).map(comp => ({
                name: comp.name,
                id: comp.id,
                description: comp.description,
                type: comp.type,
                key: comp.key,
                width: comp.width,
                height: comp.height,
                variantProperties: comp.variantProperties || undefined
            }));
            sendMessage({ type: 'export-progress', progress: 85, message: 'デザインキットをまとめています...' });
            const designKit = {
                name: fileName,
                sourceFile: fileName,
                exportedAt: new Date().toLocaleString('ja-JP'),
                colors,
                textStyles,
                effects,
                components: componentData
            };
            // figma.clientStorageに保存
            sendMessage({ type: 'export-progress', progress: 90, message: 'ストレージに保存中...' });
            const existingKits = yield getStoredKits();
            const kitIndex = existingKits.findIndex(k => k.name === fileName);
            if (kitIndex >= 0) {
                existingKits[kitIndex] = designKit; // 上書き
            }
            else {
                existingKits.push(designKit);
            }
            yield figma.clientStorage.setAsync('designKits', existingKits);
            sendMessage({ type: 'export-progress', progress: 100, message: 'エクスポート完了！' });
            sendMessage({
                type: 'export-complete',
                kitName: fileName
            });
            figma.notify(`✓ デザインキット「${fileName}」を保存しました`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'エクスポートに失敗しました';
            sendMessage({
                type: 'export-error',
                message: errorMessage
            });
            figma.notify(`エラー: ${errorMessage}`, { error: true });
        }
    });
}
// ===========================
// 保存されたキットの読み込み
// ===========================
function handleLoadKits() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const kits = yield getStoredKits();
            sendMessage({
                type: 'kits-loaded',
                kits
            });
            // 最初のキットが選択された場合、その機能情報も送信
            if (kits.length > 0) {
                // UIで選択されたキットの機能を表示するために、選択イベントを待つ
            }
        }
        catch (error) {
            console.error('Failed to load kits:', error);
        }
    });
}
// 保存されたキットを取得
function getStoredKits() {
    return __awaiter(this, void 0, void 0, function* () {
        const kits = yield figma.clientStorage.getAsync('designKits');
        return kits || [];
    });
}
// UIからのメッセージを受信
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        switch (msg.type) {
            case 'export-kit':
                yield handleExportKit();
                break;
            case 'load-kits':
                yield handleLoadKits();
                break;
            case 'kit-selected':
                yield handleKitSelected(msg.kitName);
                break;
            case 'apply-kit':
                yield handleApplyKit(msg.kitName);
                break;
            case 'focus-node':
                yield handleFocusNode(msg.nodeId);
                break;
            case 'undo-change':
                yield handleUndoChange(msg.change);
                break;
            case 'undo-all':
                yield handleUndoAll(msg.changes);
                break;
            case 'cancel':
                figma.closePlugin();
                break;
        }
    }
    catch (error) {
        console.error('Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        sendMessage({
            type: 'apply-error',
            message: errorMessage
        });
    }
});
// キット選択時の処理
function handleKitSelected(kitName) {
    return __awaiter(this, void 0, void 0, function* () {
        const kits = yield getStoredKits();
        const selectedKit = kits.find(k => k.name === kitName);
        if (!selectedKit) {
            return;
        }
        // キットの機能情報を作成
        const capabilities = {
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
    });
}
// ===========================
// ステップ2: デザインキットの適用
// ===========================
function handleApplyKit(kitName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // dynamic-page の場合、全ページをロードする必要がある
            yield figma.loadAllPagesAsync();
            // 選択レイヤーのチェック
            if (figma.currentPage.selection.length === 0) {
                sendMessage({
                    type: 'no-selection',
                    message: 'レイヤーを選択してください。フレーム、グループ、またはセクションを選択できます。'
                });
                return;
            }
            // キットの取得
            const kits = yield getStoredKits();
            const selectedKit = kits.find(k => k.name === kitName);
            if (!selectedKit) {
                throw new Error('選択されたデザインキットが見つかりません');
            }
            const changes = [];
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
                yield applyKitToNode(duplicatedNode, selectedKit, changes);
                // 名前を変更
                duplicatedNode.name = `${selectedNode.name} (変換済み)`;
            }
            // 変更内容を最大10件に制限して送信
            sendMessage({
                type: 'apply-complete',
                changes: changes.slice(0, 50) // 最大50件
            });
            figma.notify(`✓ デザインキットを適用しました（${changes.length}箇所を変更）`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '適用に失敗しました';
            sendMessage({
                type: 'apply-error',
                message: errorMessage
            });
            figma.notify(`エラー: ${errorMessage}`, { error: true });
        }
    });
}
// ノードとその子孫にデザインキットを適用
function applyKitToNode(node, kit, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        // コンポーネントインスタンスの置き換え
        if (node.type === 'INSTANCE') {
            const replaced = yield replaceComponentInstance(node, kit, changes);
            if (replaced) {
                // 置き換えが成功した場合、子要素の処理はスキップ
                return;
            }
        }
        // カラースタイルの適用
        if ('fills' in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
            const newFills = yield applyColorStyles(node, kit, changes);
            if (newFills) {
                node.fills = newFills;
            }
        }
        if ('strokes' in node && Array.isArray(node.strokes)) {
            const newStrokes = yield applyStrokeStyles(node, kit, changes);
            if (newStrokes) {
                node.strokes = newStrokes;
            }
        }
        // テキストスタイルの適用
        if (node.type === 'TEXT') {
            yield applyTextStyles(node, kit, changes);
        }
        // エフェクトの適用
        if ('effects' in node) {
            yield applyEffectStyles(node, kit, changes);
        }
        // 角丸の適用
        if ('cornerRadius' in node && typeof node.cornerRadius === 'number') {
            applyCornerRadius(node, kit, changes);
        }
        // 子ノードを再帰的に処理
        if ('children' in node) {
            for (const child of node.children) {
                yield applyKitToNode(child, kit, changes);
            }
        }
    });
}
// カラースタイルの適用
function applyColorStyles(node, kit, changes) {
    return __awaiter(this, void 0, void 0, function* () {
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
                        color: closestColor.paints[0].color
                    });
                    const newColor = rgbToHex(closestColor.paints[0].color);
                    if (oldColor !== newColor) {
                        changes.push({
                            type: 'color',
                            nodeId: node.id,
                            nodeName: node.name,
                            property: 'fill',
                            before: oldColor,
                            after: newColor,
                            description: `${closestColor.name} に変更`,
                            undoData: { type: 'fills', fills: originalFills }
                        });
                        hasChanges = true;
                    }
                }
            }
        }
        return hasChanges ? fills : null;
    });
}
// ストロークスタイルの適用
function applyStrokeStyles(node, kit, changes) {
    return __awaiter(this, void 0, void 0, function* () {
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
                        color: closestColor.paints[0].color
                    });
                    const newColor = rgbToHex(closestColor.paints[0].color);
                    if (oldColor !== newColor) {
                        changes.push({
                            type: 'color',
                            nodeId: node.id,
                            nodeName: node.name,
                            property: 'stroke',
                            before: oldColor,
                            after: newColor,
                            description: `ストローク色を${closestColor.name}に変更`,
                            undoData: { type: 'strokes', strokes: originalStrokes }
                        });
                        hasChanges = true;
                    }
                }
            }
        }
        return hasChanges ? strokes : null;
    });
}
// テキストスタイルの適用
function applyTextStyles(node, kit, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (kit.textStyles.length === 0)
            return;
        // 現在のフォントサイズに最も近いテキストスタイルを見つける
        const currentFontSize = node.fontSize;
        const closestTextStyle = kit.textStyles.reduce((prev, curr) => {
            return Math.abs(curr.fontSize - currentFontSize) < Math.abs(prev.fontSize - currentFontSize)
                ? curr
                : prev;
        });
        try {
            // 元の値を保存
            const originalFontName = node.fontName !== figma.mixed ? node.fontName : { family: 'Roboto', style: 'Regular' };
            const originalFontSize = typeof node.fontSize === 'number' ? node.fontSize : 14;
            const originalLineHeight = node.lineHeight !== figma.mixed ? node.lineHeight : { value: 0, unit: 'AUTO' };
            const originalLetterSpacing = node.letterSpacing !== figma.mixed ? node.letterSpacing : { value: 0, unit: 'PIXELS' };
            // 現在のフォントをロード（混在している可能性があるため）
            if (node.fontName !== figma.mixed) {
                yield figma.loadFontAsync(node.fontName);
            }
            // 新しいフォントをロード
            const newFontName = {
                family: closestTextStyle.fontFamily,
                style: closestTextStyle.fontStyle
            };
            yield figma.loadFontAsync(newFontName);
            const oldFont = node.fontName !== figma.mixed
                ? `${node.fontName.family} ${node.fontName.style} ${originalFontSize}px`
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Failed to apply text style to "${node.name}":`, errorMessage);
            // フォントが見つからない場合は警告を表示するが処理は継続
            figma.notify(`⚠ フォント "${closestTextStyle.fontFamily} ${closestTextStyle.fontStyle}" が見つかりません`, { timeout: 2000 });
        }
    });
}
// エフェクトスタイルの適用
function applyEffectStyles(node, kit, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        if (kit.effects.length === 0 || node.effects.length === 0)
            return;
        const originalEffects = Array.from(node.effects);
        const firstKitEffect = kit.effects[0];
        const oldEffect = node.effects.length > 0 ? node.effects[0].type : 'なし';
        const newEffect = firstKitEffect.effects.length > 0 ? firstKitEffect.effects[0].type : 'なし';
        if (oldEffect !== newEffect) {
            node.effects = firstKitEffect.effects;
            changes.push({
                type: 'effect',
                nodeId: node.id,
                nodeName: node.name,
                property: 'effect',
                before: oldEffect,
                after: newEffect,
                description: `エフェクトを${firstKitEffect.name}に変更`,
                undoData: { type: 'effects', effects: originalEffects }
            });
        }
    });
}
// 角丸の適用
function applyCornerRadius(node, kit, changes) {
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
function findClosestColor(targetColor, colors) {
    if (colors.length === 0)
        return null;
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
function colorDistance(c1, c2) {
    return Math.sqrt(Math.pow(c1.r - c2.r, 2) +
        Math.pow(c1.g - c2.g, 2) +
        Math.pow(c1.b - c2.b, 2));
}
// コンポーネントインスタンスの置き換え
function replaceComponentInstance(instance, kit, changes) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // インスタンスの元のコンポーネント名を取得
            const mainComponent = instance.mainComponent;
            if (!mainComponent) {
                return false;
            }
            const componentName = mainComponent.name;
            // デザインキット内で同じ名前のコンポーネントを探す
            const matchingComponent = kit.components.find(comp => comp.name === componentName);
            if (!matchingComponent) {
                // マッチするコンポーネントがない場合はスキップ
                return false;
            }
            // コンポーネントをインポート（keyを使用）
            const importedComponent = yield figma.importComponentByKeyAsync(matchingComponent.key);
            if (!importedComponent) {
                return false;
            }
            // 新しいインスタンスを作成
            const newInstance = importedComponent.createInstance();
            // 元のインスタンスの位置・サイズ・プロパティをコピー
            newInstance.x = instance.x;
            newInstance.y = instance.y;
            newInstance.resize(instance.width, instance.height);
            // バリアントプロパティをコピー（可能な場合）
            if (instance.variantProperties && newInstance.variantProperties) {
                try {
                    newInstance.setProperties(instance.variantProperties);
                }
                catch (e) {
                    // バリアントが一致しない場合はスキップ
                }
            }
            // 親ノードから元のインスタンスを削除し、新しいインスタンスを追加
            const parent = instance.parent;
            if (parent && 'appendChild' in parent) {
                const index = parent.children.indexOf(instance);
                parent.insertChild(index, newInstance);
                instance.remove();
                // 変更を記録
                changes.push({
                    type: 'component',
                    nodeId: newInstance.id,
                    nodeName: newInstance.name,
                    property: 'Component',
                    before: `${componentName} (元のファイル)`,
                    after: `${componentName} (デザインキット: ${kit.name})`,
                    description: `コンポーネント「${componentName}」を置き換えました`
                });
                return true;
            }
            return false;
        }
        catch (error) {
            console.error('Component replacement failed:', error);
            return false;
        }
    });
}
// RGBを16進数に変換
function rgbToHex(rgb) {
    const toHex = (n) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    const r = toHex(rgb.r);
    const g = toHex(rgb.g);
    const b = toHex(rgb.b);
    return `#${r}${g}${b}`.toUpperCase();
}
// フォントウェイトを推定
function getFontWeight(style) {
    const weightMap = {
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
function handleFocusNode(nodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // dynamic-page の場合、全ページをロードする必要がある
            yield figma.loadAllPagesAsync();
            const node = yield figma.getNodeByIdAsync(nodeId);
            if (!node) {
                figma.notify('対象のノードが見つかりません', { error: true });
                return;
            }
            // ノードを選択
            figma.currentPage.selection = [node];
            // ビューポートをノードに移動
            figma.viewport.scrollAndZoomIntoView([node]);
            figma.notify(`"${node.name}" を選択しました`);
        }
        catch (error) {
            console.error('Failed to focus node:', error);
            figma.notify('ノードの選択に失敗しました', { error: true });
        }
    });
}
// 個別の変更を元に戻す
function handleUndoChange(change) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // dynamic-page の場合、全ページをロードする必要がある
            yield figma.loadAllPagesAsync();
            const node = yield figma.getNodeByIdAsync(change.nodeId);
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
                        node.fills = change.undoData.fills;
                    }
                    break;
                case 'strokes':
                    if ('strokes' in node) {
                        node.strokes = change.undoData.strokes;
                    }
                    break;
                case 'text':
                    if (node.type === 'TEXT') {
                        yield figma.loadFontAsync(change.undoData.fontName);
                        node.fontName = change.undoData.fontName;
                        node.fontSize = change.undoData.fontSize;
                        node.lineHeight = change.undoData.lineHeight;
                        node.letterSpacing = change.undoData.letterSpacing;
                    }
                    break;
                case 'effects':
                    if ('effects' in node) {
                        node.effects = change.undoData.effects;
                    }
                    break;
                case 'cornerRadius':
                    if ('cornerRadius' in node) {
                        node.cornerRadius = change.undoData.cornerRadius;
                    }
                    break;
            }
            sendMessage({
                type: 'undo-complete',
                message: `${change.description}を元に戻しました`
            });
            figma.notify(`✓ ${change.description}を元に戻しました`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '元に戻せませんでした';
            sendMessage({
                type: 'undo-error',
                message: errorMessage
            });
            figma.notify(`エラー: ${errorMessage}`, { error: true });
        }
    });
}
// 全ての変更を元に戻す
function handleUndoAll(changes) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // dynamic-page の場合、全ページをロードする必要がある
            yield figma.loadAllPagesAsync();
            let successCount = 0;
            let errorCount = 0;
            // 変更を逆順で元に戻す（最後の変更から戻す）
            for (const change of [...changes].reverse()) {
                try {
                    const node = yield figma.getNodeByIdAsync(change.nodeId);
                    if (!node || !change.undoData) {
                        errorCount++;
                        continue;
                    }
                    // undoDataの種類に応じて元に戻す
                    switch (change.undoData.type) {
                        case 'fills':
                            if ('fills' in node) {
                                node.fills = change.undoData.fills;
                                successCount++;
                            }
                            break;
                        case 'strokes':
                            if ('strokes' in node) {
                                node.strokes = change.undoData.strokes;
                                successCount++;
                            }
                            break;
                        case 'text':
                            if (node.type === 'TEXT') {
                                yield figma.loadFontAsync(change.undoData.fontName);
                                node.fontName = change.undoData.fontName;
                                node.fontSize = change.undoData.fontSize;
                                node.lineHeight = change.undoData.lineHeight;
                                node.letterSpacing = change.undoData.letterSpacing;
                                successCount++;
                            }
                            break;
                        case 'effects':
                            if ('effects' in node) {
                                node.effects = change.undoData.effects;
                                successCount++;
                            }
                            break;
                        case 'cornerRadius':
                            if ('cornerRadius' in node) {
                                node.cornerRadius = change.undoData.cornerRadius;
                                successCount++;
                            }
                            break;
                    }
                }
                catch (error) {
                    console.error('Failed to undo change:', error);
                    errorCount++;
                }
            }
            sendMessage({
                type: 'undo-complete',
                message: `${successCount}件の変更を元に戻しました${errorCount > 0 ? ` (${errorCount}件は失敗)` : ''}`
            });
            figma.notify(`✓ ${successCount}件の変更を元に戻しました${errorCount > 0 ? ` (${errorCount}件は失敗)` : ''}`);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : '元に戻せませんでした';
            sendMessage({
                type: 'undo-error',
                message: errorMessage
            });
            figma.notify(`エラー: ${errorMessage}`, { error: true });
        }
    });
}
