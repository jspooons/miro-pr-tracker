export interface RepoOwner {
    name: string;
    repoOwnerType: string;
}

export interface AddPullRequestModalProps {
    repoOwner: string;
    repoOwnerType: string;
    miroUserId: string;
}

export interface EditPullRequestModalProps {
    miroAppCardId: string;
    currentStatus: string;
}

interface GithubRepo {
    name: string;
    pullRequests: GithubPullRequest[];
  }

interface GithubPullRequest {
    title: string;
    pullNumber: number;
}