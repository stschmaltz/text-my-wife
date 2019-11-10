import { getFile, uploadFile, getFileNames, deleteFile } from "./s3-client";
import { sendText } from "./sms-client";
import { GetObjectOutput } from "aws-sdk/clients/s3";

export interface HandlerResult {
  statusCode: number;
  headers?: {};
  body: string;
}
const msg_bucket_name = process.env.MESSAGE_BUCKET_NAME as string;
const sent_bucket_name = process.env.SENT_BUCKET_NAME as string;
const to_number = process.env.TO_NUMBER as string;
const error_number = process.env.ERROR_NUMBER as string;

const handler = async (): Promise<HandlerResult> => {
  let resultParsed: any;
  let file: GetObjectOutput;
  let fileNames: string[];

  try {
    console.log("Sending text");
    fileNames = await getFileNames(msg_bucket_name, 1);
    file = await getFile(msg_bucket_name, fileNames[0]);
    if (!file || !file.Body) {
      throw Error("There is no files in the message bucket!");
    }

    const result: any = await sendText(file.Body.toString(), to_number);
    resultParsed = JSON.parse(result);
  } catch (error) {
    console.error("error occurred", error);
    await sendText("Error sending message with rachels app", error_number);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error occurred!", ...error })
    };
  }

  console.log("Result", resultParsed);

  try {
    if (resultParsed && resultParsed.success) {
      const uploadRes = await uploadFile(
        sent_bucket_name,
        fileNames[0],
        file.Body.toString()
      );

      console.log("UPLOAD COMPLETE", uploadRes);
      const deleteRes = await deleteFile(msg_bucket_name, fileNames[0]);
      console.log("DELETE COMPLETE", deleteRes);
    }
  } catch (error) {
    console.error("error occurred", error);
    await sendText("Error moving messages with rachels app", error_number);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error occurred!", ...error })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Successfully Sent Message!" })
  };
};

export { handler };
