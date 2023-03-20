import express, { Application, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import config from "@config";
import { Configuration, OpenAIApi } from "openai";

const app: Application = express();
const port = config.port;

app.get("/", async (req: Request, res: Response) => {
  res.send("hello");
});

// naver api test
app.get("/naver", async (req: Request, res: Response) => {
  try {
    const headers = {
      "X-Naver-Client-Id": config.naver_client_id,
      "X-Naver-Client-Secret": config.naver_client_secret,
      Accept: "*/*",
      "User-Agent": "curl/7.49.1",
      Host: config.naver_host,
    };

    const aixosResponse: AxiosResponse = await axios.get(
      "https://openapi.naver.com/v1/search/news.json?query=WBC",
      { headers }
    );
    console.log(aixosResponse.data);
    res.status(200).send(aixosResponse.data);
  } catch (err) {
    console.log(err);
  }
});

// chatGPT api test
app.get("/chatgpt", async (req: Request, res: Response) => {
  const configuration = new Configuration({
    apiKey: config.openai_api_key,
  });
  const openai = new OpenAIApi(configuration);

  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  // const animal = req.body.animal || "";
  const animal = "pig" || "";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      },
    });
    return;
  }
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (err) {
    console.log(err);
  }
});

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

app.listen(port, () => {
  console.log("실행되었습니다. http://localhost:3000");
});
