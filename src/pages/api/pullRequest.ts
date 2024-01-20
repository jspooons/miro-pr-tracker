'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../modules/db';
import { validateStringParam } from '../../utils/utility';


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
    
    } else if (request.method === 'GET') { 
        const miroBoardId = validateStringParam(request.query.miroBoardId, 'miroBoardId');

        try {
            const pullRequestMappingsResponse = await db.pullRequestMapping.findMany({
                where: {
                    miroBoardId: miroBoardId
                }
            });
    
            response.status(200).send(pullRequestMappingsResponse);
        } catch (error: any) {
            console.error(error);
            response.status(500).json( {error: error.message} )
        }

    } else {
        response.status(405).end();
    }
}
