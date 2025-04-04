import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Readability } from "@mozilla/readability";
import * as lambda from "aws-lambda";
import { default as dashify } from "dashify";
import epub from "epub-gen-memory";
import { JSDOM } from "jsdom";
import { createRequire } from "module";
import { css } from "./style.mjs";
import { promisify } from "util";

const require = createRequire(import.meta.url);
const emlformat = require("eml-format");
const buildEml = promisify(emlformat.build);
const readEml = promisify(emlformat.read);

export const handler = async (event: lambda.S3Event) => {
	const s3Client = new S3Client();
	const sesClient = new SESv2Client();

	async function processArticle(bucket: string, object: string): Promise<void> {
		console.log(`processing article s3://${bucket}/${object}`);

		const get = await s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: object }));
		const body = await get.Body?.transformToString();
		const email = await readEml(body);

		console.log("extracting content...");
		const doc = new JSDOM(email.html, { url: "http://epub.pgavlin.com" });
		const reader = new Readability(doc.window.document);
		const article = reader.parse();
		if (article === null) {
			throw new Error(`parsing with readability failed`);
		}

		const title = article.title || email.subject;
		const author = article.byline || email.from.name;

		console.log("generating epub...");
		const output = await epub.default(
			{
				title,
				author,
				css,
                prependChapterTitles: false,
			},
			[{ content: article.content }],
		);

		const epubKey = "epub/" + `${dashify(title)}-${object}.epub`.replace("/", "-");
		console.log("writing result...");
		await s3Client.send(new PutObjectCommand({
			Bucket: bucket,
			Key: epubKey,
			Body: output,
		}));

		console.log("generating presigned URL...");
		const command = new GetObjectCommand({ Bucket: bucket, Key: epubKey });
		const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

		console.log("building reply...");
		const reply = await buildEml({
			from: "epub@pgavlin.com",
			to: email.from,
			headers: {
				"In-Reply-To": email.headers["Message-ID"],
				"References": email.headers["Message-ID"],
			},
			subject: `Re: ${email.subject}`,
			html: `<html><head></head><body><a href="${presignedUrl}">Download epub</a><br/></body></html>`,
		});

		console.log("sending reply...");
		await sesClient.send(new SendEmailCommand({ Content: { Raw: { Data: Buffer.from(reply, "utf-8") } } }));
	};

	const responses = await Promise.all(event.Records.map(async (record) => {
		const { bucket, object } = record.s3;
		try {
			await processArticle(bucket.name, object.key);
			return "OK";
		} catch (error: any) {
			console.log(`error: ${error.message}`);
			return error.message;
		}
	}));

	return {
		statusCode: 200,
		body: JSON.stringify(responses),
	};
};
