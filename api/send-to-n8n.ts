import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error('N8N_WEBHOOK_URL environment variable is missing.');
    return res.status(500).json({ 
      error: 'Server configuration error: Webhook URL is not set.' 
    });
  }

  try {
    const payload = req.body;

    // Optional: Log outgoing request header if debugging is needed
    // console.log('Forwarding data to n8n:', payload);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n responded with status ${response.status}:`, errorText);
      throw new Error(`n8n webhook failed with status ${response.status}`);
    }

    // Success
    return res.status(200).json({ 
      success: true, 
      message: 'Data successfully sent to n8n.' 
    });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request.', 
      details: error.message || 'Unknown error' 
    });
  }
}
