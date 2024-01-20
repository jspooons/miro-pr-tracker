'use server'

import axios from 'axios';
import {NextApiRequest, NextApiResponse} from 'next';

import db from '../../modules/db';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    
    const { miroUserId, repoOwner, repoOwnerType }  = request.query;

    if (request.method === 'GET') {
        try {
            if (!miroUserId || Array.isArray(miroUserId)) {
                return response.status(400).json({ error: 'Invalid or missing miroUserId' });
            }

            if (!repoOwner || Array.isArray(repoOwner)) {
                return response.status(400).json({ error: 'Invalid or missing repoOwner' });
            }

            if (!repoOwnerType || Array.isArray(repoOwnerType)) {
                return response.status(400).json({ error: 'Invalid or missing repoOwnerType' });
            }

            const authResult = await db.auth.findUnique({
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
