import { useRouter } from 'next/router';

import { EditPullRequestModal } from "../components/Modal/EditPullRequestModal";



export default function Main() {

  const router = useRouter();

  const miroAppCardId = router.query.miroAppCardId;
  
  return (
    <>
      <div>
          <EditPullRequestModal miroAppCardId={miroAppCardId as string}/>
      </div>
    </>
  );
};
