import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  signature?: string;
  timestamp?: number;
  apiKey?: string;
  cloudName?: string;
  folder?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return res.status(500).json({
      error:
        'Cloudinary environment variables are not configured in .env.local',
    });
  }

  const { folder = 'facesmash_posts' } = req.body || {};
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Cloudinary signature rules:
  // Sort parameters alphabetically, join with '=', '&', append API secret, and calculate SHA-1 hash.
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(`${paramsToSign}${apiSecret}`)
    .digest('hex');

  return res.status(200).json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  });
}
