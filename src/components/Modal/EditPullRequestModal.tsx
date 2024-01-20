'use client'
import * as React from 'react';
import axios from 'axios';

import '../../assets/style.css'

import { EditPullRequestModalProps } from '../types';
import { AppCard } from '@mirohq/websdk-types';
import { getDaysSincePullRequestCreation } from '../../utils/appCardFieldsUtility';

import { Changes, Description, Info, Reviewers, Status } from './editPullRequestModalUtility';

//@ts-ignore
export const EditPullRequestModal: React.FC<EditPullRequestModalProps> = ( { miroAppCardId, currentStatus } ) => {

    const [isOutOfSync, setIsOutOfSync] = React.useState<boolean>();
    const [fieldData, setFieldData] = React.useState<any>();
    const [title, setTitle] = React.useState<string>();
    const [description, setDescription] = React.useState<string>();
    const [reviewers, setReviewers] = React.useState<string[]>();
    const [isLoading, setIsLoading] = React.useState(true);

    const compareFieldData = async (githubFlattenedFieldData: any) => {
        const appCard = await miro.board.getById(miroAppCardId) as AppCard;
        const miroFieldData = formatMiroFieldData(appCard);

        setTitle(appCard.title);
        setDescription(appCard.description);
        setFieldData(miroFieldData);
        setReviewers(miroFieldData.slice(6));

        if (githubFlattenedFieldData.title !== miroFieldData.title ||
            githubFlattenedFieldData.description !== miroFieldData.description) {
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
            value: [
                // this is in a specific order, matching the order of the fields created initially, see appCardFieldsUtility.ts
                {value: `${getDaysSincePullRequestCreation(new Date(githubFieldData.createdAt))}d`},
                {value: `${githubFieldData.numFilesChanged}`},
                {value: `${githubFieldData.additions}`},
                {value: `${githubFieldData.deletions}`},
                {value: `${githubFieldData.numComments}`},
                {value: `${githubFieldData.customStatus}`},
                ...(Array.isArray(githubFieldData.reviews) ? githubFieldData.reviews.map((review: any) => ({
                    values: review.reviewer
                })) : [])
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

        if (miroUserId !== undefined && miroAppCardId !== undefined) {
            const githubFieldData = await axios.get(`/api/pullRequest/updated?miroAppCardId=${miroAppCardId}&miroUserId=${miroUserId}`);
            const flattenedGithubFieldData = flattenGithubFieldData(githubFieldData.data);

            setIsOutOfSync(await compareFieldData(flattenedGithubFieldData));
        }
    }

    React.useEffect(() => {
        getAppCard();
      }, [miroAppCardId]);

    React.useEffect(() => {
        if (isOutOfSync !== undefined && fieldData && title && description && reviewers) {
            setIsLoading(false);
        }
    }, [isOutOfSync, fieldData, title, description, reviewers]);
    

    return (
        <div>
            { isLoading ? 
                <div className="central-spinner-container"><div className="spinner"></div></div> 
                : 
                <div>
                    <h2>{title}</h2>
                    <Description description={description} createdAt={fieldData[0].value} />
                    <div className="grid-container">
                        <Changes fileChanges={fieldData[1].value} additions={fieldData[2].value} deletions={fieldData[3].value}/>
                        <Info numComments={fieldData[4].value}/>
                        <Status status={fieldData[5].value}/>
                        <Reviewers reviewers={reviewers}/>
                        <button type="button" className="button button-primary" disabled={!isOutOfSync}>
                            Sync Pull Request
                        </button>
                        <button type="button" className="button button-third">
                            Add Approver
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}
