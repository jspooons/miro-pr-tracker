'use client'

import '../assets/style.css';
import React from 'react';

import { GitManager } from '../components/GithubManager';
import { PullRequestManager } from '../components/AddPullRequestsManager';
import { SyncPullRequestsManager } from '../components/SyncPullRequestsManager';

export default function Page() {
  
  const [selectedTab, setSelectedTab] = React.useState("github");

  const handleSelectTab = (value: string) => {
    setSelectedTab(value);
  };

  const renderTab = () => {
    switch (selectedTab) {
      case "github":
        return <GitManager/>;
      case "pullRequests":
        return <PullRequestManager/>;
      case "sync":
        return <SyncPullRequestsManager/>;
      default:
        return <GitManager/>;
    }
  }

  return (
    <div id="root">
        <div className="=cs1 ce12" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
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
                  className={`tab ${selectedTab === "pullRequests" && "tab-active"}`}
                  onClick={() => handleSelectTab("pullRequests")}
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
          <div className="scrollable">
              {renderTab()}
          </div>
          <div className="cs1 ce12 settings-cog">
            <button className="button-icon icon-settings" type="button"></button>
          </div>
        </div>
    </div>
  );
}
