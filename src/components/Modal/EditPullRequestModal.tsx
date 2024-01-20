'use client'
import * as React from 'react';

import '../../assets/style.css'
import { EditPullRequestModalProps } from '../types';
import { AppCard } from '@mirohq/websdk-types';

        //@ts-ignore

export const EditPullRequestModal: React.FC<EditPullRequestModalProps> = ( { miroAppCardId, currentStatus } ) => {
    
    const getAppCard = async () => {
        //@ts-ignore
        const appCard = await miro.board.getById(miroAppCardId) as AppCard;
        console.log("HELLO", appCard.fields);
    }

    React.useEffect(() => {
        getAppCard();
    }, [])
    
    return (
        <div>
            Hello
        </div>
    )
}
