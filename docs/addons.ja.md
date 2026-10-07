<!-- English: [addons.md](./addons.md) — 片方を直したら、同じコミットでもう片方も直してください -->

# add-on

*[English](./addons.md)*

skill は、尋ねられる人がそこにいる前提で書かれています。誰も答えていない質問があれば止まり、ユースケースは人と一緒に確かめ、関所を飛ばすのは人が頼んだときだけです。それが正しい既定です。ただ、その既定が合わない実行もあります。

**add-on は、Hora Kit の横に入れるパッケージで、skill がそれだけではできなかったことをできるようにします。** skill を書き換えることはしません。add-on が効いている間、skill のどの判断を別の向きにするかを、自分のファイルに宣言します。add-on のないプロジェクトは、skill に書かれたとおりに動きます。

`/hora-addon` は、add-on について、すべての hora の skill が従う決まりです。この頁は、それを人に向けて説明したものです。

---

## add-on が持つもの

skill と wing のどちらか、または両方です。

| 部分 | 何か | 入る場所 |
|---|---|---|
| skill | それ自体が1つの skill。ほかの skill と同じように呼ぶ | `.claude/skills/<skill-name>/` |
| wing | 既存の skill ができることを増やすファイル。skill 自体は書かれたまま残る | `.hora/wings/<skill-name>/<addon-name>/` |
| 定義 | add-on の名前と、いつ効くか、必要な Hora Kit | `.hora/addons/<addon-name>.json` |

**wing という名前には、2つの意味を込めています。** 1つは翼です。飛べなかったものを飛べるようにする。skill は、それまでできなかったことができるようになります。もう1つは、建物の別棟です。本館につながっていて、本館は元のまま建っている。skill は置き換えられず、wing は skill と一緒に読まれます。

wing は skill の上に重ねるもので、写しを作るものではありません。wing のファイルは、広げる相手のファイルと同じ相対パスに、その skill の名前の下で置きます。中に書くのは、変える節だけです。

```
.claude/skills/hora-plan/SKILL.md                          書かれたままの skill
.claude/skills/hora/references/asking.md

.hora/wings/hora-plan/alpha-example-addon/SKILL.md         hora-plan/SKILL.md を広げる
.hora/wings/hora/alpha-example-addon/references/asking.md
                                                           hora/references/asking.md を広げる
```

wing は、それを読む skill ではなく、広げる相手のファイルから探します。そのファイルが属する skill の名前で、`.hora/wings/<その skill>/*/` の下の同じ相対パスを見ます。`asking.md` は `/hora` のファイルで、人と話す skill がすべて読みます。そのどれが読んでも、同じ wing に行き着きます。

wing と定義は `.claude/` ではなく `.hora/` の下に置きます。`.claude/` は Claude Code が読むものの置き場で、どちらも読むのは hora の skill だけなので、Hora 自身のディレクトリに置きます。

**Hora Kit 自身の installer は、`.hora/wings/` にも `.hora/addons/` にも触れません。** Hora Kit を入れ直しても、add-on はすべて残ります。そこに書くのは、それぞれの add-on の installer だけです。どちらのディレクトリもコミットしません。`.hora/` の下の記録とは違い、install のたびに作り直されるからです。

---

## add-on がいつ効くか

**入っていることと、効いていることは別です。** どちらの種類の add-on かは、定義が決めます。

| `activeWhen` | 効くとき |
|---|---|
| `"declared"` | 記録が、効かせると宣言している間 |
| `"always"` | 入っている限り、いつも |

**この項目は、省略しません。** 省略を「いつも」と読むことにすると、項目を書き忘れただけの定義が、いちばん強い効き方をします。しかも、読む側からは、書き忘れと意図を見分けられません。add-on の installer は、この項目のない定義も、この2つ以外の値を持つ定義も、何かを置く前に拒みます。それでも `.hora/addons/` に届いた定義は誤りで、その add-on は効きません。

宣言で効く add-on は、自分の名前の記録に宣言を書きます。記録の名前は `_<addon-name>.md` で、`<addon-name>: on` の行を持ちます。

```
.hora/tasks/1.0.0/_alpha-example-addon.md    この版の宣言
```

宣言は 1 つの版のものです。なので、ある版では効かせて、次の版では止める、ということができます。すべての版に効く記録はありません。すべての版で効かせる add-on は、定義の `always` でそう言います。ある版の実行の中で起きたことも、その版の記録に書きます。

**どの hora の skill も、どの版の作業かが決まった時点で、効いている add-on を割り出します。** 何から呼ばれたかは問いません。`/hora` が `/hora-plan` に渡したときも、`/hora-plan` は自分でもう一度割り出します。再開したあと、文脈が圧縮されたあとにも、どの skill もやり直します。判断するのは記録で、会話ではありません。どう始まったかという会話の記憶は、再開にも圧縮にも残らないからです。

