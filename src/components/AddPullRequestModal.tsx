import * as React from 'react';

import '../assets/style.css';


interface AddPullRequestModalProps {
    repoOwner: string;
    repoOwnerType: string;
}

export const AddPullRequestModal: React.FC<AddPullRequestModalProps> = ( { repoOwner, repoOwnerType } ) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const getGithubRepositories = async () => {
        try {
            setIsLoading(true);
        } catch (error) {
            console.log(error);
        }
    };
    
    React.useEffect(() => {
        getGithubRepositories();
    }, []);

    return (
        <div>
            <h2>Chose Pull Request</h2>
            {isLoading ? 
                <div className="central-spinner-container"><div className="spinner"></div></div> 
                : 
                <></>
            }
        </div>
    );
};
