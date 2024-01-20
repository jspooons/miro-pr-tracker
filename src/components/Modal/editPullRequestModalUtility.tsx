import React from 'react';

import * as icons from '../../assets/icons';
import { PrStatus, PrStatusIcons } from '../../utils/appCardFieldsUtility';


export enum PrStatusCssClazz {
    APPROVED = "approved",
    CHANGES_REQUESTED = "changes-requested",
    COMMENTED = "commented",

    CLOSED = "closed",
    NO_REVIEW = "no-review",
    IN_REVIEW = "in-review",
    MERGED = "merged"
}


export const Description = ({description, createdAt} : {description: string, createdAt: string}) => {

    const texts = description.split(createdAt);
    const daysSinceCreation = parseInt(createdAt.replace("d", ""));

    let clazzName;
    if (daysSinceCreation <= 2) {
        clazzName = "new";
    } else if (daysSinceCreation <= 5) {
        clazzName = "mid";
    } else {
        clazzName = "old";
    }
    
    return (
        <div>
            <h3 className="subheader">Description</h3>
            <p className="description">
                {texts[0]}
                <span className={clazzName}><img className="icon" src={icons.SANDTIMER}/>{createdAt}</span>
                {texts[1]}
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
                        <li><span className="files-added"><img className="icon" src={icons.FILES_ADDED}/>{fileChanges} file change(s)</span></li>
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

export const getFieldValueDecisionFromIconUrl = (iconUrl: string) => {
    switch (iconUrl) {
        case PrStatusIcons.APPROVED:
            return PrStatus.APPROVED;
        case PrStatusIcons.CHANGES_REQUESTED:
            return PrStatus.CHANGES_REQUESTED;
        case PrStatusIcons.COMMENTED:
            return PrStatus.COMMENTED;
        default:
            return PrStatus.NO_REVIEW;
    }
}
