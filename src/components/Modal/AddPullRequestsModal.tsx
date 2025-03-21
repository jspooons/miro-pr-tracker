'use client'
import * as React from 'react';
import axios from 'axios';

import '../../assets/style.css'

import Select from '../base/Select';
import Checkbox from '../base/Checkbox';
import { GithubRepo, GithubPullRequest, AddPullRequestModalProps } from '../types';
import { insertGithubAppCards } from '../utility/appCardsUtility';


export const AddPullRequestsModal: React.FC<AddPullRequestModalProps> = ( { repoOwner, repoOwnerType, miroUserId } ) => {
    
    const [githubRepositories, setGithubRepositories] = React.useState<GithubRepo[]>([]);
    const [selectedGithubRepo, setSelectedGithubRepo] = React.useState<GithubRepo>({name: "", pullRequests: []});
    const [selectedPullRequests, setSelectedPullRequests] = React.useState<GithubPullRequest[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
    
    const getGithubRepositories = async () => {
        try {
            setIsLoading(true);
            const results = await axios.get(`/api/repositories?miroUserId=${miroUserId}&repoOwner=${repoOwner}&repoOwnerType=${repoOwnerType}`);
            const repos = results.data.repositories;
            setGithubRepositories(repos);
            setSelectedGithubRepo(repos[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); 
        }
    };

    const handleImportClick = async () => {
        try {
            await insertGithubAppCards(selectedPullRequests, repoOwner, selectedGithubRepo.name);
            await miro.board.ui.closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        getGithubRepositories();
    }, []);

    const handlePullRequestSelect = (isChecked: boolean, pr: GithubPullRequest) => {
        if (isChecked) {
            setSelectedPullRequests((previousState: any) => [...previousState, pr]);
            setCheckedItems((previousState: any) => ({...previousState, [pr.title]: true}));
        } else {
            setCheckedItems((previousState: any) => ({...previousState, [pr.title]: false}));
            const updatedGithubIssues = selectedPullRequests.filter(
                (currentIssue: any) => currentIssue.title !== pr.title,
            );
            setSelectedPullRequests([...updatedGithubIssues]);
        }
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGithubRepo(JSON.parse(event.target.value));
        setCheckedItems({});
        setSelectedPullRequests([]);
    };

    return (
        <div className="modal-container" style={{display: "flex", width: "100%", height: "100%", flexDirection: "column"}}>
            <h2>Choose from Github</h2>
            {isLoading ? 
                <div className="central-spinner-container"><div className="spinner"></div></div> : 
                <>
                    <Select
                        label="Select Github Repository"
                        required={false}
                        options={githubRepositories}
                        onChange={handleSelectChange}
                    />
                    {selectedGithubRepo && selectedGithubRepo.pullRequests.length > 0 ? 
                        <div className="table-container">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Pull Request</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        selectedGithubRepo.pullRequests.map((pullRequest: any) => (
                                            <tr>
                                                <td>
                                                    <Checkbox
                                                        isChecked={checkedItems[pullRequest.title] || false}
                                                        onSetChecked={(value) => handlePullRequestSelect(value, pullRequest)}
                                                    />
                                                </td>
                                                <td>
                                                    {pullRequest.title}
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        : 
                        <h3>
                            This Repository has no Pull Requests    
                        </h3>
                    }
                </>
            }
            <button
                className="button button-primary button-fixed-bottom"
                type="button"
                disabled={selectedPullRequests.length === 0}
                onClick={handleImportClick}
            >
                Select Pull Request
            </button>
        </div>
    );
}
            