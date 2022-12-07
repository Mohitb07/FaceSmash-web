import Sidebar from '../components/Sidebar';
import { Meta } from '../layouts/Meta';
import { Main } from '../templates/Main';

export default function Home() {
  return (
    <Main
      meta={
        <Meta
          title="FaceSmash"
          description="It's a social media platform for users to interact with their friends."
        />
      }
    >
      <div className="flex">
        <Sidebar />
        <div>
          <main>
            <h1 className="text-primary-100">Center</h1>
          </main>
          <aside>
            <h1>Right Hand side</h1>
          </aside>
        </div>
      </div>
    </Main>
  );
}
