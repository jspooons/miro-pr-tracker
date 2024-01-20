'use client'

// import axios from 'axios';

// import { AppCard } from "@mirohq/websdk-types";
import { GithubPullRequest } from '../types';
import { PullRequestMapping } from '@prisma/client';

// @ts-ignore
export const insertGithubAppCards = async (githubPullRequests: GithubPullRequest[], repoOwner: string, repoName: string) => {
    await Promise.all(
        // @ts-ignore
        githubPullRequests.map(async (pr, index) => {
            const miroBoardId = await miro.board.getInfo();
            //const miroUserId = (await window.miro.board.getUserInfo()).id;
            console.log("APPLE",miroBoardId);
        })
    );
}
// @ts-ignore
export const updateGithubAppCards = async (pullRequestMappings: PullRequestMapping[]) => {

}
