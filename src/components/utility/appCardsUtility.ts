'use client'

import axios from 'axios';

import { AppCard } from "@mirohq/websdk-types";
import { GithubPullRequest } from '../types';
import { PullRequestMapping } from '@prisma/client';

export const insertGithubAppCards = async (githubPullRequests: GithubPullRequest[], repoOwner: string, repoName: string) => {
    await Promise.all(
        githubPullRequests.map(async (pr, index) => {
            const miroBoardId = (await miro.board.getInfo()).id;
            const miroUserId = (await miro.board.getUserInfo()).id;
            
            const fieldDataResponse = await axios.get(`/api/pullRequest/fieldData?pullNumber=${pr.pullNumber}&repoName=${repoName}&repoOwner=${repoOwner}&miroUserId=${miroUserId}`);
        })
    );
}
// @ts-ignore
export const updateGithubAppCards = async (pullRequestMappings: PullRequestMapping[]) => {

}
