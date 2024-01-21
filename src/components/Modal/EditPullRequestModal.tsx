'use client'
import * as React from 'react';
import axios from 'axios';

import '../../assets/style.css'

import { EditPullRequestModalProps } from '../types';
import { AppCard } from '@mirohq/websdk-types';
import { getDaysSincePullRequestCreation } from '../../utils/appCardFieldsUtility';

import { Changes, Description, Info, Reviewers, Status, getFieldValueDecisionFromIconUrl } from './editPullRequestModalUtility';
import { updateGithubAppCard } from '../utility/appCardsUtility';


//@ts-ignore
export const EditPullRequestModal: React.FC<EditPullRequestModalProps> = ( { miroAppCardId, currentStatus } ) => {

    const [canSync, setCanSync] = React.useState<boolean>(false);
    const [description, setDescription] = React.useState<any>();
    const [fieldData, setFieldData] = React.useState<any>();
    const [title, setTitle] = React.useState<string>();
    const [reviewers, setReviewers] = React.useState<string[]>();
    const [isLoading, setIsLoading] = React.useState(true);
    const [githubData, setGithubData] = React.useState<any>();

    const formatMiroFieldData = (appCard: any) => {
        const miroFieldData = appCard.fields.map((field: any) => ({
            value: field.value,
            iconUrl: field.iconUrl,
            fillColor: field.fillColor,
            textColor: field.textColor
        }));

        return miroFieldData;
    }

    const flattenGithubFieldData = (githubFieldData: any) => {
        console.log("GOLL",githubFieldData);
        return {
            title: githubFieldData.title,
            author: githubFieldData.author,
            values: [
                // this is in a specific order, matching the order of the fields created initially, see appCardFieldsUtility.ts
                {value: `${getDaysSincePullRequestCreation(new Date(githubFieldData.createdAt))}d`},
                {value: `${githubFieldData.numFilesChanged}`},
                {value: `${githubFieldData.additions}`},
                {value: `${githubFieldData.deletions}`},
                {value: `${githubFieldData.numComments}`},
                {value: `${githubFieldData.customStatus}`}
            ],
            reviews: [
                ...(Array.isArray(githubFieldData.reviews) ? githubFieldData.reviews.map((review: any) => ({
                    reviewer: review.reviewer, decision: review.decision
                })) : [])
            ]
        };
    }

    const compareFieldData = async (githubFlattenedFieldData: any) => {
        if (githubFlattenedFieldData.title !== title) {
            return true;
        }

        const totalNumGithubFields = githubFlattenedFieldData.values.length + githubFlattenedFieldData.reviews.length;

        if (totalNumGithubFields !== fieldData.length) {
            return true;
        }

        for (let i = 0; i < githubFlattenedFieldData.values.length; i++) {
            if (githubFlattenedFieldData.values[i].value !== fieldData[i].value) {
                return true;
            }
        }

        for (let i = githubFlattenedFieldData.values.length; i < totalNumGithubFields; i++) {
            if (githubFlattenedFieldData.reviews[i-githubFlattenedFieldData.values.length].reviewer !== fieldData[i].value &&
                githubFlattenedFieldData.reviews[i-githubFlattenedFieldData.values.length].decision !== getFieldValueDecisionFromIconUrl(fieldData[i].iconUrl)) {
                return true;
            }
        }

        return false;
    }

    const handleCheckSync = async () => {
        const miroUserId = await miro.board.getUserInfo().then((res: any) => res.id);
        const githubFieldData = await axios.get(`/api/pullRequest/updated?miroAppCardId=${miroAppCardId}&miroUserId=${miroUserId}`);
        const flattenedGithubFieldData = flattenGithubFieldData(githubFieldData.data);
        
        const syncCheckResult = await compareFieldData(flattenedGithubFieldData)
        setCanSync(syncCheckResult);

        if (syncCheckResult) {
            setGithubData(flattenedGithubFieldData)
        }

        const message = syncCheckResult ? "Sync available, click 'Sync Pull Request' button to sync." : "There is no available sync, you are all up to date!";
        miro.board.notifications.showInfo(`Ran Sync Check : ${message}`);
    }

    const handleSync = async () => {
        await updateGithubAppCard(githubData, miroAppCardId);
        await getAppCardData();
    }

    const getAppCardData = async () => {
        const miroUserId = await miro.board.getUserInfo().then((res: any) => res.id);
        if (miroUserId !== undefined && miroAppCardId !== undefined) {
            const appCard = await miro.board.getById(miroAppCardId) as AppCard;
            const miroFieldData = formatMiroFieldData(appCard);

            setTitle(appCard.title);
            setFieldData(miroFieldData);
            setReviewers(miroFieldData.slice(6));
            setDescription(appCard.description);
        }
    }

    React.useEffect(() => {
        getAppCardData();
      }, [miroAppCardId]);

    React.useEffect(() => {
        if (fieldData && title && reviewers && description) {
            setIsLoading(false);
        } 
    }, [fieldData, title, reviewers, description]);

    return (
        <div>
            { isLoading ? 
                <div className="central-spinner-container"><div className="spinner"></div></div> 
                : 
                <div>
                    <h2>{title}</h2>
                    <Description description={description} createdAt={fieldData[0].value}/>
                    <div className="grid-container">
                        <Changes fileChanges={fieldData[1].value} additions={fieldData[2].value} deletions={fieldData[3].value}/>
                        <Info numComments={fieldData[4].value}/>
                        <Status status={fieldData[5].value}/>
                        <Reviewers reviewers={reviewers}/>
                        { !canSync ?
                            <button type="button" className="button button-primary" onClick={handleCheckSync}>
                                Check Sync Status
                            </button>
                            :
                            <button type="button" style={{backgroundColor: "green"}} className="button button-primary" onClick={handleSync}>
                                Sync Pull Request
                            </button>
                        }
                        <button type="button" className="button button-third">
                            Reserve Your Review
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}
