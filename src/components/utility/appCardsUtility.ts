'use client'

import axios from 'axios';

import { AppCard } from "@mirohq/websdk-types";
import { GithubPullRequest } from '../types';
import { PullRequestMapping } from '@prisma/client';
import { createFields, getDaysSincePullRequestCreation } from '../../utils/appCardFieldsUtility';

export const insertGithubAppCards = async (githubPullRequests: GithubPullRequest[], repoOwner: string, repoName: string) => {
    await Promise.all(
        githubPullRequests.map(async (pr, index) => {
            const miroBoardId = (await miro.board.getInfo()).id;
            const miroUserId = (await miro.board.getUserInfo()).id;
            
            const fieldDataResponse = await axios.post(`/api/pullRequest/fieldData`, {
                task: 'create',
                pullNumber: pr.pullNumber,
                repoName: repoName,
                repoOwner: repoOwner,
                miroUserId: miroUserId
            });

            const {author, createdAt} = fieldDataResponse.data;

            // Create App Card
            const appCard = await miro.board.createAppCard({
                x: index * 350,
                y: 0,
                title: pr.title,
                description: `Created by ${author} ${getDaysSincePullRequestCreation(new Date(createdAt))}d days ago. This is PR #${pr.pullNumber}; for the repository ${repoName}, owned by ${repoOwner}.`,
                style: {
                cardTheme: "#000000",
                },
                fields: createFields(fieldDataResponse.data),
                status: "connected",
            });
            
            // create pullRequestMapping
            axios.post(`/api/pullRequest`, {
                    miroAppCardId: appCard.id,
                    pullNumber: pr.pullNumber,
                    repoName: repoName,
                    repoOwner: repoOwner,
                    miroBoardId: miroBoardId,
                }
            );
            
            if (index === 0) {
                await miro.board.viewport.zoomTo(appCard);
            }
        })
    );
}

export const updateGithubAppCards = async (pullRequestMappings: PullRequestMapping[]) => {
    await Promise.all(
        pullRequestMappings.map(async pullRequestMapping => {
    
          const { pullNumber, repoName } = pullRequestMapping;
          const appCard = await miro.board.getById(pullRequestMapping.miroAppCardId) as AppCard;
          const miroUserId = (await miro.board.getUserInfo()).id;
          
          const fieldDataResponse = await axios.post(`/api/pullRequest/fieldData`, {
            task: 'update',
            pullNumber: pullNumber,
            repoName: repoName,
            miroAppCardId: appCard.id,
            miroUserId: miroUserId
          });
    
          appCard.title = fieldDataResponse.data.title;
          appCard.fields = createFields(fieldDataResponse.data);      
          appCard.sync();
        })
      );
}

export const updateGithubAppCard = async (githubData: any, miroAppCardId: string) => {
    const createdAtDaysAgo = new Date();
    createdAtDaysAgo.setDate(createdAtDaysAgo.getDate() - parseInt(githubData.values[0].value.replace('d', '')));
    
    const appCard = await miro.board.getById(miroAppCardId) as AppCard;
    appCard.title = githubData.title;
    appCard.fields = createFields({
        createdAt: createdAtDaysAgo,
        numFilesChanged: githubData.values[1].value,
        additions: githubData.values[2].value,
        deletions: githubData.values[3].value,
        numComments: githubData.values[4].value,
        customStatus: githubData.values[5].value,
        reviews: githubData.reviews
    });
    
    appCard.sync();
}
