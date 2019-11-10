import request from "request";

const text_key = process.env.TEXT_KEY as string;


export const sendText = (message: string, number: string) => {
  const textContent = message ? message : "Hello world";
  return new Promise((resolve, reject) => {
    request.post(
      "https://textbelt.com/text",
      {
        form: {
          phone: number,
          message: textContent,
          key: text_key
        }
      },
      function(err, _, body) {
        if (err) {
          reject(err);
          return;
        }

        resolve(body);
      }
    );
  });
};
