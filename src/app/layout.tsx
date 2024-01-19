'use client'

import '../assets/style.css';
import React from 'react';
import Script from 'next/script';

import {MiroSDKInit} from '../components/SDKInit';

export default function RootLayout() {
  
  const [selectedTab, setSelectedTab] = React.useState("github");

  const handleSelectTab = (value: string) => {
    setSelectedTab(value);
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "github":
        return <></>;
      case "miro":
        return <></>;
      case "sync":
        return <></>;
      default:
        return <></>;
    }
  }

  return (
    <html>
      <body>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
        <MiroSDKInit />
        <div id="root">
          <div className="=cs1 ce12">
            <div className="tabs">
              <div className="tabs-header-list">
                <div
                  tabIndex={0}
                  className={`tab ${selectedTab === "github" && "tab-active"}`}
                  onClick={() => handleSelectTab("github")}
                >
                  <div className="tab-text tab-badge">Add Owners</div>
                </div>
                <div
                  tabIndex={0}
                  className={`tab ${selectedTab === "miro" && "tab-active"}`}
                  onClick={() => handleSelectTab("miro")}
                >
                  <div className="tab-text tab-badge">Add Pr's</div>
                </div>
                <div
                  tabIndex={0}
                  className={`tab ${selectedTab === "sync" && "tab-active"}`}
                  onClick={() => handleSelectTab("sync")}
                >
                  <div className="tab-text tab-badge">Sync Pr's</div>
                </div>
              </div>
            </div>
            {renderTab()}
          </div>
        </div>
      </body>
    </html>
  );
}
