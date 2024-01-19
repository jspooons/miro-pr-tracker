'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../modules/db';
import axios from 'axios';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroUserId, gitToken } = request.body;

    if (request.method === 'POST') {
        const accountDetailsResult = await axios.get(`https://api.github.com/user`, {
            headers: {
                Authorization: `token ${gitToken}`
            }
        });

        await db.auth.create({
            data: {
                miroUserId: miroUserId,
                gitUserName: accountDetailsResult.data.login,
                gitToken: gitToken
            }
        });

        response.status(200).end();
    } else {
        response.status(405).end(); 
    }
}