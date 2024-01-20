'use server'

import axios from 'axios';
import {NextApiRequest, NextApiResponse} from 'next';

import { validateStringParam } from '../../utils/utility';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    if (request.method === 'GET') {
        try {
            const miroUserId = validateStringParam(request.query.miroUserId, 'miroUserId');
            const repoOwner = validateStringParam(request.query.repoOwner, 'repoOwner');
            const repoOwnerType = validateStringParam(request.query.repoOwnerType, 'repoOwnerType');

            const authResult = await prisma.auth.findUnique({
                where: {
                    miroUserId: miroUserId
                }
            });

            const ownerReposResult = await axios.get(`https://api.github.com/${repoOwnerType}s/${repoOwner}/repos`, {
                headers: {
                    'Authorization': `token ${authResult?.gitToken}`
                }
            });

            const getPullRequests = async (repo: any) => {
                const pullRequests = await axios.get(`https://api.github.com/repos/${repo.full_name}/pulls`, {
                    headers: {
                        'Authorization': `token ${authResult?.gitToken}`
                    }
                });
                
                return pullRequests.data.map((pr: any) => ({ title: pr.title, pullNumber: pr.number }));
            };

            const reposWithPullRequests = await Promise.all(ownerReposResult.data.map(async (repo: any) => {
                const pullRequests = await getPullRequests(repo);
                return { name: repo.name, pullRequests: pullRequests };
            }));

            response.status(200).send({repositories: reposWithPullRequests, githubUser: repoOwner});
        } catch (error) {
            console.error(error);
            response.status(500).end();
        }
    } else {
        response.status(405).end();
    }
}
