import {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../modules/db';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroBoardId, repoOwner, miroAppCardId, pullNumber, repoName } = request.body;
    
    if (request.method === 'POST') {
        try {
            const response = await db.dashboard.findFirst({
                where:{
                    miroBoardId: miroBoardId,
                    repoOwner: repoOwner
                }
            })

            if (response) {
                await db.pullRequestMapping.create({
                    data: {
                        dashboardId: response.id,
                        miroBoardId: miroBoardId,
                        miroAppCardId: miroAppCardId,
                        pullNumber: pullNumber,
                        repoName: repoName,
                        createdAt: new Date()
                    }
                });
            } else {
                throw new Error("No dashboard found for this board and user");
            }
        } catch (error) {
            console.error(error);
        }
    } else {
        response.status(405).end();
    }
}