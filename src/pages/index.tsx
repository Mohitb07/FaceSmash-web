import { Meta } from '../layouts/Meta';
import {Main} from '../templates/Main';

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
      <div>
        <h1 className="text-primary-100 text-5xl">Hello world</h1>
      </div>
    </Main>
  );
}
