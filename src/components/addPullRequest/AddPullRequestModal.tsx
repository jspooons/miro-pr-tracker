'use client'

import * as React from 'react';

import '../../assets/style.css'
import axios from 'axios';
import Checkbox from '../utility/Checkbox';
import { AddPullRequestModalProps, GithubPullRequest, GithubRepo } from '../types';
import { insertGithubAppCards } from '../utility/appCardsUtility';


export const AddPullRequestModal: React.FC<AddPullRequestModalProps> = ( { repoOwner, repoOwnerType, miroUserId } ) => {

    const [githubRepositories, setGithubRepositories] = React.useState<GithubRepo[]>([]);
    const [selectedGithubRepo, setSelectedGithubRepo] = React.useState<GithubRepo>({name: "", pullRequests: []});
    const [selectedPullRequests, setSelectedPullRequests] = React.useState<GithubPullRequest[]>([]);
    
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

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
    
    React.useEffect(() => {
        getGithubRepositories();
    }, []);

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGithubRepo(JSON.parse(event.target.value));
        setSelectedPullRequests(JSON.parse(event.target.value).pullRequests);
    };

    const onCheck = (isChecked: boolean, pr: GithubPullRequest) => {
        if (isChecked) {
        setSelectedPullRequests((previousState: any) => [...previousState, pr]);
        } else {
            const updatedGitHubIssues = selectedPullRequests.filter(
                (currentIssue: any) => currentIssue.title !== pr.title,
        );
        setSelectedPullRequests([...updatedGitHubIssues]);
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

    return (
        <div>
            <h2>Chose Pull Request</h2>
            <div>
                {isLoading ? 
                    <div className="central-spinner-container"><div className="spinner"></div></div> 
                    : 
                    <div>
                        <label className="label-padding" >Select Github Repository</label>
                        <select className="select" id="repo-select" onChange={(e) => onChange(e)}>
                            {githubRepositories &&
                                githubRepositories.map((option, index) => {
                                    return (
                                        <option
                                            value={JSON.stringify(option)}
                                            key={index}
                                            selected={option.name === selectedGithubRepo.name}
                                        >
                                            {option.name}
                                        </option>
                                    );
                                })
                            }
                        </select>
                        <div>
                            { selectedGithubRepo && selectedGithubRepo.pullRequests.length > 0 ? 
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Pull Request Title</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            selectedGithubRepo.pullRequests.map((pullRequest: any) => (
                                                <tr>
                                                    <td>
                                                        <Checkbox
                                                            onSetChecked={(value) => {onCheck(value, pullRequest);}}
                                                        />
                                                    </td>
                                                    <td>
                                                        <p>{pullRequest.title}</p>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                                :
                                <h3>
                                    This Repository has no Pull Requests
                                </h3>
                            }
                        </div>
                    </div>
                }
            </div>
            <button
                className="button button-primary button-fixed-bottom"
                type="button"
                disabled={selectedPullRequests.length === 0}
                onClick={handleImportClick}
            >
                Add Pull Requests
            </button>
        </div>
    );
};
