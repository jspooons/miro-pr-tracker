export const ADDITIONS = "https://cdn-icons-png.flaticon.com/512/992/992651.png";
export const DELETIONS = "https://cdn-icons-png.flaticon.com/512/66/66889.png";
export const FILES_ADDED = "https://cdn-icons-png.flaticon.com/512/1090/1090923.png";
export const COMMENTS = "https://cdn-icons-png.flaticon.com/512/2190/2190552.png";
export const SANDTIMER = "https://cdn-icons-png.flaticon.com/512/2027/2027595.png";

enum PrStatusColorPrimary {
    APPROVED = "#0d750d",
    CHANGES_REQUESTED = "#e6c300",
    COMMENTED = "#FFA500",
  
    CLOSED = "#FF0000",
    NO_REVIEW = "#525252",
    IN_REVIEW = "#002eab",
    MERGED = "#5a00a3",
  }
  
enum PrStatusColorSecondary {
    APPROVED = "#a5e8b7",
    CHANGES_REQUESTED = "#f5deb3",
    COMMENTED = "#f5deb3",
  
    CLOSED = "#e6aba3",
    NO_REVIEW = "#b8b8b8",
    IN_REVIEW = "#a8c0ff",
    MERGED = "#d8a8ff",
  }
  
enum CreationDateStatusPrimary {
    GREEN = "#0d750d",
    AMBER = "#FFA500",
    RED = "#FF0000"
  }

 enum CreationDateStatusSecondary {
    GREEN = "#a5e8b7",
    AMBER = "#f5deb3",
    RED = "#e6aba3"
  }

enum PrStatus {
    // pr review statuses
    APPROVED = "APPROVED",
    CHANGES_REQUESTED = "CHANGES_REQUESTED",
    COMMENTED = "COMMENTED",

    // for custom status for miro
    CLOSED = "Closed",
    NO_REVIEW = "No Review",
    IN_REVIEW = "In Review",
    MERGED = "Merged"
}

enum PrStatusIcons {
    APPROVED = "https://cdn-icons-png.flaticon.com/512/3002/3002398.png",
    CHANGES_REQUESTED = "https://cdn-icons-png.flaticon.com/512/3591/3591279.png",
    COMMENTED = "https://cdn-icons-png.flaticon.com/512/4526/4526877.png",

    CLOSED = "https://cdn-icons-png.flaticon.com/512/10990/10990611.png",
    NO_REVIEW = "https://cdn-icons-png.flaticon.com/512/11441/11441066.png",
    IN_REVIEW = "https://cdn-icons-png.flaticon.com/512/428/428094.png",
    MERGED = "https://cdn-icons-png.flaticon.com/512/6577/6577243.png"
}

const StatusEnums = {
    PrStatusColorPrimary,
    PrStatusColorSecondary,
    CreationDateStatusPrimary,
    CreationDateStatusSecondary,
    PrStatus,
    PrStatusIcons
}

export const createFields = (data: any) => {
    const { numFilesChanged, numComments, additions, deletions, reviews, customStatus, createdAt } = data;
    return [
      {
        value: `${getDaysSincePullRequestCreation(new Date(createdAt))}d`,
        iconUrl: SANDTIMER,
        iconShape: "square",
        fillColor: getPullRequestCreationDateStatus(new Date(createdAt), false),
        textColor: getPullRequestCreationDateStatus(new Date(createdAt), true),
      },
      {
        value: `${numFilesChanged}`,
        iconUrl: FILES_ADDED,
        iconShape: "square",
        fillColor: "#cfcfcf",
        textColor: "#525252",
      },
      {
        value: `${additions}`,
        iconUrl: ADDITIONS,
        iconShape: "square",
        fillColor: "#085708",
        textColor: "#a5e8b7",
      },
      {
        value: `${deletions}`,
        iconUrl: DELETIONS,
        iconShape: "square",
        fillColor: "#cf1e06",
        textColor: "#e6aba3",
      },
      {
        value: `${numComments}`,
        iconUrl: COMMENTS,
        iconShape: "square",
        fillColor: "#f7bae7",
        textColor: "#c70494",
      },
      {
        value: customStatus,
        iconUrl: getStatusColor(customStatus, "icons"),
        iconShape: "square",
        fillColor: getStatusColor(customStatus, "secondary"),
        textColor: getStatusColor(customStatus, "primary"),
      },
      ...reviews.map((review: any) => ({
        value: review.reviewer,
        iconUrl: getStatusColor(review.decision, "icons"),
        iconShape: "square",
        fillColor: getStatusColor(review.decision, "secondary"),
        textColor: getStatusColor(review.decision, "primary"),
      })),
    ];
  };

const getStatusColor = (status: string, content: string) => {
    let ColorIconPicker;
    switch (content) {
        case "primary": 
            ColorIconPicker = StatusEnums.PrStatusColorPrimary;
            break;
        case "secondary":
            ColorIconPicker = StatusEnums.PrStatusColorSecondary;
            break;
        case "icons":
            ColorIconPicker = StatusEnums.PrStatusIcons;
            break;
        default:
            ColorIconPicker = StatusEnums.PrStatusColorPrimary;
            break;
    }
    
    switch (status) {
        case PrStatus.APPROVED:
            return ColorIconPicker.APPROVED;
        case PrStatus.CHANGES_REQUESTED:
            return ColorIconPicker.CHANGES_REQUESTED;
        case PrStatus.COMMENTED:
            return ColorIconPicker.COMMENTED;
        case PrStatus.CLOSED:
            return ColorIconPicker.CLOSED;
        case PrStatus.NO_REVIEW:
            return ColorIconPicker.NO_REVIEW;
        case PrStatus.IN_REVIEW:
            return ColorIconPicker.IN_REVIEW;
        case PrStatus.MERGED:
            return ColorIconPicker.MERGED;
        default:
            return ColorIconPicker.NO_REVIEW;
    }
}

const getPullRequestCreationDateStatus = (creationDateTime: Date, usePrimary: boolean) => {
    const now = new Date();

    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(now.getDate() - 2);

    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(now.getDate() - 5);

    if (creationDateTime > twoDaysAgo) {
        return usePrimary ? CreationDateStatusPrimary.GREEN : CreationDateStatusSecondary.GREEN;
    } else if (creationDateTime > fiveDaysAgo) {
        return usePrimary ? CreationDateStatusPrimary.AMBER : CreationDateStatusSecondary.AMBER;
    } else {
        return usePrimary ? CreationDateStatusPrimary.RED : CreationDateStatusSecondary.RED;
    }
}

const getDaysSincePullRequestCreation = (creationDateTime: Date) => {
    const now = new Date();

    const diffInTime = now.getTime() - creationDateTime.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    return Math.round(diffInDays);
}