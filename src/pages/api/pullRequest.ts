'use server'

import {NextApiRequest, NextApiResponse} from 'next';
import { validateStringParam } from '../../utils/utility';

import prisma from '../../modules/db'


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    if (request.method === 'POST') {
        const { miroBoardId, repoOwner, miroAppCardId, pullNumber, repoName } = request.body;

        const dashboardResponse = await prisma.dashboard.findFirst({
            where: {
                miroBoardId,
                repoOwner
            }
        });

        if (dashboardResponse) {
            await prisma.pullRequestMapping.create({
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

        await prisma.pullRequestMapping.deleteMany({
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
            const pullRequestMappingsResponse = await prisma.pullRequestMapping.findMany({
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
