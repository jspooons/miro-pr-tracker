import React from 'react';

import * as icons from '../../assets/icons';
import { PrStatus, PrStatusIcons, getDaysSincePullRequestCreation } from '../../utils/appCardFieldsUtility';


export enum PrStatusCssClazz {
    APPROVED = "approved",
    CHANGES_REQUESTED = "changes-requested",
    COMMENTED = "commented",

    CLOSED = "closed",
    NO_REVIEW = "no-review",
    IN_REVIEW = "in-review",
    MERGED = "merged"
}


export const Description = (descriptionData : any) => {

    const timeSinceCreation = getDaysSincePullRequestCreation(new Date(descriptionData.descriptionData.createdAt));
    const now = new Date();
    let clazzName: string;

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(now.getDate() - 5);

    if (descriptionData.descriptionData.createdAt > twoDaysAgo) {
        clazzName = "new";
    } else if (descriptionData.descriptionData.createdAt > fiveDaysAgo) {
        clazzName = "mid";
    } else {
        clazzName = "old";
    }
    
    return (
        <div>
            <h3 className="subheader">Description</h3>
            <p className="description">
                Created by {descriptionData.descriptionData.author}
                <span className={clazzName}><img className="icon" src={icons.SANDTIMER}/>{timeSinceCreation}</span>
                 days ago. This is PR #{descriptionData.descriptionData.pullNumber}; for the repository {descriptionData.descriptionData.repoName}, owned by {descriptionData.descriptionData.repoOwner}.
            </p>
        </div>
    );
}

export const Changes = ({ fileChanges, additions, deletions }: { fileChanges: string, additions: string, deletions: string }) => {
    return (
        <div>
            <h3 className="subheader">Changes</h3>
            <div>
                <p className="description">
                    This Pull Request has had:
                    <ul>
                        <li><span className="files-added"><img className="icon" src={icons.FILES_ADDED}/>{fileChanges} files change(s)</span></li>
                        <li><span className="addition"><img className="icon" src={icons.ADDITIONS}/>{additions} additions</span></li>
                        <li><span className="deletion"><img className="icon" src={icons.DELETIONS}/>{deletions} deletions</span></li>
                    </ul>
                </p>
            </div>
        </div>
    );
}

export const Info = ({numComments} : {numComments: string}) => {
    return (
        <div>
        <h3 className="subheader">Information</h3>
        <p className="description">
            This Pull Request has 
            <span className="comments"><img className="icon" src={icons.COMMENTS}/>{numComments} comments</span>
        </p>
    </div>
    );
}

export const Status = ({status}: {status: string}) => {

    const clazzName = getCssStyleOrIcon(status, "css");
    const icon = getCssStyleOrIcon(status, "icons");

    return (
        <div>
            <h3 className="subheader">Status</h3>
            <p className="description">
                The status of the pull request as seen on Github is 
                <span className={clazzName}><img className="icon" src={icon}/>{status}</span>
            </p>
        </div>
    );
}

export const Reviewers = ({reviewers}: {reviewers: any}) => {
    return (

        <div>
            <h3 className="subheader">Reviewers</h3>
            <p className="description">
                <ul>
                    {reviewers.map((reviewer: any) => (
                        <li>
                            <span className="default-option" style={{color: reviewer.textColor, backgroundColor: reviewer.fillColor}}><img className="icon" src={reviewer.iconUrl}/>{reviewer.value}</span>
                        </li>
                    ))}
                </ul>
            </p>
        </div>
    );
}

const getCssStyleOrIcon = (status: string, content: string) => {
    let ColorIconPicker;
    switch (content) {
        case "css": 
            ColorIconPicker = PrStatusCssClazz;
            break;
        case "icons":
            ColorIconPicker = PrStatusIcons;
            break;
        default:
            ColorIconPicker = PrStatusIcons;
            break;
    }
    
    switch (status) {
        case PrStatus.APPROVED:
            return ColorIconPicker.APPROVED;
        case PrStatus.CHANGES_REQUESTED:
            return ColorIconPicker.CHANGES_REQUESTED;
        case PrStatus.COMMENTED:
            return ColorIconPicker.COMMENTED;
        case PrStatus.CLOSED:
            return ColorIconPicker.CLOSED;
        case PrStatus.NO_REVIEW:
            return ColorIconPicker.NO_REVIEW;
        case PrStatus.IN_REVIEW:
            return ColorIconPicker.IN_REVIEW;
        case PrStatus.MERGED:
            return ColorIconPicker.MERGED;
        default:
            return ColorIconPicker.NO_REVIEW;
    }
}
