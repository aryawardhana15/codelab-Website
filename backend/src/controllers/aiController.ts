import { Request, Response } from 'express';
import { generateQuestion, evaluateAnswer } from '../services/groqService';

export const generate = async (req: Request, res: Response) => {
    try {
        const { materialContent } = req.body;
        if (!materialContent) {
            return res.status(400).json({ success: false, message: 'Material content is required' });
        }

        const question = await generateQuestion(materialContent);
        res.json({ success: true, data: { question } });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const evaluate = async (req: Request, res: Response) => {
    try {
        const { question, answer, materialContent } = req.body;
        if (!question || !answer || !materialContent) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const result = await evaluateAnswer(question, answer, materialContent);
        res.json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
