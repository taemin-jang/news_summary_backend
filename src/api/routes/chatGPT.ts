import { Router, Request, Response, NextFunction } from "express";
import Container from "typedi";
import { Logger } from "winston";
import config from "@config";
import { Configuration, OpenAIApi } from "openai";

export default (app: Router) => {
  const logger: Logger = Container.get("logger");

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
      logger.error(err);
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
};
