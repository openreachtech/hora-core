# Hora Kit

Hora のコア — AI エージェントツールが読み込むスキルとエージェント — を、構築を行うリポジトリへ運ぶコンテナです。

同梱物はすべて単一のディレクトリ `kit/` 配下にあり、エージェントツールが期待する配置をそのまま写しています。

```
kit/
├── agents/   サブエージェント定義
└── skills/   スキル定義
```

`kit/` は特定のツール名ではなく、中身が何であるかに基づいて命名しています。そのため同じペイロードを、リポジトリが使うどのエージェントツールへも配置できます。本書がドキュメント化している対象は Claude Code で、その設定ディレクトリは `.claude/` です。

npm が公開するのは `dist/` で、パックのたびに `kit/` から生成されます。両者の内容は同一なので、上の配置はそのままインストール後のパッケージの配置でもあります。

Hora 自体の仕組み — このキットが運ぶ手法 — はボイラープレート側に記述しています: [openreachtech/hora-boilerplate](https://github.com/openreachtech/hora-boilerplate)

## インストール

Node.js の現行 LTS が必要です（CI がビルド対象とするバージョン）。

```sh
npm install @openreachtech/hora
```

Hora のボイラープレートから作成したプロジェクトは、本パッケージを開発依存として宣言済みなので、そのプロジェクトで `npm install` を実行すればキットが入ります。プロジェクトへ直接追加する場合は次のとおりです。

```sh
npm install --save-dev @openreachtech/hora
```

本パッケージが同梱するのは AI エージェント向けの指示のみです。インポートする JavaScript はありません。

## 使い方

インストールすると、`dist/` はプロジェクトの `.claude/` — エージェントツールがスキルとエージェントを読み込むディレクトリ — へクローンされます。ボイラープレートのセットアップがこれを行います。それ以外の方法で構築したプロジェクトでは、次のようにコピーしてください。

```sh
mkdir -p .claude
cp -R node_modules/@openreachtech/hora/dist/. .claude/
```

`dist/agents/` は `.claude/agents/` へ、`dist/skills/` は `.claude/skills/` へ配置されます。スキル探索が見るのはこのパスだけで、パッケージ自身のディレクトリは対象外です。つまり、このクローンがキットを可視化する唯一の手段です。本パッケージを更新したら、その都度実行してください。

以降、スキルはスラッシュコマンドとして呼び出せます。

## コントリビューション

バグ報告・機能要望・コード貢献を歓迎します。

GitHub Issues からお気軽にご連絡ください。

```sh
git clone https://github.com/openreachtech/hora-core.git
cd hora-core
npm install
npm run lint
npm test
```

## ライセンス

本プロジェクトは Apache License 2.0 で公開されています。

詳細は [LICENSE ファイル](./LICENSE) を参照してください。

## 開発者

[Open Reach Tech Inc.](https://openreach.tech)

## 著作権

© 2026 Open Reach Tech Inc.
