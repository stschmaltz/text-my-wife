export interface HandlerResult {
  statusCode: number;
  headers?: {};
  body: string;
}

const handler = async (): Promise<HandlerResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World!' })
  };
};

export { handler };
