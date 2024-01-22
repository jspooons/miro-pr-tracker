import { EditPullRequestModal } from "../components/Modal/EditPullRequestModal";


export async function getServerSideProps(context: any) {
  const { miroAppCardId } = context.query;

  // Validate the query parameters here ...

  return {
    props: {
      miroAppCardId
    },
  };
}

export default function Main({ miroAppCardId }: any) {
  
  return (
    <>
      <div>
          <EditPullRequestModal miroAppCardId={miroAppCardId as string}/>
      </div>
    </>
  );
};
