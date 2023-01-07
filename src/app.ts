// 第三方模块
import bodyParser from 'body-parser';
import express from 'express';
import { Configuration, OpenAIApi } from 'openai'
import { NextFunction, Request, Response } from 'express'; // express 申明文件定义的类型

// 自定义模块
import { systemConfig } from './config';
const configuration = new Configuration({
    apiKey: systemConfig.apiKey,
});
const openai = new OpenAIApi(configuration);

const app = express();

// 处理 post 请求的请求体，限制大小最多为 20 兆
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));

// error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    return res.sendStatus(500);
});

app.listen(systemConfig.port, function () {
    console.log(`the server is start at port ${systemConfig.port}`);
});

app.get('/chatgpt', async (req, res) => {
    try {
        const prompt = req.query.prompt
        let models = await openai.listModels({
            headers: { 'OpenAI-Organization': 'org-SSvyDSCOrtp5NESDQfynZJ6Z' }
        })
        const response = await openai.createCompletion({
            model: "text-davinci-001",
            prompt: `${prompt}`,
            temperature: 0, // Higher values means the model will take more risks.
            max_tokens: 1024, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
        });
        res.status(200).send(response.data.choices[0].text);

    } catch (error) {
        console.error(error)
        res.status(500).send(error || 'Something went wrong');
    }
})

export default app;