FROM node:16

# アプリケーションの作業ディレクトリを作成
WORKDIR /app

# 依存関係をインストールするためにpackage.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 残りのアプリケーションをコピー
COPY . .

# アプリケーションを立ち上げ
RUN npm run build

# 立ち上げられたアプリケーションを提供するためにnginxを使用
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# ポート80を解放
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]