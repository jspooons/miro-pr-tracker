'use client';

import dotenv from 'dotenv';
import axios from 'axios';
import {useEffect} from 'react';

dotenv.config({ path: '.env' });

export const MiroSDKInit = () => {
  useEffect(() => {
    miro.board.ui.on('icon:click', async () => {
      await miro.board.ui.openPanel({url: '/'});
    });

    miro.board.ui.on("items:delete", (event) => {
      const appCardIds = event.items.filter((item) => item.type ==="app_card").map((appCard) => appCard.id);
      
      axios.delete(`/api/pullRequest`, {
        data: {
          miroAppCardIds: appCardIds
        }
      });
    });

    miro.board.ui.on("app_card:open", (event) => {
      const { appCard } = event;
      let currentStatus;
  
      if (appCard.fields) {
        currentStatus = appCard.fields[0].value;
      };

      miro.board.ui.openModal({
        url: `http://localhost:3000/editPullRequest?miroAppCardId=${appCard.id}&currentStatus=${currentStatus}`,
        width: 520,
        height: 570,
      });
    });
  });

  return null;
};
