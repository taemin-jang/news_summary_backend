import express, { Application, Request, Response } from "express";

const app: Application = express();
const port: number = 3000;

app.get("/", async (req: Request, res: Response) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log("실행되었습니다. http://localhost:3000");
});
