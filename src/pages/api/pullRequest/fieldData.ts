'use server'

import {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../modules/db';
import { filterPullRequestReviews, getPullRequest } from '../../../utils/fieldDataUtility';
import { validateStringParam, validateNumberParam } from '../../../utils/utility';
import { getPullRequestReviews, getPullRequestComments, getPullRequestCustomStatus } from '../../../utils/fieldDataUtility';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== 'GET') {
        return;
    }

    try {
        let owner: string = "";

        const { repoOwner, miroAppCardId } = request.query;

        const repoName = validateStringParam(request.query.repoName, 'repoName');
        const miroUserId = validateStringParam(request.query.miroUserId, 'miroUserId');
        const pullNumber = validateNumberParam(request.query.pullNumber, 'pullNumber');

        if (miroAppCardId && !Array.isArray(miroAppCardId)) {
            const pullRequestMapping = await db.pullRequestMapping.findUnique({
                where: {
                    miroAppCardId: miroAppCardId as string
                }
            });

            if (!pullRequestMapping) {
                throw new Error("No pull request mapping found");
            };

            const dashboard = await db.dashboard.findUnique({
                where: {
                    id: pullRequestMapping.dashboardId
                }
            });

            if (!dashboard) {
                throw new Error("No dashboard found");
            }

            owner = dashboard.repoOwner;

        } else if (Array.isArray(miroAppCardId)) {
            throw new Error('Invalid miroAppCardId');
        }

        if (repoOwner && !Array.isArray(repoOwner)) {
            owner = repoOwner;
        }

        const authResult = await db.auth.findUnique({
            where: {
                miroUserId: miroUserId as string
            }
        });

        if (!authResult) {
            throw new Error("No dashboard or auth entry found");
        }

        const pullRequest = await getPullRequest(owner, repoName, pullNumber, authResult.gitToken);
        const reviews = await getPullRequestReviews(owner, repoName, pullNumber, authResult.gitToken);
        const comments = await getPullRequestComments(owner, repoName, pullNumber, authResult.gitToken);

        // miro only allows 20 custom fields, so we only want to show the last 14 reviews as we already have 6 other fields ()
        const filteredReviews = filterPullRequestReviews(reviews, 14);

        const fieldData = {
            title: pullRequest.title,
            author: pullRequest.user.login,
            numFilesChanged: pullRequest.changed_files,
            numComments: reviews.length + comments.length,
            additions: pullRequest.additions,
            deletions: pullRequest.deletions,
            reviews: filteredReviews,
            customStatus: getPullRequestCustomStatus(reviews.length, pullRequest.merged_by, pullRequest.state),
            createdAt: pullRequest.created_at
        }
        
        response.status(200).send(fieldData);
        
    } catch (error) {
        console.error(error);
        response.status(500).end();
    }
}