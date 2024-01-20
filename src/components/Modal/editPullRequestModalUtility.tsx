import React from 'react';

import * as icons from '../../assets/icons';


export const Description = ({description, createdAt} : {description?: string, createdAt: string}) => {
    
    const texts = description && description.split(createdAt);
    console.log("TEMP",createdAt);
    
    return (
        <div>
            <h3 className="subheader">Description</h3>
            <p className="description">
                {texts && texts[0]}
                <span className="files-added"><img className="icon" src={icons.SANDTIMER}/>{createdAt}</span>
                {texts && texts[1]}
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

    const icon = "";
    const clazzName = "";

    return (
        <div>
            <h3 className="subheader">Status</h3>
            <p className="description">
                The status of the pull request as seen on Github is 
                <span className="in-review"><img className="icon" src={icons.IN_REVIEW}/>{status}</span>
            </p>
        </div>
    );
}

export const Reviewers = ({reviewers}: {reviewers: any}) => {

    // some sort of mapping for reviewers to icons

    return (
        <div>
            <h3 className="subheader">Reviewers</h3>
            <p className="description">
                <ul>
                    <li><span className="changes-requested"><img className="icon" src={icons.CHANGES_REQUESTED}/>James</span></li>
                    <li><span className="approved"><img className="icon" src={icons.APPROVED}/>Jordan</span></li>
                    <li><span className="commented"><img className="icon" src={icons.COMMENTED}/>Hamza</span></li>
                </ul>
            </p>
        </div>
    );
}
