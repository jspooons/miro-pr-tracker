import { useRouter } from 'next/router';

import Head from 'next/head';
import { EditPullRequestModal } from '../components/Modal/EditPullRequestModal';


export default function Main() {

  const router = useRouter();

  const miroAppCardId = router.query.miroAppCardId;
  const currentStatus = router.query.currentStatus;

  if (!miroAppCardId || Array.isArray(miroAppCardId)) {
    return <div>Invalid or missing miroAppCardId</div>;
  } 

  if (!currentStatus || Array.isArray(currentStatus)) {
    return <div>Invalid or missing currentStatus</div>;
  }

  return (
    <div>
      <Head>
        <script src="https://miro.com/app/static/sdk/v2/miro.js"></script>
      </Head>
      <div>
          <EditPullRequestModal miroAppCardId={miroAppCardId} currentStatus={currentStatus}/>
      </div>
    </div>
  );
};