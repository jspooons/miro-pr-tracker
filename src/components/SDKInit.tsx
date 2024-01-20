'use client';

import axios from 'axios';
import {useEffect} from 'react';

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
      }
  
      // Fetch a specific app card by specifying its ID
      const url = `/editPullRequest?miroAppCardId=${appCard.id}?currentStatus=${currentStatus}`;
  
      // Open the modal to display the content of the fetched app card
      miro.board.ui.openModal({
        url,
        width: 520,
        height: 570,
      });
    });
  });

  return null;
};
