'use client'
import * as React from 'react';
import axios from 'axios';

import '../../assets/style.css'
import { EditPullRequestModalProps } from '../types';
import { AppCard } from '@mirohq/websdk-types';
import { getDaysSincePullRequestCreation } from '../../utils/appCardFieldsUtility';




export const EditPullRequestModal: React.FC<EditPullRequestModalProps> = ( { miroAppCardId, currentStatus } ) => {

    const [isOutOfSync, setIsOutOfSync] = React.useState(false);

    const compareFieldData = async (githubFlattenedFieldData: any) => {
        const appCard = await miro.board.getById(miroAppCardId) as AppCard;
        const miroFieldData = formatMiroFieldData(appCard);

        if (githubFlattenedFieldData.title !== miroFieldData.title) {
            return true;
        }

        if (githubFlattenedFieldData.description !== miroFieldData.description) {
            return true;
        }

        for (let i = 0; i < githubFlattenedFieldData.values.length; i++) {
            if (githubFlattenedFieldData.values[i].value !== miroFieldData.values[i].value) {
                return true;
            }
        }

        return false;
    }

    const flattenGithubFieldData = (githubFieldData: any) => {
        return {
            title: githubFieldData.title,
            author: githubFieldData.author,
            description: `Created by ${githubFieldData.author} on ${githubFieldData.createdAt}, as a part of pull request #${githubFieldData.pullNumber}; for ${githubFieldData.repoName}, owned by ${githubFieldData.repoOwner}.`,
            values: [
                // this is in a specific order, matching the order of the fields created initially, see appCardFieldsUtility.ts
                {value: `${getDaysSincePullRequestCreation(new Date(githubFieldData.createdAtt))}d`},
                {value: `${githubFieldData.numFilesChanges}`},
                {value: `${githubFieldData.additions}`},
                {value: `${githubFieldData.deletions}`},
                {value: `${githubFieldData.numComments}`},
                {value: `${githubFieldData.customStatus}`},
                ...githubFieldData.reviews.map((review: any) => ({
                    values: review.reviewer
                }))
            ]
        };
    }

    const formatMiroFieldData = (appCard: any) => {
        const miroFieldData = appCard.fields.map((field: any) => ({
            value: field.value,
        }));

        return miroFieldData;
    }
    
    const getAppCard = async () => {
        const miroUserId = (await miro.board.getUserInfo()).id;
        const githubFieldData = await axios.get(`/api/pullRequest/updated?miroAppCardId=${miroAppCardId}&miroUserId=${miroUserId}`);
        const flattenedGithubFieldData = flattenGithubFieldData(githubFieldData);

        setIsOutOfSync(await compareFieldData(flattenedGithubFieldData));
    }

    React.useEffect(() => {
        getAppCard();
    }, [])
    
    return (
        <div>
            <h1>{}</h1>
        </div>
    )
}
