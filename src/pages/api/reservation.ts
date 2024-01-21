'use server'

import axios from 'axios';
import {NextApiRequest, NextApiResponse} from 'next';

import prisma from '../../modules/db';
import { getAuthResult, validateStringParam } from '../../utils/utility';


async function getGitParameters(miroUserId: string, miroAppCardId: string) {
    const authResponse = await getAuthResult(miroUserId);
    if (!authResponse) throw new Error('Auth response is null');

    const pullRequestMappingResponse = await prisma.pullRequestMapping.findUnique({
        where: { miroAppCardId: miroAppCardId }
    });
    if (!pullRequestMappingResponse) throw new Error('Pull request mapping response is null');

    const dashboardResponse = await prisma.dashboard.findUnique({
        where: { id: pullRequestMappingResponse.dashboardId  }
    });
    if (!dashboardResponse) throw new Error('Dashboard response is null');

    return { 
        repoOwner: dashboardResponse.repoOwner, 
        repoName: pullRequestMappingResponse.repoName, 
        pullNumber: pullRequestMappingResponse.pullNumber, 
        gitToken: authResponse.gitToken 
    }
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method === 'GET') {

            if (request.query.miroUserId === undefined) {
                const reservations = await prisma.reviewReservation.findMany({
                    where: { miroAppCardId: request.query.miroAppCardId as string }
                });

                response.status(200).send(reservations);
            } 

            const reservation = await prisma.reviewReservation.findUnique({
                where: {
                    miroAppCardId_miroUserId: {
                        miroAppCardId: request.query.miroAppCardId as string,
                        miroUserId: request.query.miroUserId as string
                    }
                }
            });

            response.status(200).send(reservation);

        } else if (request.method === 'PUT') {
            const miroUserId = validateStringParam(request.query.miroUserId, 'miroUserId');
            const miroAppCardId = validateStringParam(request.query.miroAppCardId, 'miroAppCardId');
            const miroUsername = validateStringParam(request.query.miroAppCardId, 'miroUsername');

            const reservation = await prisma.reviewReservation.upsert({
                where: {
                    miroAppCardId_miroUserId: {
                        miroAppCardId: miroAppCardId,
                        miroUserId: miroUserId
                    }
                },
                update: {}, // update nothing
                create: {
                    miroAppCardId: miroAppCardId,
                    miroUserId: miroUserId,
                    miroUsername: miroUsername
                }
            });
            
            if (reservation.createdAt.getTime() === reservation.UpdatedAt.getTime()) {

                const { repoOwner, repoName, pullNumber, gitToken } = await getGitParameters(miroUserId, miroAppCardId);

                try {
                    const gitResponse = await axios.post(
                        `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}/reviews`,
                        {},
                        {
                            headers: {
                                'Authorization': `token ${gitToken}`,
                                'Accept': 'application/vnd.github.v3+json', 
                                'Content-Type': 'application/json', 
                                'X-GitHub-Api-Version': '2022-11-28',
                            },
                        }
                    );

                    prisma.reviewLink.create({
                        data: {
                            reviewId: gitResponse.data.id,
                            miroAppCardId: miroAppCardId,
                            miroUserId: miroUserId
                        }
                    });

                    console.log('Review created successfully:', gitResponse.data);
                } catch (error: any) {
                    console.error('Error creating review:', error.response ? error.response.data : error.message);
                }

                response.status(200).send({ created: true });
            } else {
                response.status(200).send({ created: false });
            }

            response.status(200).end('true');
        } else if (request.method === 'DELETE'){
            const miroUserId = validateStringParam(request.query.miroUserId, 'miroUserId');
            const miroAppCardId = validateStringParam(request.query.miroAppCardId, 'miroAppCardId');

            await prisma.reviewReservation.delete({
                where: {
                    miroAppCardId_miroUserId: {
                        miroAppCardId: miroAppCardId as string,
                        miroUserId: miroUserId as string
                    }
                }
            });

            const { repoOwner, repoName, pullNumber, gitToken } = await getGitParameters(miroUserId, miroAppCardId);

            await prisma.reviewLink.findUnique({
                where: {
                    miroAppCardId_miroUserId: {
                        miroAppCardId: miroAppCardId,
                        miroUserId: miroUserId
                    }
                }
            }).then(async reviewLink => {
                if (reviewLink) {
                    await axios.delete(
                        `https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}/reviews/${reviewLink.reviewId}`,
                        {
                            headers: {
                                'Authorization': `token ${gitToken}`,
                                'Accept': 'application/vnd.github.v3+json', 
                                'Content-Type': 'application/json',
                                'X-GitHub-Api-Version': '2022-11-28',
                            },
                        }
                    );
                }
            }).then(() => {
                prisma.reviewLink.delete({
                    where: {
                        miroAppCardId_miroUserId: {
                            miroAppCardId: miroAppCardId,
                            miroUserId: miroUserId
                        }
                    }
                });
            }).catch(error => {
                console.error(error);
            });

            response.status(200).end();
        } else {
            response.status(405).end();
        }
    } catch (error) {
        console.error(error);
        response.status(500).end();
    }
}
