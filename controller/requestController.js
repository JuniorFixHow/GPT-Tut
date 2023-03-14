import dotenv from 'dotenv';

import { Configuration, OpenAIApi } from "openai";
dotenv.config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const postRequest = async(req, res)=>{
    const {prompt} = req.body;
    try {
        const openai = new OpenAIApi(configuration);

        const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt, 
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0,
        });

        res.status(200).json({ai: response.data.choices[0].text})
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
}