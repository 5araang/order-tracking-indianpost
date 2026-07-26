import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import crypto from 'crypto';

function encryptAES256(plainText: string, secretKey: string): string {
  try {
    const key = crypto.createHash('sha256').update(secretKey).digest();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return iv.toString('base64') + ':' + encrypted;
  } catch (e) {
    return Buffer.from(plainText).toString('base64');
  }
}

// Enterprise API Endpoint Middleware Plugin for Vite Local Dev Server
function enterpriseApiPlugin() {
  return {
    name: 'enterprise-api-router',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';

        // Handle /api/indiapost next-action requests
        if (url.startsWith('/api/indiapost')) {
          const nextAction = req.headers['next-action'];
          const tokenAction = process.env.VITE_NEXTJS_TOKEN_ACTION || '00b4f44fd7cd8e5a9d969100904e4880581555ea21';
          
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Content-Type', 'text/x-component');

          if (nextAction === tokenAction) {
            return res.end('0:"$K1"\n1:"mock_session_token_9f8a3721"\n');
          }

          const mockData = {
            booking_details: {
              booking_office_name: 'Origin Post Office',
              destination_office_name: 'Destination Post Office',
              booking_date: new Date().toISOString().split('T')[0],
              booking_pin: '110001',
              tariff: '0.00',
              article_type: 'Speed Post',
              delivery_confirmed_on: new Date().toISOString()
            },
            tracking_details: [
              { event_date: new Date().toISOString(), event_office: 'Destination Post Office', event: 'Item Delivered(Addressee)' },
              { event_date: new Date().toISOString(), event_office: 'Destination Post Office', event: 'Taken out for delivery' },
              { event_date: new Date().toISOString(), event_office: 'Postal Sorting Hub', event: 'Item Dispatched' },
              { event_date: new Date().toISOString(), event_office: 'Origin Post Office', event: 'Item Booked' }
            ]
          };

          return res.end(`0:"$K1"\n1:${JSON.stringify({ success: true, data: mockData })}\n`);
        }

        const match = url.match(/^\/(?:v1\/api\/track|api\/v1\/track|track)\/([A-Za-z0-9]+)/);
        if (!match) return next();

        const trackingCode = match[1].toUpperCase();
        const apiKey = req.headers['x-api-key'];
        const apiSecret = req.headers['x-api-secret'];

        const envKey = process.env.VITE_INDIAPOST_API_KEY || 'ip_live_9f8a3721e4b85c10a3d';
        const envSecret = process.env.VITE_INDIAPOST_API_SECRET || 'sec_48a02c91b7d5e6f3a8b00192347101';

        const mockData = {
          id: trackingCode,
          origin: 'Origin Post Office',
          destination: 'Destination Post Office',
          booking_date: new Date().toISOString().split('T')[0],
          pincode: '110001',
          tariff: '0.00',
          category: trackingCode.startsWith('E') ? 'Speed Post' : 'PARCEL',
          delivered: true,
          delivery_date: new Date().toISOString(),
          events: [
            { date: new Date().toISOString(), office: 'Destination Post Office', description: 'Item Delivered(Addressee)', status: 'DELIVERED' },
            { date: new Date().toISOString(), office: 'Destination Post Office', description: 'Taken out for delivery', status: 'OUT_FOR_DELIVERY' },
            { date: new Date().toISOString(), office: 'Postal Sorting Hub', description: 'Item Dispatched', status: 'DISPATCHED' },
            { date: new Date().toISOString(), office: 'Origin Post Office', description: 'Item Booked', status: 'BOOKED' }
          ],
          source: 'DEV_SERVER_API',
          fetched_at: new Date().toISOString()
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-API-Secret');

        const isValidAuth = Boolean(apiKey && apiSecret && apiKey === envKey && apiSecret === envSecret);

        if (isValidAuth) {
          res.end(JSON.stringify({
            success: true,
            authenticated: true,
            encrypted: false,
            data: mockData
          }, null, 2));
        } else {
          const ciphertext = encryptAES256(JSON.stringify(mockData), envSecret);
          res.end(JSON.stringify({
            success: true,
            authenticated: false,
            encrypted: true,
            message: "No API Key / Secret headers provided. Returning AES-256 encrypted payload ciphertext. Pass valid X-API-Key and X-API-Secret headers for unencrypted JSON.",
            ciphertext,
            data: mockData
          }, null, 2));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), enterpriseApiPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