add-on が1つ以上入っていれば、skill は何かを始める前に、効いている add-on を1行で報告します。

```
add-ons active for 1.0.0: alpha-example-addon
```

効いているものがなければ、`none` と報告します。入っているのに効いていない add-on こそ、見つけるべき取り違えだからです。add-on が1つも入っていないプロジェクトには、この行は出ません。

---

## add-on が変えてよい節

**skill は、add-on が変えてよい節にだけ、見出しに `[wing]` の印を付けます。** 印のない節は、どの add-on も変えられません。

印の付いた節は、skill が本文から取り出した判断です。本文は、以前は「`blocking: yes` が1件でも未解決なら止まる」と書いていました。今は「節が先へ進んでよいと言わない限り、止まる」と書き、条件は節の中にあります。add-on は、その条件を使う文には触れずに、条件だけを変えます。名前で呼ばれるメソッドを、呼ぶ側はそのままで定義し直せるのと同じ形です。

節の形は2つで、見出しで見分けます。

| 見出し | 答え | 書く向き |
|---|---|---|
| `Whether …` | はい、または、いいえ | **「はい」が、実行をより先へ進める**向きに書く。進む、飛ばす、待たずに決める |
| `How to …` | 何をするか | — |

この向きの決まりが、残りを単純にします。実行を通す add-on はいつも判断を広げ、止める add-on はいつも狭める、と揃うからです。

### 今の Hora Kit が印を付けている節

| skill | 節 | skill だけのときの振る舞い |
|---|---|---|
| `/hora`（`asking.md`） | `[wing] Whether a decision may be taken without asking` | いいえ。人に尋ねることは、人に尋ねる |
| `/hora`（`asking.md`） | `[wing] How to decide without asking` | 上の節がいいえなので、ここには来ない |
| `/hora`（`spec-format.md`） | `[wing] How to write the repository layout` | リポジトリごとに1行、この節の列で書き、それ以上は書かない |
| `/hora`（`spec-format.md`） | `[wing] How to write manual verification` | ミドルウェアの表だけ |
| `/hora-spec`（`stages.md`） | `[wing] Whether stage 5 may pass by carry-over` | はい。その版が画面を足さず、変えもしないとき |
| `/hora-plan` | `[wing] Whether the run may go on past an open blocking question` | いいえ。`/hora-build` には入らず、`/hora` は手順4で止まる |
| `/hora-plan` | `[wing] How to categorize a question` | 質問の分類の表 |
| `/hora-build` | `[wing] Whether a feature is ready to build` | はい。`_plan.md` の項目が `[ ]` で、`depends` がすべて満たされていれば。`/hora` も `/hora-fast` も、次の機能をここから選ぶ |
| `/hora-build` | `[wing] Whether a gate may open while a dependency is unfinished` | はい。未完了の依存先がすべて、その段階が待つものに達していれば。関所9より前は何も待たず、9からは対応するゲートのマージを待つ。読むのは `/hora-fast` だけ |
| `/hora-build`（`checkpoints.md`） | `[wing] Whether a row runs the frontend gate` | はい。リポジトリ構成がその行にフロントエンドの origin を与えているとき |
| `/hora-build`（`checkpoints.md`） | `[wing] How to stand up the local test environment` | ローカルの E2E コンテナ環境を、それを扱う skill で組み立てる |
| `/hora-build` | `[wing] Whether consecutive checkpoints may go to one implementer` | いいえ。実装の関所はそれぞれ自分の実行と自分の検証を持つ |
| `/hora-build` | `[wing] Whether an audit finding may be accepted without a person` | いいえ。指摘を受け入れられるのは、その `audit-finding` の問いに人が答えたときだけ |
| `/hora-build` | `[wing] How to lint a checkpoint's files` | 関所が触ったファイルだけに `npx eslint --fix`、続けて `npx eslint` |
| `/hora-build` | `[wing] How to test a checkpoint's files` | 関所が書いたファイルだけに `npx jest`、出力はファイルに書いて読む |
| `/hora-fast` | `[wing] Whether an interactive checkpoint may be skipped` | はい。関所2・9・11 は、人が頼めば飛ばせる |
| `/hora-progress` | `[wing] How to report progress` | 関所か段階を通るたびに 1 行。`📍 <checkpoint or stage> passed \| <the one fact it established> \| <what comes next>` の形。判定が実行を差し戻すたびにも 1 行で、行頭は `⏳️ [n]` |
| `/hora-accept` | `[wing] Whether a feature gate drives the product live` | はい。その実行の中で人が頼んだとき、または一覧に載った機能の後回しにした検収を払うとき。全体スイープは常に動かす |
| `/hora-accept` | `[wing] How to confirm the environment` | ローカルの E2E コンテナ環境を、それを扱う skill で立ち上げる |
| `/hora-accept` | `[wing] Whether a feature gate takes the UX findings step` | はい。その実行の中で人が頼んだとき。全体スイープは常に行う |
| `/hora-accept` | `[wing] Whether a feature gate takes the security audit step` | はい。その実行の中で人が頼んだとき。関所8が変更の集合をすでに監査しており、全体スイープは常に行う |
| `/hora-accept` | `[wing] How to cite a run's evidence` | 委任先が報告したものを、それが支える所見の中に |
| `/hora-hotfix` | `[wing] How to record a defect no test can catch` | `reproduced: no` と理由を書き、前後の測定値を記録する |
| 人が呼んだ skill（`structure.md`） | `[wing] How to begin a run` | add-on の解決のほかは何もしない |
| すべての skill（`structure.md`） | `[wing] How to close a run` | その skill 自身の締めの報告。止まったとき、一時停止したとき、終わったときのどれも |

