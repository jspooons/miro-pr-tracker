'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../modules/db';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroBoardId, repoOwner, repoOwnerType } = request.body;

    if (request.method === 'POST') {
        await db.dashboard.create({
            data: {
                miroBoardId: miroBoardId,
                repoOwner: repoOwner,
                repoOwnerType: repoOwnerType,
                createdAt: new Date()
            }
        });

        response.status(200).end();
    } else {
        response.status(405).end(); 
    }
}