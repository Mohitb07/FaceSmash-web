import '../../styles/globals.css';
import type { AppProps } from 'next/app';
import Sidebar from '../components/Sidebar';
import BottomNavigation from '../components/BottomNavigation';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className='relative'>
      <div>
        <Sidebar />
      </div>
      <div className='bg-slate-900 fixed z-50 bottom-0 w-full'>
        <BottomNavigation/>
      </div>
      <Component {...pageProps} />
    </div>
  );
}
