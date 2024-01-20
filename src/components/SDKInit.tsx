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
  });

  return null;
};
