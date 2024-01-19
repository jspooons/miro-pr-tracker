'use client'

import * as React from 'react';
import Image from 'next/image';

import syncPrs from '../assets/syncPrs.png';


export const SyncPullRequestsManager: React.FC = () => {
    return (
        <div>
            <Image src={syncPrs} alt="" />
        </div>
    );
}
