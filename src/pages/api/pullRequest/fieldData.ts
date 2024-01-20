import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../modules/db';
import { getFieldData } from '../../../utils/fieldDataUtility';
import { getAuthResult } from '../../../utils/utility';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'POST') {
        const { pullNumber, repoName, repoOwner, miroUserId, task, miroAppCardId } = request.body;

        const authResult = await getAuthResult(miroUserId);

        if (task === 'create') {
            const fieldData = await getFieldData(repoOwner, repoName, pullNumber, authResult.gitToken);
            response.status(200).json(fieldData);
        } else if (task === 'update') {
            const pullRequestMapping = await db.pullRequestMapping.findUnique({ where: { miroAppCardId } });
            if (!pullRequestMapping) {
                throw new Error("No pull request mapping found");
            }

            const dashboard = await db.dashboard.findUnique({ where: { id: pullRequestMapping.dashboardId } });
            if (!dashboard) {
                throw new Error("No dashboard found");
            } 

            const fieldData = await getFieldData(dashboard.repoOwner, repoName, pullNumber, authResult.gitToken);
            response.status(200).json(fieldData);
        }
    } else {
        response.status(405).end();
    }
}