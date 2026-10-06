# Reserve form backend (Lambda + DynamoDB + SES)

```
browser ──POST JSON──▶ Lambda Function URL ──▶ DynamoDB  (the signup, keyed by email)
                                          └──▶ SES       (an email to admin@ecoculture.in)
```

The visitor sees "You're on the list" **only if both succeed**. Anything else
shows an error with an email/WhatsApp fallback. There is no API Gateway: a
Lambda Function URL does the same job with one less service.

Everything below is in **ap-south-1 (Mumbai)**. The site's Content-Security-Policy
(`customHttp.yml`) allows `https://*.lambda-url.ap-south-1.on.aws`, so if you
use another region, change that line to match.

Test the logic on your laptop, no AWS needed:

```
node backend/reserve/test.mjs
```

## 1. SES — verify the address

SES console → region **Asia Pacific (Mumbai)** → **Identities → Create identity →
Email address** → `admin@ecoculture.in`. Open the link SES emails to that inbox.

This one verified address is used as both sender and recipient. While SES is in
its "sandbox" it can only send **to** verified addresses, which is all this
needs. You do not need to request production access, because the function
never emails customers.

## 2. DynamoDB — the table

DynamoDB → **Create table**: name `ecoculture-reserve`, partition key `email`
(String), capacity mode **On-demand**.

## 3. Lambda

Lambda → **Create function** → name `ecoculture-reserve`, runtime **Node.js 20.x**,
architecture arm64.

Package and upload the code (PowerShell, from the repo root):

```
cd backend\reserve
Compress-Archive -Path index.mjs,lib.mjs -DestinationPath ..\reserve.zip -Force
```

Upload `backend\reserve.zip` under **Code → Upload from → .zip file**. Do not
include `test.mjs`. Handler stays `index.handler`.

**Configuration → General:** timeout **10 seconds**.

**Configuration → Environment variables:**

| Key | Value |
|---|---|
| `TABLE_NAME` | `ecoculture-reserve` |
| `TO_EMAIL` | `admin@ecoculture.in` |
| `FROM_EMAIL` | `admin@ecoculture.in` |

**Configuration → Concurrency → Reserved concurrency: 5.** The URL is public,
and this caps how much anyone hammering it can cost or fill.

**Configuration → Permissions:** open the function's execution role and add this
inline policy (replace `ACCOUNT_ID`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow", "Action": "dynamodb:PutItem",
      "Resource": "arn:aws:dynamodb:ap-south-1:ACCOUNT_ID:table/ecoculture-reserve" },
    { "Effect": "Allow", "Action": "ses:SendEmail",
      "Resource": "arn:aws:ses:ap-south-1:ACCOUNT_ID:identity/admin@ecoculture.in" }
  ]
}
```

## 4. Function URL

**Configuration → Function URL → Create:** auth type **NONE**, and tick
**Configure CORS**:

- Allow origins: `https://ecoculture.in` and your Amplify preview URL
  (`https://rebuild.XXXX.amplifyapp.com`). No trailing slashes.
- Allow methods: `POST`
- Allow headers: `content-type`

Configure CORS **on the URL only**. The function deliberately sends no CORS
headers of its own, because doubled headers make browsers reject the reply.

Copy the URL it gives you.

## 5. Connect the page

In `index.html`, set it on the form:

```html
<form id="reserve-form" name="reserve" data-endpoint="https://XXXX.lambda-url.ap-south-1.on.aws/" novalidate ...>
```

Commit and push. Amplify redeploys the preview.

## 6. Test it properly

DEPLOY.md's rule: test with a real address and wait for the email.

1. Open the preview, submit the form with an address you control.
2. Confirm the page says "You're on the list".
3. Confirm the email reaches admin@ecoculture.in (check spam the first time).
4. Confirm the row is in DynamoDB → Tables → ecoculture-reserve → Explore items.
5. Prove the failure path: temporarily remove `FROM_EMAIL` in the Lambda
   configuration, submit again, and confirm the page shows the error and **not**
   "thank you". Put the variable back.

If CloudWatch shows errors, **Monitor → View CloudWatch logs** shows the reason.
