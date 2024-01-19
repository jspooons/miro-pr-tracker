'use client'

import * as React from 'react';
import Image from 'next/image';

import pullRequestTrackerInitial from '../assets/PullRequestTrackerInitial.png';


export const GitManager: React.FC = () => {
    return (
        <div>
            <Image src={pullRequestTrackerInitial} alt="" />
        </div>
    );
}
