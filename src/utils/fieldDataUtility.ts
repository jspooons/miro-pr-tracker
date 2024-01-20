import axios from "axios";

enum PrStatus {
    // for custom status for miro
    CLOSED = "Closed",
    NO_REVIEW = "No Review",
    IN_REVIEW = "In Review",
    MERGED = "Merged"
}

async function getPullRequest(repoOwner: string, repoName: string, pullNumber: number, accessToken: string) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}`, {
            headers: {
                Authorization: `token ${accessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return response.data;
    }   catch (error: any) {
        console.error("github api /repos/{repoOwner}/{repoName}/pulls/{pullNumber}", error);
        throw new Error(error.message);
    }
}

async function getPullRequestReviews(repoOwner: string, repoName: string, pullNumber: number, accessToken: string) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}/reviews`, {
            headers: {
                Authorization: `token ${accessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return response.data;
    }   catch (error: any) {
        console.error("github api /repos/{repoOwner}/{repoName}/pulls/{pullNumber}", error);
        throw new Error(error.message);
    }
}

async function getPullRequestComments(repoOwner: string, repoName: string, pullNumber: number, accessToken: string) {
    try {
        const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/pulls/${pullNumber}/comments`, {
            headers: {
                Authorization: `token ${accessToken}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });
        return response.data;
    }   catch (error: any) {
        console.error("github api /repos/{repoOwner}/{repoName}/pulls/{pullNumber}", error);
        throw new Error(error.message);
    }
}

function getPullRequestCustomStatus(numReviews: number, mergedBy: any, isOpen: string) {
    if (isOpen === "open") {
        if (numReviews === 0) {
            return PrStatus.NO_REVIEW;
        } else {
            return PrStatus.IN_REVIEW;
        }
    } else {
        if (mergedBy) {
            return PrStatus.MERGED;
        } else {
            return PrStatus.CLOSED;
        }
    }
}

function filterPullRequestReviews(reviews: any, maxReviews: number) {
    // only return unique reviews, for duplicates return the most recent according to submitted_at
    const uniqueReviews: Record<string, any> = {};

    reviews.forEach((review: any) => {
        const login = review.user.login;

        if (!uniqueReviews[login] || new Date(review.submitted_at) > new Date(uniqueReviews[login].submitted_at)) {
            uniqueReviews[login] = review;
        }
    });

    // order the reviews by submitted_at and only keep the maxReviews most recent reviews
    const orderedReviews = Object.values(uniqueReviews).sort((a: any, b: any) =>
        new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );

    // we only want to show the maxReviews most recent reviews as miro appcards only allow 20 custom fields
    const latestReviews = orderedReviews.slice(0, maxReviews);

    // now need to convert tmp into a list
    const finalReviews: any[] = [];
    latestReviews.forEach((review: any) => {
        finalReviews.push({reviewer: review.user.login, decision: review.state});
    });

    return finalReviews;
}

export async function getFieldData(repoOwner: string, repoName: string, pullNumber: number, gitToken: string) {
    const pullRequest = await getPullRequest(repoOwner, repoName, pullNumber, gitToken);
    const reviews = await getPullRequestReviews(repoOwner, repoName, pullNumber, gitToken);
    const comments = await getPullRequestComments(repoOwner, repoName, pullNumber, gitToken);
    const filteredReviews = filterPullRequestReviews(reviews, 14);

    return {
        title: pullRequest.title,
        repoOwner: repoOwner,
        repoName: repoName,
        author: pullRequest.user.login,
        pullNumber: pullNumber,
        numFilesChanged: pullRequest.changed_files,
        numComments: reviews.length + comments.length,
        additions: pullRequest.additions,
        deletions: pullRequest.deletions,
        reviews: filteredReviews,
        customStatus: getPullRequestCustomStatus(reviews.length, pullRequest.merged_by, pullRequest.state),
        createdAt: pullRequest.created_at
    };
}
