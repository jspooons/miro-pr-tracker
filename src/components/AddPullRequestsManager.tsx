'use client'

import * as React from 'react';
import Image from 'next/image';

import '../assets/style.css';
import addPullRequests from '../assets/addPullRequests.png';
import axios from 'axios';
import { RepoOwner } from './types';


export const PullRequestManager: React.FC = () => {

    const [repoOwners, setRepoOwners] = React.useState<RepoOwner[]>();
    const [selectedRepoOwner, setSelectedRepoOwner] = React.useState<RepoOwner>({name: "", repoOwnerType: ""});

    const handleClick = async () => {
        if (await miro.board.ui.canOpenModal()) {
            const miroUserId = (await miro.board.getUserInfo()).id;
            await miro.board.ui.openModal({
                url: `/addPullRequests?repoOwner=${selectedRepoOwner.name}&repoOwnerType=${selectedRepoOwner.repoOwnerType}&miroUserId=${miroUserId}`,
                width: 900,
                height: 600,
                fullscreen: false,
            });
        }
    };

    const onSelect = (event: any, repoOwner: any) => {
        event.target.checked && setSelectedRepoOwner(repoOwner);
    }

    const getRepositoryOwners = async () => {
        const miroBoardId = (await miro.board.getInfo()).id;
        const results = await axios.get(`/api/repositories/owners?miroBoardId=${miroBoardId}`);
        setRepoOwners(results.data);
        setSelectedRepoOwner(results.data[0]);
    };

    React.useEffect(() => {
        getRepositoryOwners();
    }, []);

    return (
        <div>
            <Image src={addPullRequests} alt="" />
            <p className="paragraph">Your tracked repository owners can be found here. Select one and click the 'Select Pull Requests' button to select some Pull Requests to track.</p>
            <div>
            { repoOwners ? 
                <div className="table-container">
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
                                            onClick={(event: any) => onSelect(event, repoOwner)}
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
                </div>
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
