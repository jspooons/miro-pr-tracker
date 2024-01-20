import { useRouter } from 'next/router';

import { AddPullRequestsModal } from "../components/Modal/AddPullRequestsModal";
import Head from 'next/head';
import Script from 'next/script';


export default function Main() {

  const router = useRouter();

  const repoOwner = router.query.repoOwner;
  const repoOwnerType = router.query.repoOwnerType;
  const miroUserId = router.query.miroUserId;

  if (!repoOwner || Array.isArray(repoOwner)) {
    return <div>Invalid or missing repoOwner</div>;
  } 

  if (!repoOwnerType || Array.isArray(repoOwnerType)) {
    return <div>Invalid or missing repoOwnerType</div>;
  } 

  if (!miroUserId || Array.isArray(miroUserId)) {
    return <div>Invalid or missing miroUserId</div>;
  }
  
  return (
    <>
      <Head>
        <Script src="https://miro.com/app/static/sdk/v2/miro.js"></Script>
      </Head>
      <div>
          <AddPullRequestsModal repoOwner={repoOwner} repoOwnerType={repoOwnerType} miroUserId={miroUserId}/>
      </div>
    </>
  );
};