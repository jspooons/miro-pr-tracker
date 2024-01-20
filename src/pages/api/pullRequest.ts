'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../modules/db';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    if (request.method === 'POST') {
        const { miroBoardId, repoOwner, miroAppCardId, pullNumber, repoName } = request.body;

        const dashboardResponse = await db.dashboard.findFirst({
            where: {
                miroBoardId,
                repoOwner
            }
        });

        if (dashboardResponse) {
            await db.pullRequestMapping.create({
                data: {
                    dashboardId: dashboardResponse.id,
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
    } else if (request.method === 'DELETE') {
        const { appCardIds } = request.body;

        await db.pullRequestMapping.deleteMany({
            where: {
                miroAppCardId: {
                    in: appCardIds
                }
            }
        });

        response.status(200).end();
    
    } else {
        response.status(405).end();
    }
}
