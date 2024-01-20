import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../modules/db';
import { validateStringParam } from '../../../utils/utility';
import { getFieldData } from '../../../utils/fieldDataUtility';
import { getAuthResult } from '../../../utils/utility';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'GET') {
        const miroAppCardId = validateStringParam(request.query.miroAppCardId, 'miroAppCardId');
        const miroUserId = validateStringParam(request.query.miroUserId, 'miroUserId');

        try {
            const authResponse = await getAuthResult(db, miroUserId);

            const pullRequestMappingResponse = await db.pullRequestMapping.findUnique({
                where: {
                    miroAppCardId: miroAppCardId
                }
            });

            if (!pullRequestMappingResponse) {
                throw new Error("No pull request mapping found");
            }

            const dashboardResponse = await db.dashboard.findUnique({
                where: {
                    id: pullRequestMappingResponse.dashboardId
                }
            });

            if (!dashboardResponse) {
                throw new Error("No dashboard found");
            }
            
            const fieldData = await getFieldData(dashboardResponse.repoOwner, pullRequestMappingResponse.repoName, pullRequestMappingResponse.pullNumber, authResponse.gitToken);

            response.status(200).send(fieldData);
        } catch (error: any) {
            console.error(error);
            response.status(500).json( {error: error.message} )
        }

    } else {
        response.status(405).end();
    }
}