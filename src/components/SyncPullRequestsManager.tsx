'use client'

import * as React from 'react';
import Image from 'next/image';
import axios from 'axios';

import syncPrs from '../assets/syncPrs.png';
import '../../src/assets/style.css';
import { updateGithubAppCards } from './utility/appCardsUtility';


export const SyncPullRequestsManager: React.FC = () => {

    const handleClick = async () => {
        const miroBoardId = (await miro.board.getInfo()).id;
        const result = await axios.get(`/api/pullRequestMappings?miroBoardId=${miroBoardId}`);
        await updateGithubAppCards(result.data);
    }

    return (
        <div>
            <Image src={syncPrs} alt="" />
            <p className="paragraph">If you have made changes to your pull requests directly on Github you need to click the 'Sync now' button to keep your board up to date!</p>
            <hr/>
                <button
                    className="cs1 ce12 button button-primary"
                    type="button"
                    onClick={handleClick}
                >
                    Sync Pull Requests
                </button>
        </div>
    );
}
