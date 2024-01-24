import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  'use server'
  if (request.method === 'GET') {
    response.status(200).json({ name: 'John Doe' });
  } else {
    response.status(405).end(); // Method Not Allowed
  }
}