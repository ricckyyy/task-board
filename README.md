# TODOリストアプリ

Azureタスクボード風のカンバン形式TODOリスト管理アプリケーション

## ✨ 機能

- **カンバンボード形式**: TODO / IN PROGRESS / DONE の3カラム
- **ドラッグ&ドロップ**: タスクをカラム間で自由に移動
- **タスク管理**: 作成・編集・削除機能
- **タグ機能**: バグ、機能追加、レビューの3種類のタグ
- **期限設定**: タスクに期限を設定可能
- **詳細説明**: タスクに説明文を追加
- **データ永続化**: Supabaseによるクラウドストレージ

## 🛠️ 技術スタック

- **Frontend**: Next.js 15 (React 19)
- **スタイリング**: Tailwind CSS
- **ドラッグ&ドロップ**: @dnd-kit
- **データベース**: Supabase (PostgreSQL)
- **デプロイ**: Vercel
- **言語**: TypeScript

## 📦 セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Docker Desktop（ローカルDB用）
- Supabase CLI（ローカル開発用）
- Supabaseアカウント（本番環境用）

### インストール手順

1. **リポジトリをクローン**

```bash
git clone [あなたのリポジトリURL]
cd todo-app
```

2. **依存パッケージをインストール**

```bash
npm install
```

3. **Supabase CLIをインストール**

```bash
npm install -g supabase
```

4. **ローカルSupabaseを起動**

```bash
supabase start
```

起動後、接続情報が表示されます：
- API URL: http://127.0.0.1:54321
- Studio URL: http://127.0.0.1:54323
- Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres

5. **環境変数を設定**

`.env.local` ファイルを作成し、`supabase start` で表示された情報を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=（表示されたPublishable key）
```

6. **Supabaseデータベースをセットアップ**

Supabase Studio（http://127.0.0.1:54323）のSQLエディタで以下を実行：

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('TODO', 'IN_PROGRESS', 'DONE')),
  due_date DATE,
  tags TEXT[] DEFAULT '{}',
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_order ON tasks("order");

ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
```

7. **開発サーバーを起動**

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

### 本番環境（Supabaseクラウド）へのデプロイ準備

本番環境では認証機能が必要です：

1. Supabaseプロジェクトを作成
2. 上記SQLを実行してテーブルを作成
3. Row Level Security (RLS) を有効化
4. `.env.local` を本番用のURLとキーに変更
5. `lib/supabase.ts` で `NODE_ENV` が 'production' の場合の処理を確認

## 📝 使い方

### タスクの作成
1. 「+ 新しいタスク」ボタンをクリック
2. タイトル、説明、期限、タグを入力
3. 「保存」をクリック

### タスクの移動
- タスクカードのタイトル部分をドラッグして、別のカラムにドロップ

### タスクの編集
- タスクカード右上の編集アイコン（ペン）をクリック

### タスクの削除
- タスクカード右上の削除アイコン（ゴミ箱）をクリック

## 🚀 デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelに接続
2. 本番用Supabaseプロジェクトを作成し、テーブルをセットアップ
3. Vercelで環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`（本番用URL）
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`（本番用キー）
4. デプロイボタンをクリック

**注意**: 本番環境では認証機能の実装とRLSの有効化が推奨されます。

## 🛠️ 開発時のコマンド

```bash
# ローカルSupabaseを起動
supabase start

# ローカルSupabaseを停止
supabase stop

# Supabase Studioを開く
# http://127.0.0.1:54323

# Next.js開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番モードで起動
npm start
```

## 📂 プロジェクト構造

```
todo-app/
├── app/
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # メインページ
│   └── globals.css         # グローバルスタイル
├── components/
│   ├── Column.tsx          # カラムコンポーネント
│   ├── TaskCard.tsx        # タスクカードコンポーネント
│   └── TaskModal.tsx       # タスク編集モーダル
├── lib/
│   ├── types.ts            # 型定義
│   └── supabase.ts         # Supabase接続設定
├── public/                 # 静的ファイル
├── .env.local              # 環境変数（gitignore対象）
├── package.json            # 依存パッケージ
└── README.md               # このファイル
```

## 🔮 今後の拡張予定

- [ ] ユーザー認証機能（本番環境用）
- [ ] Row Level Security (RLS) の実装
- [ ] チーム共有機能
- [ ] タスクの検索・フィルタリング
- [ ] 期限アラート通知
- [ ] タスクのアーカイブ機能
- [ ] ダークモード対応
- [ ] モバイルアプリ化

## ⚠️ 注意事項

- **開発環境**: 認証なしで動作（`NODE_ENV=development`）
- **本番環境**: 認証が必要（実装予定）
- **RLS**: 現在は無効化（開発用）。本番環境では有効化を推奨
- **Docker**: Supabaseローカル環境にはDocker Desktopが必要

## 📄 ライセンス

MIT License

## 👤 作成者

[riki takahata]

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [dnd-kit](https://dndkit.com/)
- [Tailwind CSS](https://tailwindcss.com/)