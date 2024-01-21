'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

import prisma from '../../modules/db'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroUserId, gitToken } = request.body;
    console.log("in auth.ts", miroUserId, gitToken);
    if (request.method === 'POST') {
        console.log("miroUserId: ", miroUserId);
        try {
            const accountDetailsResult = await axios.get(`https://api.github.com/user`, {
                headers: {
                    'Authorization': `token ${gitToken}`
                }
            });

            const exists = await checkAuthExists(miroUserId);

            if (exists) {
                await prisma.auth.update({
                    where: {
                        miroUserId: miroUserId
                    },
                    data: {
                        gitUserName: accountDetailsResult.data.login,
                        gitToken: gitToken
                    }
                });
            } else {
                await prisma.auth.create({
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
        console.log("in 405 else");
        response.status(405).end(); 
    }
}

async function checkAuthExists(miroUserId: string) {
    const auth = await prisma.auth.findUnique({
        where: {
            miroUserId: miroUserId
        }
    });
    
    return auth;
}
