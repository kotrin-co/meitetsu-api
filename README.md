# 環境構築手順

## クローン

```
git clone https://github.com/kotrin-co/meitetsu-api.git <project-name>
```

## package.json の設定

- package.json にて設定を変更する
- 特に S3 のバケット名は重複が許されないため、Dev と Prd ともに一意の命名とする

## 開発環境設定

```
npm run setup-dev
```

## 開発環境デプロイ

```
npm run package-deploy-dev
```

## 本番環境設定

```
npm run setup-prd
```

## 本番環境デプロイ

```
npm run package-deploy-prd
```
