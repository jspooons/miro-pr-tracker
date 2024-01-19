'use client'

import * as React from 'react';
import Image from 'next/image';

import '../assets/style.css';
import addPullRequests from '../assets/addPullRequests.png';
import axios from 'axios';


interface RepoOwner {
    name: string;
    repoOwnerType: string;
}

export const PullRequestManager: React.FC = () => {

    const [repoOwners, setRepoOwners] = React.useState<RepoOwner[]>();
    const [selectedRepoOwner, setSelectedRepoOwner] = React.useState<RepoOwner>({name: "", repoOwnerType: ""});

    const handleClick = async () => {};

    const onSelect = (event: any) => {
        event.target.checked && setSelectedRepoOwner(event.target.value);
    }

    const getRepositoryOwners = async () => {
        const miroBoardId = (await miro.board.getInfo()).id;
        const results = await axios.get(`/api/repositories/owners?miroBoardId=${miroBoardId}`);
        console.log(results);
        setRepoOwners(results.data);
        setSelectedRepoOwner(results.data[0]);
    };

    React.useEffect(() => {
        getRepositoryOwners();
    }, []);

    return (
        <div>
            <Image src={addPullRequests} alt="" />
            <p>Your tracked repository owners can be found here. Select one and click the 'Select Pull Requests' button to select some Pull Requests to track.</p>
            <div>
            { repoOwners ? 
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Repository Owner</th>
                            <th>Owner Type</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        repoOwners.map((repoOwner: RepoOwner) => (
                            <tr>
                                <td>
                                    <input 
                                        type="radio" 
                                        className="radio"
                                        onClick={onSelect}
                                        checked={selectedRepoOwner.name === repoOwner.name}
                                    />
                                </td>
                                <td>
                                    <p>{repoOwner.name}</p>
                                </td>
                                <td>
                                    <p>{repoOwner.repoOwnerType}</p>
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
                : 
                <div className="spinner-container">
                    <div className="spinner"/>
                </div>
            }
            </div>
            <button
                className="cs1 ce12 button button-primary"
                type="submit"
                onClick={handleClick}
            >
                Select Pull Requests
            </button>
        </div>
    );
}
