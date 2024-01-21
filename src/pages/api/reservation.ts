'use server'

import axios from 'axios';
import {NextApiRequest, NextApiResponse} from 'next';

import prisma from '../../modules/db';
import { getAuthResult, validateStringParam } from '../../utils/utility';


export default async function handler(request: NextApiRequest, response: NextApiResponse) {

    if (request.method === 'GET') {

        if (request.query.miroUserId === undefined) {
            const reservations = await prisma.reviewReservation.findMany({
                where: {
                    miroAppCardId: request.query.miroAppCardId as string
                }
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
                miroUserId: miroUserId
            }
        });
        
        if (reservation.createdAt.getTime() === reservation.UpdatedAt.getTime()) {

            const authResponse = await getAuthResult(miroUserId);

            if (authResponse) {
                const pullRequestMappingResponse = await prisma.pullRequestMapping.findUnique({
                    where: {
                        miroAppCardId: miroAppCardId
                    }
                });

                if (pullRequestMappingResponse) {
                    const dashboardResponse = await prisma.dashboard.findUnique({
                        where: {
                            id: pullRequestMappingResponse.dashboardId
                        }
                    });

                    if (dashboardResponse && pullRequestMappingResponse) {
                        try {
                            console.log(dashboardResponse.repoOwner, pullRequestMappingResponse.repoName, pullRequestMappingResponse.pullNumber);
                            const response = await axios.post(
                                `https://api.github.com/repos/${dashboardResponse.repoOwner}/${pullRequestMappingResponse.repoName}/pulls/${pullRequestMappingResponse.pullNumber}/reviews`,
                                {},
                                {
                                    headers: {
                                        'Authorization': `token ${authResponse.gitToken}`,
                                        'Accept': 'application/vnd.github.v3+json', // Added Accept header
                                        'Content-Type': 'application/json', // Added Content-Type header
                                        'X-GitHub-Api-Version': '2022-11-28',
                                    },
                                }
                            );
                            console.log('Review created successfully:', response.data);
                        } catch (error: any) {
                            console.error('Error creating review:', error.response ? error.response.data : error.message);
                        }
                    }
                }
            }

            response.status(200).send({ created: true });
        } else {
            response.status(200).send({ created: false });
        }

        response.status(200).end('true');
    } else if (request.method === 'DELETE'){
        await prisma.reviewReservation.delete({
            where: {
                id: Number(request.body.id),
                miroAppCardId_miroUserId: {
                    miroAppCardId: request.body.miroAppCardId as string,
                    miroUserId: request.body.miroUserId as string
                }
            }
        });

        response.status(200).end();
    } else {
        response.status(405).end();
    }
}
