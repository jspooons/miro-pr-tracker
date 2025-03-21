import {NextApiRequest, NextApiResponse} from 'next';

import prisma from '../../../modules/db'

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroBoardId }  = request.query;
    
    if (request.method === 'GET') {
        try {
            if (!miroBoardId || Array.isArray(miroBoardId)) {
                return response.status(400).json({ error: 'Invalid or missing miroBoardId' });
            }

            const dashboardResponse = await prisma.dashboard.findMany({
                where: {
                    miroBoardId: miroBoardId
                }
            });

            const repoOwners = dashboardResponse.map((dashboard: any) => ({name: dashboard.repoOwner, repoOwnerType: dashboard.repoOwnerType}));

            response.status(200).send(repoOwners);
        } catch (error) {
            console.error(error);
            response.status(500).end();
        }
    } else {
        response.status(405).end(); 
    }
}
