/* Lambda entry point (Node 20). The AWS SDK v3 clients are built into this
   runtime, so there is nothing to npm install.
   Environment variables: TABLE_NAME, TO_EMAIL, FROM_EMAIL. */
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { createHandler } from './lib.mjs';

const ddb = new DynamoDBClient({});
const ses = new SESv2Client({});

export const handler = createHandler({
  env: process.env,
  putSignup: (r) => ddb.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      email:     { S: r.email },
      name:      { S: r.name },
      phone:     { S: r.phone },
      area:      { S: r.area },
      household: { S: r.household },
      createdAt: { S: r.createdAt }
    }
  })),
  sendMail: ({ to, from, replyTo, subject, text }) => ses.send(new SendEmailCommand({
    FromEmailAddress: from,
    Destination: { ToAddresses: [to] },
    ReplyToAddresses: [replyTo],
    Content: { Simple: { Subject: { Data: subject }, Body: { Text: { Data: text } } } }
  }))
});