**これらの見出しは、契約です。** add-on は見出しで節を見つけるので、見出しを変えたり消したりするのは Hora Kit の破壊的な変更です。1.0.0 未満ではしません。1.0.0 以降はメジャーバージョンとして出します。節を足すことは何も壊しません。見出しを保ったまま、節の中身を直すことも同じです。

---

## wing が節をどう変えるか

wing の見出しは、変える節と同じ文字列を持ち、印の中に効き方を書きます。

| 印 | 使う節 | 効き方 |
|---|---|---|
| `[wing:or]` | `Whether …` | 広げる。これが成り立つところでも、答えは「はい」 |
| `[wing:and]` | `Whether …` | 狭める。これも成り立つところだけ、答えは「はい」 |
| `[wing:replace]` | `How to …` | skill の節を脇に置き、代わりにこちらを読む |
| `[wing:overlay]` | `How to …` | skill の節の上に重ねて読む。食い違うところは wing に従う |
| `[wing:add]` | `How to …` | skill の節に手順を足す。skill の節はそのまま残る |

**wing は、自分の条件を書きません。** add-on が効いているかどうかは、wing を読む前に決まっています。wing が書くのは、何が変わるかだけです。wing の中に条件を書くと、「そうでなければ」を書き忘れたときに、誰にも気づかれずに実行が変わります。

5つの中で、`[wing:replace]` がいちばん強く、いちばん代償が大きい効き方です。add-on が効いている間、skill の節はなくなります。Hora Kit があとからその節を直しても、それも届きません。

---

## add-on が重なるところ

効いている add-on の wing は、すべて読まれ、組み合わされます。

`Whether …` の節は、1つの式で組み合わさります。add-on の順番で、結果は変わりません。

```
answer = (the skill's section  OR  every [wing:or])  AND  every [wing:and]
```

**`and` が勝ちます。** ある add-on が書いた除外を、別の add-on が同じ判断を広げて取り消すことはできません。狭める add-on がなければ、1つの add-on が「はい」と言えば足ります。多くの add-on は、実行をより先へ進めるためにあるからです。

`How to …` の節は、決まった順で組み合わさります。`replace` は最大1つ、次にすべての `overlay`、最後にすべての `add` です。`add` は食い違いません。`overlay` は、2つが同じ点について書いたときだけ食い違います。`replace` は、2つの add-on が両方とも置き換えれば、必ず食い違います。

食い違ったときは、次のうち、先に決まるものに従います。

1. `.hora/addon/config.json` に、人が決めた優先順位
2. 人が明示したもの（人がした宣言、`specs/` の一文）に根ざす wing。add-on 自身の既定に根ざすものより優先する
3. 仕様書をより精密にし、人が求めたものにより近づけるもの。その場で判断し、`addon-precedence` の質問として記録する

**3つに共通する原則は、人の利益がいちばん大きくなることです。** 誰にも尋ねない実行では、add-on が人の代わりに決めます。人が望むと言ったことにいちばん近い決め方が、その人自身が選んだはずの決め方です。人が書いた宣言は、どの add-on の既定よりも、そのことをよく語ります。3で判断したものは書き残します。人がそれを見て覆せるように、また、再開した実行が同じ判断を別の結論でやり直さないようにするためです。

### 一緒に効かせない add-on

