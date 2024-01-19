import { useRouter } from 'next/router';

import { AddPullRequestModal } from "../components/AddPullRequestModal";


export default function Main() {

  const router = useRouter();

  const repoOwner = router.query.repoOwner;
  const repoOwnerType = router.query.repoOwner;

  if (!repoOwner || !repoOwnerType || Array.isArray(repoOwner) || Array.isArray(repoOwnerType)) {
    return <div>No repo owner or repo owner type information was parsed</div>;
  } 

  return (
      <div>
          <AddPullRequestModal repoOwner={repoOwner} repoOwnerType={repoOwnerType}/>
      </div>
  );
};