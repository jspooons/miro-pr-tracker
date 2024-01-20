export interface RepoOwner {
    name: string;
    repoOwnerType: string;
}

interface AddPullRequestModalProps {
    repoOwner: string;
    repoOwnerType: string;
    miroUserId: string;
}

interface GithubRepo {
    name: string;
    pullRequests: GithubPullRequest[];
  }

interface GithubPullRequest {
    title: string;
    pullNumber: number;
}