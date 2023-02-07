# 環境構築手順

## クローン

```
git clone https://github.com/kotrin-co/answer-serverless.git project-name
```

## 設定

AWS 関連の設定を調整します。下記コマンドを環境に合わせて利用します。

```
npm run config -- --account-id="<accountId>" \
--bucket-name="<bucketName>" \
--region="<region>"
```
