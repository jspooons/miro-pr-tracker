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


export default function Main({ repoOwner, repoOwnerType, miroUserId }: any) {

  return (
    <>
      <div className="container">
        <div>
          <AddPullRequestsModal repoOwner={repoOwner} repoOwnerType={repoOwnerType} miroUserId={miroUserId}/>
        </div>
      </div>
    </>
  );
};