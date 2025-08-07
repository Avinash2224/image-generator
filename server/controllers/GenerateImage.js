import * as dotenv from "dotenv";
import { createError } from "../error.js";
import OpenAI from 'openai';

// Make sure dotenv is configured before using process.env
dotenv.config();

// Check if API key exists
if (!process.env.OPENAI_API_KEY) {
  console.error("Missing OpenAI API key");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Controller to generate Image
export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    console.log("Generating image for prompt:", prompt);

    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    
    const generatedImage = response.data[0].b64_json;
    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    next(
      createError(
        error.status || 500,
        error?.error?.message || error.message
      )
    );
  }
};