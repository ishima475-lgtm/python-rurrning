# python-rurrning

Python (FastAPI) バックエンド + React (Vite + TypeScript) フロントエンドの構成です。
DevContainer 上で動かす前提です。

## 構成

```
.
├── .devcontainer/          # DevContainer 定義（Python 3.12 + Node 20）
├── backend/                # FastAPI アプリ
│   ├── src/python_rurrning/
│   │   └── main.py         # /api/hello エンドポイント
│   └── tests/
├── frontend/               # Vite + React + TypeScript
│   └── src/
│       └── App.tsx         # /api/hello を呼んで表示
├── CLAUDE.md
└── README.md
```

## 使い方（DevContainer）

1. VS Code で本フォルダを開き「Reopen in Container」
2. 起動時に backend の依存（editable install）と frontend の `npm install` が自動実行されます

## 起動（2つのターミナルで）

バックエンド:

```bash
python-rurrning            # http://localhost:8000  (= uvicorn)
```

フロントエンド:

```bash
npm --prefix frontend run dev   # http://localhost:5173
```

ブラウザで http://localhost:5173 を開くと、フロントが `/api/hello` を呼び
`Hello, World!` を表示します。Vite のプロキシ設定により `/api` は backend(:8000)へ転送されます。

## テスト

```bash
pytest --rootdir backend backend            # バックエンド
npm --prefix frontend run build             # フロント型チェック + ビルド
```

## アーキテクチャ / 設計

- **2プロセス構成**: バックエンド (uvicorn `:8000`) とフロントエンド (Vite `:5173`) は
  それぞれ独立したプロセスとして動きます。1つのプロセスから配信しているわけではなく、
  フロントは HTTP でバックエンドを呼び出します。
- **開発時のリクエスト経路**: フロントは同一オリジンのパス (`/api/hello` 等) を呼び、
  Vite のプロキシ (`frontend/vite.config.ts` の `server.proxy["/api"]`) が
  `:8000` のバックエンドへ転送します。これにより開発中は CORS を気にせず済みます。
  バックエンド側にも `localhost:5173` 向けの CORS をフォールバックとして設定しています。
- **API は `/api/*` プレフィックスで統一**: プロキシ設定が効くように、追加する
  エンドポイントも `/api/...` 配下に置いてください。
- **本番では Vite プロキシが無い点に注意**: 本番ビルドを配信する仕組み側で `/api` を
  バックエンドへルーティングするか、CORS/オリジン設定を見直す必要があります。
