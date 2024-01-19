'use client'

import * as React from 'react';
import Image from 'next/image';

import addPullRequests from '../assets/addPullRequests.png';


export const PullRequestManager: React.FC = () => {
    return (
        <div>
            <Image src={addPullRequests} alt="" />
        </div>
    );
}
