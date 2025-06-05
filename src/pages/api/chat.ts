import { NextApiRequest, NextApiResponse } from 'next';
import { getResponseFromLLM } from '../../lib/llmApi';

export default async function chat(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        try {
            const reply = await getResponseFromLLM(message);
            return res.status(200).json({ reply });
        } catch (error) {
            return res.status(500).json({ error: 'Error processing the request' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}