'use server'

import {NextApiRequest, NextApiResponse} from 'next';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const { miroBoardId, repoOwner, repoOwnerType } = request.body;

    if (request.method === 'POST') {
        const exists = await checkBoardIdOwnerPairExists(miroBoardId, repoOwner, repoOwnerType);

        if (exists) {
            await prisma.dashboard.update({
                // @ts-ignore
                where: {
                    miroBoardId: miroBoardId,
                    repoOwner: repoOwner,
                    repoOwnerType: repoOwnerType
                },
                data: {
                    createdAt: new Date()
                }
            })
        }


        await prisma.dashboard.create({
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

async function checkBoardIdOwnerPairExists(miroBoardId: string, repoOwner: string, repoOwnerType: string) {
    const dashboard = await prisma.dashboard.findFirst({
        where: {
                miroBoardId: miroBoardId,
                repoOwner: repoOwner,
                repoOwnerType: repoOwnerType
            }
    });
    return dashboard;
}
