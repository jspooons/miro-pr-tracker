'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../modules/db';
import axios from 'axios';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroUserId, gitToken } = request.body;

    if (request.method === 'POST') {
        try {
            const accountDetailsResult = await axios.get(`https://api.github.com/user`, {
                headers: {
                    Authorization: `token ${gitToken}`
                }
            });

            const exists = await checkAuthExists(miroUserId);

            if (exists) {
                await db.auth.update({
                    where: {
                        miroUserId: miroUserId
                    },
                    data: {
                        gitUserName: accountDetailsResult.data.login,
                        gitToken: gitToken
                    }
                });
            } else {
                await db.auth.create({
                    data: {
                        miroUserId: miroUserId,
                        gitUserName: accountDetailsResult.data.login,
                        gitToken: gitToken
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }

        response.status(200).end();
    } else {
        response.status(405).end(); 
    }
}

async function checkAuthExists(miroUserId: string) {
    const auth = await db.auth.findUnique({
        where: {
            miroUserId: miroUserId
        }
    });
    
    return auth;
}
