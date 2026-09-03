<!-- English: [README.md](./README.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# ドキュメント

*[English](./README.md)*

Hora の仕組み — このパッケージが運ぶ手法です。ここの文書はすべて `x.md` と `x.ja.md` の対になっており、それぞれ冒頭にもう片方へのリンクを持ちます。

**プロジェクトを始めるところなら、クイックスタートの [`quick-start.ja.md`](./quick-start.ja.md) からどうぞ** — やりたいことを2つのディレクトリに入れれば、`/hora` がそれを材料に仕様書をあなたと書きます。

**手法を理解するなら [`architecture.ja.md`](./architecture.ja.md) から読んでください。** 「何を作るかを決める」と「作る」の2つの半分を示す文書で、他はその形に照らして読むものです。

| 文書 | 定めていること |
|---|---|
| [`quick-start.ja.md`](./quick-start.ja.md) | **クイックスタート — 仕様書を書き始めるまでの3手順。** 3つの受け渡しディレクトリ、そこにファイルを置くことが何を言ったことになるのか、`/hora` がそれをどう扱うのか |
| [`architecture.ja.md`](./architecture.ja.md) | **作業がどう実行されるか。** 4つの層と各層の配布元、1つの機能が通る18の関所、再入可能性、git モデル、仕様書が書かれる7つのステージ |
| [`commands.ja.md`](./commands.ja.md) | **各コマンドが何をするか。** 6つすべてについて、読むもの / 書くもの / 止まる条件 / 単独実行。加えて実際のセッションの見え方 |
| [`adopting.ja.md`](./adopting.ja.md) | **既存プロジェクトへのキット適用。** 2つの適用のどちらなのか、6つの手順、注意すべきこと |
| [`hotfix.ja.md`](./hotfix.ja.md) | **緊急経路。** `/hora-hotfix` が何を諦めるか、6つの門、負債が通常の作業として戻ってくる筋道 |
| [`writing-style.ja.md`](./writing-style.ja.md) | **skill がどう書かれるか。** `kit/` 配下のファイルが従う3つの規則と、決して圧縮しないもの |
| [`document-style.ja.md`](./document-style.ja.md) | **この文書群がどう書かれるか。** 太字は何を示すか、1文1主張、日本語版は翻訳ではないこと、構造の慣習 |

**ここにあるものは実行時に読まれません。** エージェントが読むのは `kit/` で、人が読むのはここです。だからこちら側では議論に費用がかからず、あちら側では毎回の実行に費用がかかります（[`writing-style.ja.md`](./writing-style.ja.md) の「では論拠はどこへ行くのか」）。

## ここに無いもの

| | |
|---|---|
| キットで作るプロジェクトが何を持つか、どう始めるか | [`hora-boilerplate`](https://github.com/openreachtech/hora-boilerplate) |
| このパッケージの導入方法と、同梱コマンドの働き | [`README.ja.md`](../README.ja.md) |
| 18の関所、仕様書の書式、ブランチとコミットの規則 | それを所有する skill の隣の `references/`（[`kit/skills/`](../kit/skills) 配下） |
