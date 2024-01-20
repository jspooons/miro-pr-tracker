import { useRouter } from 'next/router';

import { EditPullRequestModal } from "../components/Modal/EditPullRequestModal";
import Head from 'next/head';



export default function Main() {

  const router = useRouter();

  const miroAppCardId = router.query.miroAppCardId;
  
  return (
    <>
      <Head>
        <script src="https://miro.com/app/static/sdk/v2/miro.js"></script>
      </Head>
      <div>
          <EditPullRequestModal miroAppCardId={miroAppCardId as string}/>
      </div>
    </>
  );
};