add-on の中には、作るものの種類が違うものがあります。リリースに向けて作るものと、試作を作るもの、のようにです。一方が決めたことは、もう一方の成果物にとって意味を持ちません。**そういう組は、同じ版で一緒に効かせません。** 一方の定義が `exclusiveWith` にもう一方を挙げていれば、それで足ります。add-on 自身の skill は、もう一方が効いている間は宣言を受け付けません。それでも両方が効いてしまったら、どの skill も add-on を割り出す時点で、どちらも効かせずに止まります。どちらを残すかは、プロジェクトが何を作るかの判断なので、人に返します。優先順位の設定では決めません。

---

## 優先順位を決める

`/hora-addon` を直接呼ぶと、入っている add-on、今の版で効いている add-on、決められた優先順位を見せます。ある add-on を別の add-on より先にするよう頼むと、ファイルを書いて、コミットします。

```json
{
  "precedence": ["alpha-example-addon", "beta-example-addon"]
}
```

**一覧で先にあるものが優先されます。** 一覧にない add-on は、一覧にあるすべての add-on の後に来ます。このファイルは `.hora/` の下の記録なのでコミットされ、プロジェクトの全員が同じ優先順位を使います。書くのは人で、`/hora-addon` を通すか、手で書きます。installer が書くことはありません。

add-on の点検を頼むと、`/hora-addon` は、すべての wing を今入っている Hora Kit と突き合わせます。相手のファイルが実在するか、同じ見出しの節があるか、印が節の形に合っているか、です。

---

## add-on を作る

| | |
|---|---|
| **パッケージ名** | `@openreachtech/hora-addon-<name>`。中身が何であっても、この形で、`<name>` が add-on の名前になる。1つのパッケージは1つの add-on で、中身によって名前が変わるなら、skill を足した日にパッケージの名前を変えることになる |
| **前提にする Hora Kit** | `@openreachtech/hora` の範囲を、定義の `horaKit` に書く（例 `">=0.10.0 <1.0.0"`）。中身が何であっても、どの add-on も書く。add-on の定義は Hora Kit の解決の手順が読むから。このフィールドは省かない。下限は、その add-on の wing が広げる `[wing]` 節をすべて持つ最初の Hora Kit のリリースにする。上限は、それを壊しうる次のリリースにする。Hora Kit が 1.0.0 未満のあいだは `<1.0.0` で、`^` はそこで次のマイナーに止まるから。1.0.0 からは `^` を使う。これは利用側のリポジトリに課す条件で、dependency でも peer dependency でもない。add-on は Hora Kit の何も使わず、Hora Kit のスキルの側が add-on を読む。peer dependency にすると、何も使わない add-on のリポジトリにまで npm が Hora Kit を入れてしまうから |
| **installer** | パッケージ自身の `bin` で、`hora-addon-<name> install` として走る。何かを置く前に、利用側のリポジトリから Node と同じ解決で `@openreachtech/hora/package.json` を探して version を読み、`semver` パッケージで `horaKit` と突き合わせる。定義が範囲を宣言していないとき、`semver` が読めない範囲のとき、Hora Kit が入っていないとき、入っているものが範囲の外にあるときは、何も変えない。npm はこのフィールドを読まないので確かめるのはここだけで、見出しのない Hora Kit に入った wing は、黙って何もしなくなるから。`uninstall` は何も確かめない。add-on が複数あるプロジェクトでは、まずすべての add-on の skill の回（`install --only skills`）を走らせ、次にすべての add-on の wing の回（`install --only wings`）を走らせる |
| **定義** | パッケージの `kit/addon.json`。`activeWhen`、`description`、`horaKit`、必要なら `exclusiveWith` を持ち、`name` は持たない。installer がパッケージ名から名前を読み取り、`.hora/addons/<addon-name>.json` の最初の項目として書き込む。置くのは wing の回で、`--only` なしの `install` も置く。wing を持たない add-on でも同じ。wing の部分の uninstall で消え、`--only skills` だけの回では触れない |
| **`wings/` に置くもの** | Hora Kit の `[wing]` 節を広げるファイルだけを、同じ相対パスに置く。add-on が自分で足すものは、add-on の skill に置く |
| **記録** | `_<addon-name>.md`。行が増えるたびに、単独でコミットする |

---

## 次に読むもの

| | |
|---|---|
| skill が読む形の、決まりそのもの | [`hora-addon/SKILL.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora-addon/SKILL.md) |
| 各コマンドが何をするか | [`commands.ja.md`](./commands.ja.md) |
| 質問の記録の仕方と、その分類 | [`hora-plan/SKILL.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora-plan/SKILL.md) |
| skill が人に何を、どう尋ねるか | [`asking.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora/references/asking.md) |
| `.hora/` の配置 | [`structure.md`](https://github.com/openreachtech/hora-core/blob/main/kit/skills/hora/references/structure.md) |
