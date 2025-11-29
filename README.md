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
- Supabaseアカウント

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

3. **環境変数を設定**

`.env.local` ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Supabaseデータベースをセットアップ**

Supabaseプロジェクトで以下のSQLを実行：

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

5. **開発サーバーを起動**

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く

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
2. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. デプロイボタンをクリック

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

- [ ] ユーザー認証機能
- [ ] チーム共有機能
- [ ] タスクの検索・フィルタリング
- [ ] 期限アラート通知
- [ ] タスクのアーカイブ機能
- [ ] ダークモード対応
- [ ] モバイルアプリ化

## 📄 ライセンス

MIT License

## 👤 作成者

[riki takahata]

## 🙏 謝辞

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [dnd-kit](https://dndkit.com/)
- [Tailwind CSS](https://tailwindcss.com/)