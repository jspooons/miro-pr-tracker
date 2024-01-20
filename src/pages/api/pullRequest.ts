'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../modules/db';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroBoardId, repoOwner, miroAppCardId, pullNumber, id, repoName } = request.body;

    if (request.method === 'POST') {
        const dashboardResponse = await db.dashboard.findFirst({
            where: {
                miroBoardId,
                repoOwner
            }
        });

        if (dashboardResponse) {
            await db.pullRequestMapping.create({
                data: {
                    dashboardId: id,
                    miroAppCardId: miroAppCardId,
                    pullNumber: pullNumber,
                    repoName: repoName,
                    miroBoardId: miroBoardId,
                }
            });
            
            response.status(200).end();
        } else {
            throw new Error("No dashboard found");
        }
    } else {
        response.status(405).end();
    }
}
