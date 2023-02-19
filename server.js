import express, { response } from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
import TelegramBot from 'node-telegram-bot-api';

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const openai = new OpenAIApi(configuration);

const app = express()
app.use(cors())
app.use(express.json())

// app.get('/', async (req, res) => {
//   res.status(200).send({
//     message: 'Hello from CodeX!'
//   })
// })

// app.post('/', async (req, res) => {
//   try {
//     const prompt = req.body.prompt;

//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: `${prompt}`,
//       temperature: 0, // Higher values means the model will take more risks.
//       max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
//       top_p: 1, // alternative to sampling with temperature, called nucleus sampling
//       frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
//       presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
//     });

//     res.status(200).send({
//       bot: response.data.choices[0].text
//     });

//   } catch (error) {
//     console.error(error)
//     res.status(500).send(error || 'Something went wrong');
//   }
//   console.log(res);
// })

bot.on('message', async (msg) => {
  const text = msg.text;
  if (text === '/start') {
    bot.sendMessage(msg.chat.id, 'Hello! Welcome to my bot!');
  }else if(text) {
    const response = await generateResponse(text);
    bot.sendMessage(msg.chat.id, response);
  }
});


async function generateResponse(text) {
  const prompt = text.trim();
  console.log(prompt);

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    console.log(response.data.choices[0].text);
    return response.data.choices[0].text;
    // return "ተበዳ mars".response.data.choices[0].text;
    // return response.data.choices[0].text;
  } catch (error) {
    console.error(error);
    return "Sorry, an error occurred while generating a response.";
  }
}


// app.listen(8003, () => console.log('AI server started on http://localhost:8003'))
app.listen(process.env.PORT || 8003, () => console.log('AI server started'))
