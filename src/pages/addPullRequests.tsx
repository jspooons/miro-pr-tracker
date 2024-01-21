import { Head } from "next/document";
import { AddPullRequestsModal } from "../components/Modal/AddPullRequestsModal";


export async function getServerSideProps(context: any) {
  const { repoOwner, repoOwnerType, miroUserId } = context.query;

  // Validate the query parameters here ...

  return {
    props: {
      repoOwner,
      repoOwnerType,
      miroUserId,
    },
  };
}

// @ts-ignore
export default function Main({ repoOwner, repoOwnerType, miroUserId }) {

  return (
    <>
      <div className="container">
        <Head>
          <title>Miro camera upload</title>
        </Head>
        <div>
          <AddPullRequestsModal repoOwner={repoOwner} repoOwnerType={repoOwnerType} miroUserId={miroUserId}/>
        </div>
      </div>
    </>
  );
};