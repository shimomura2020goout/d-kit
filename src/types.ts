// デザインキットのデータ構造
export interface DesignKit {
  name: string;
  sourceFile: string;
  exportedAt: string;
  colors: ColorStyle[];
  textStyles: TextStyleData[];
  effects: EffectStyle[];
  components: ComponentData[];
}

// カラースタイル
export interface ColorStyle {
  name: string;
  id: string;
  paints: readonly Paint[];
  description: string;
}

// テキストスタイル
export interface TextStyleData {
  name: string;
  id: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  lineHeight: LineHeight;
  letterSpacing: LetterSpacing;
  textCase: TextCase;
  textDecoration: TextDecoration;
  description: string;
}

// エフェクトスタイル
export interface EffectStyle {
  name: string;
  id: string;
  effects: readonly Effect[];
  description: string;
}

// コンポーネント情報
export interface ComponentData {
  name: string;
  id: string;
  description: string;
  type: string;
}

// 変更記録
export interface Change {
  type: 'color' | 'text' | 'effect' | 'corner' | 'component';
  nodeName: string;
  property: string;
  before: string;
  after: string;
  description: string;
}

// UI - プラグイン間のメッセージ型
export type MessageToPlugin =
  | { type: 'export-kit' }
  | { type: 'load-kits' }
  | { type: 'apply-kit'; kitName: string }
  | { type: 'cancel' };

export type MessageToUI =
  | { type: 'export-complete'; kitName: string }
  | { type: 'export-error'; message: string }
  | { type: 'kits-loaded'; kits: DesignKit[] }
  | { type: 'kit-capabilities'; capabilities: KitCapabilities }
  | { type: 'select-layers'; message: string }
  | { type: 'apply-complete'; changes: Change[] }
  | { type: 'apply-error'; message: string }
  | { type: 'no-selection'; message: string };

// デザインキットの適用可能な機能
export interface KitCapabilities {
  colors: number;
  textStyles: number;
  effects: number;
  components: number;
  colorNames: string[];
  textStyleNames: string[];
  effectNames: string[];
  componentNames: string[];
}
