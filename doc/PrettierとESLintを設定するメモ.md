# ReactプロジェクトにPrettierとESLintを設定するメモ

## 前提条件

- Node.js（バージョン14以上）がインストールされていること
- npmまたはyarnがインストールされていること
- VSCodeがインストールされていること
- Reactプロジェクトが作成済みであること

## 1. プロジェクトの作成（新規の場合）

新規プロジェクトの場合は、以下のコマンドでReactプロジェクトを作成します：

```bash
# Create React Appを使用する場合
npx create-react-app my-app --template typescript
cd my-app
```

## 2. ESLintのインストールと設定

### 2.1 ESLint関連パッケージのインストール

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

各パッケージの役割：
- `eslint`: JavaScriptのコード品質とコーディング規約をチェックするツール
- `@typescript-eslint/parser`: TypeScriptコードをESLintが解析できるようにするパーサー
- `@typescript-eslint/eslint-plugin`: TypeScript特有のリンティングルールを提供
- `eslint-plugin-react`: React特有のリンティングルールを提供
- `eslint-plugin-react-hooks`: Reactのフックに関するリンティングルールを提供

### 2.2 ESLint設定ファイルの作成

プロジェクトのルートディレクトリに`.eslintrc.js`ファイルを作成：

```javascript
module.exports = {
  env: {
    browser: true,    // ブラウザのグローバル変数を使用可能に
    es2021: true,     // ES2021の構文を有効化
    node: true,       // Node.jsのグローバル変数を使用可能に
  },
  extends: [
    'eslint:recommended',                    // ESLintの推奨ルール
    'plugin:react/recommended',              // React推奨のルール
    'plugin:react-hooks/recommended',        // React Hooks推奨のルール
    'plugin:@typescript-eslint/recommended', // TypeScript推奨のルール
  ],
  parser: '@typescript-eslint/parser',       // TypeScriptパーサーを使用
  parserOptions: {
    ecmaFeatures: {
      jsx: true,      // JSXを有効化
    },
    ecmaVersion: 'latest',  // 最新のECMAScript機能を有効化
    sourceType: 'module',   // ECMAScriptモジュールを使用
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    // カスタムルール
    'react/react-in-jsx-scope': 'off',     // React17以降は不要
    'react/prop-types': 'off',             // TypeScriptを使用する場合は不要
    '@typescript-eslint/explicit-module-boundary-types': 'off',  // 関数の戻り値の型を明示的に指定する必要なし
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // 未使用変数をエラーに
  },
  settings: {
    react: {
      version: 'detect', // Reactのバージョンを自動検出
    },
  },
};
```

## 3. Prettierのインストールと設定

### 3.1 Prettier関連パッケージのインストール

```bash
npm install --save-dev prettier eslint-config-prettier
```

各パッケージの役割：
- `prettier`: コードフォーマッター
- `eslint-config-prettier`: ESLintとPrettierの設定の競合を防ぐ

### 3.2 Prettier設定ファイルの作成

プロジェクトのルートディレクトリに`.prettierrc`ファイルを作成：

```json
{
  "semi": true,           // 文末にセミコロンを追加
  "singleQuote": true,    // シングルクォートを使用
  "tabWidth": 2,          // インデントのスペース数
  "trailingComma": "es5", // 末尾のカンマをES5互換にする
  "printWidth": 100,      // 1行の最大文字数
  "bracketSpacing": true, // オブジェクトリテラルの括弧間にスペースを入れる
  "arrowParens": "avoid", // 可能な場合、アロー関数の括弧を省略
  "endOfLine": "auto"     // 改行コードを自動検出
}
```

## 4. ESLintとPrettierの連携

### 4.1 .eslintrc.jsの設定を更新

`.eslintrc.js`ファイルの`extends`配列の最後に`'prettier'`を追加：

```javascript
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
  'plugin:react-hooks/recommended',
  'plugin:@typescript-eslint/recommended',
  'prettier', // Prettierとの競合を避けるため、必ず最後に配置
],
```

## 5. VSCodeの設定

### 5.1 必要な拡張機能のインストール

- ESLint拡張機能: ESLintの警告やエラーをエディタ上で表示
- Prettier拡張機能: コードフォーマットをエディタ上で実行

### 5.2 VSCode設定の更新

`.vscode/settings.json`ファイルを作成（もしくは更新）：

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",  // デフォルトのフォーマッターをPrettierに設定
  "editor.formatOnSave": true,                         // 保存時に自動フォーマット
  "editor.formatOnPaste": true,                        // ペースト時に自動フォーマット
  "editor.formatOnType": true,                         // 入力時に自動フォーマット
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,                      // 保存時にESLintの自動修正を実行
    "source.organizeImports": true                     // importの自動整理
  },
  "files.autoSave": "onFocusChange",                   // フォーカスが外れたときに自動保存
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 6. package.jsonにスクリプトを追加

`package.json`の`scripts`セクションに以下を追加：

```json
{
  "scripts": {
    // 既存のスクリプト
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",           // リントチェックを実行
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix", // リント自動修正を実行
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\"" // Prettierでフォーマット
  }
}
```

## 7. 動作確認

### 7.1 リントチェックの実行

```bash
npm run lint  # コードの問題点をチェック
```

### 7.2 自動修正の実行

```bash
npm run lint:fix  # ESLintで自動修正可能な問題を修正
```

### 7.3 コードフォーマットの実行

```bash
npm run format  # Prettierでコードをフォーマット
```

### 7.4 自動フォーマットの確認

1. VSCodeでソースコードファイルを開く
2. コードを編集
3. ファイルを保存（Ctrl+S or Command+S）
4. 自動的にフォーマットが適用されることを確認

## 8. .gitignoreの更新

プロジェクトのルートディレクトリの`.gitignore`ファイルに以下を追加：

```
# ESLint
.eslintcache

# VS Code
.vscode/*
!.vscode/settings.json
```

## よくある問題とその解決方法

1. ESLintとPrettierの設定が競合する
   - 原因: eslint-config-prettierが正しく設定されていない
   - 解決策: `.eslintrc.js`の`extends`配列で`'prettier'`が最後に配置されているか確認

2. フォーマットが適用されない
   - 原因: VSCodeの設定が正しくないか、拡張機能がインストールされていない
   - 解決策:
     1. VSCodeでPrettier拡張機能がインストールされているか確認
     2. ファイルタイプごとのデフォルトフォーマッターがPrettierに設定されているか確認
     3. `editor.formatOnSave`が`true`に設定されているか確認

3. 保存時に自動フォーマットされない
   - 原因: VSCodeの設定が不完全
   - 解決策:
     1. `settings.json`の`editor.formatOnSave`が`true`に設定されているか確認
     2. `editor.defaultFormatter`が正しく設定されているか確認
     3. ファイルタイプごとの設定が正しいか確認

4. ESLintのエラーが表示されない
   - 原因: ESLint拡張機能の設定問題
   - 解決策:
     1. VSCodeのESLint拡張機能が有効になっているか確認
     2. `editor.codeActionsOnSave`の設定を確認
     3. プロジェクトのESLint設定ファイルが正しいか確認

## 参考リンク

- [ESLint公式ドキュメント](https://eslint.org/)
- [Prettier公式ドキュメント](https://prettier.io/)
- [Create React App ESLintの設定](https://create-react-app.dev/docs/setting-up-your-editor)
- [TypeScript ESLint](https://typescript-eslint.io/)
- [VSCode Prettier拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [VSCode ESLint拡張機能](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

