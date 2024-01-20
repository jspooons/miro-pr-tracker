import {NextApiRequest, NextApiResponse} from 'next';
import db from '../../../modules/db';
import { filterPullRequestReviews, getPullRequest, getPullRequestReviews, getPullRequestComments, getPullRequestCustomStatus } from '../../../utils/fieldDataUtility';

async function getFieldData(repoOwner: string, repoName: string, pullNumber: number, gitToken: string) {
    const pullRequest = await getPullRequest(repoOwner, repoName, pullNumber, gitToken);
    const reviews = await getPullRequestReviews(repoOwner, repoName, pullNumber, gitToken);
    const comments = await getPullRequestComments(repoOwner, repoName, pullNumber, gitToken);
    const filteredReviews = filterPullRequestReviews(reviews, 14);

    return {
        title: pullRequest.title,
        author: pullRequest.user.login,
        numFilesChanged: pullRequest.changed_files,
        numComments: reviews.length + comments.length,
        additions: pullRequest.additions,
        deletions: pullRequest.deletions,
        reviews: filteredReviews,
        customStatus: getPullRequestCustomStatus(reviews.length, pullRequest.merged_by, pullRequest.state),
        createdAt: pullRequest.created_at
    };
}

async function getAuthResult(miroUserId: string) {
    const authResult = await db.auth.findUnique({ where: { miroUserId } });
    if (!authResult) {
        throw new Error("No dashboard or auth entry found");
    }
    return authResult;
}

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