'use client'

import * as React from 'react';
import Image from 'next/image';

import pullRequestTrackerInitial from '../assets/PullRequestTrackerInitial.png';


export const GitManager: React.FC = () => {

    const [token, setToken] = React.useState<string>();
    const [repoOwner, setRepoOwner] = React.useState<string>();
    const [isRepoOwnerUser, setIsRepoOwnerUser] = React.useState<boolean>(true);
    const [isRepoOwnerOrg, setIsRepoOwnerOrg] = React.useState<boolean>(false);

    const handleSubmitToken = (event: React.FormEvent<HTMLFormElement>) => {};

    const handleSubmitRepoOwner = (event: React.FormEvent<HTMLFormElement>) => {};

    const handleRadioButtons = () => {
        setIsRepoOwnerUser(!isRepoOwnerUser);
        setIsRepoOwnerOrg(!isRepoOwnerOrg);
    }

    return (
        <div>
            <Image src={pullRequestTrackerInitial} alt="" />
            <p>Add Github Pull Requests to your Miro Board and track their status. To get started, generate your token on Github and enter it below. Then set the repository owner and owner type below to begin!</p>
            <hr />
            <form className="grid" onSubmit={handleSubmitToken}>
                <div className="form-group cs1 ce12">
                    <label htmlFor="github-token">Github Token</label>
                    <input
                        className="input form-item"
                        type="text"
                        id="github-token"
                        placeholder="Enter your token"
                        value={token}
                        onChange={(event) => setToken(event.target.value)}
                    />
                    <button type="submit" className="button button-primary">
                        Add Personal Access Token
                    </button>
                </div>
            </form>
            <hr />
            <form className="grid" onSubmit={handleSubmitRepoOwner}>
                <div className="form-group cs1 ce12">
                    <label htmlFor="repo-owner">Repository Owner</label>
                    <input
                        className="input form-item"
                        type="text"
                        id="repo-owner"
                        placeholder="Enter the repository owner"
                        value={repoOwner}
                        onChange={(event) => setRepoOwner(event.target.value)}
                    />
                    <label htmlFor="git-user-type">Repository Owner Type</label>
                    <div id="git-user-type" className="form-item">
                        <label className="radiobutton">
                            <input type="radio" name="radio" checked={isRepoOwnerUser} onChange={handleRadioButtons}/>
                            <span>User</span>
                        </label>
                        <label className="radiobutton">
                            <input type="radio" name="radio" checked={isRepoOwnerOrg} onChange={handleRadioButtons}/>
                            <span>Organisation</span>
                        </label>
                    </div>
                    <button type="submit" className="button button-primary bottom-button">
                        Add Repository Owner
                    </button>
                </div>
            </form>
        </div>
    );
}
