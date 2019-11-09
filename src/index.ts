import request from "request";
import { getFile, uploadFile } from "./s3-client";

export interface HandlerResult {
  statusCode: number;
  headers?: {};
  body: string;
}
const text_key = process.env.TEXT_KEY as string;
const bucket_name = process.env.BUCKET_NAME as string;

const handler = async (): Promise<HandlerResult> => {
  try {
    console.log(text_key);
    console.log("Sending text");

    const result = await request.post("https://textbelt.com/text", {
      form: {
        phone: "+14039907630",
        message: "Hello world",
        key: text_key
      }
    });
    // const file = await getFile(bucket_name, 'test');

    console.log("ayyy result", result.body);
    console.log("ayyy result", JSON.parse(result.body));
  } catch (error) {
    console.error("error occurred", error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World!" })
  };
};

export { handler };
