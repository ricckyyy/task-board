# セットアップガイド

## "Failed to fetch" エラーの解決方法

アカウント作成時に「Failed to fetch」エラーが発生する場合、環境変数が正しく設定されていない可能性があります。

### 解決手順

#### 1. 環境変数ファイルの作成

プロジェクトのルートディレクトリに `.env.local` ファイルを作成してください。

```bash
# プロジェクトのルートディレクトリで実行
touch .env.local
```

#### 2. Supabaseの起動

ローカル開発環境でSupabaseを起動します。

```bash
# Supabaseローカル環境を起動
npx supabase start
```

起動後、以下のような接続情報が表示されます：

```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
  S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbG... (長い文字列)
service_role key: eyJhbG... (長い文字列)
   S3 Access Key: 625729a08b95bf1b7ff351a663f3a23c
   S3 Secret Key: 850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907
       S3 Region: local
```

#### 3. 環境変数の設定

`.env.local` ファイルに以下の内容を追加します：

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=上記で表示されたanon key
```

**重要**: `anon key` は実際に表示された長い文字列をコピーして貼り付けてください。

#### 4. 開発サーバーの再起動

環境変数を変更した後は、開発サーバーを再起動する必要があります。

```bash
# 開発サーバーを停止（Ctrl+C）してから再起動
npm run dev
```

#### 5. 確認

ブラウザで http://localhost:3000 を開き、アカウント作成を試してください。
正しく設定されていれば、エラーメッセージが表示されずにアカウントを作成できます。

### トラブルシューティング

#### エラー: "環境設定が正しく行われていません"

このエラーが表示される場合、`.env.local` ファイルが正しく設定されていないか、開発サーバーを再起動していない可能性があります。

1. `.env.local` ファイルが存在することを確認
2. 環境変数が正しく設定されていることを確認
3. 開発サーバーを再起動

#### Supabaseが起動しない

Docker Desktopが起動していることを確認してください。

```bash
# Dockerの状態を確認
docker ps

# Supabaseの状態を確認
npx supabase status
```

#### 本番環境での設定

本番環境（Vercel等）にデプロイする場合は、以下の環境変数を設定してください：

1. Supabaseの管理画面（https://supabase.com）でプロジェクトを作成
2. Settings > API から URL と anon key を取得
3. デプロイ先のプラットフォーム（Vercel等）で環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`: プロジェクトのURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: プロジェクトのanon key

## よくある質問

### Q: .env.local ファイルはGitにコミットすべきですか？

A: いいえ。`.env.local` ファイルには機密情報が含まれるため、Gitにコミットしないでください。このファイルは `.gitignore` に記載されており、自動的に除外されます。

### Q: 開発環境と本番環境で異なる設定を使用できますか？

A: はい。ローカル開発では `.env.local` を使用し、本番環境ではデプロイ先のプラットフォームの環境変数設定を使用します。

### Q: Supabaseを使わずに開発できますか？

A: いいえ。このアプリケーションはSupabaseをデータベースおよび認証プロバイダーとして使用しているため、Supabaseの設定が必要です。
