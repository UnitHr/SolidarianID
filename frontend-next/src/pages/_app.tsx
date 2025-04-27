import { AuthProvider } from '@/lib/context/AuthContext'; 
import type { AppProps } from 'next/app';
import {Footer} from '@/components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SolidarianNavbar = dynamic(() => import('@/components/SolidarianNavbar'), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>SolidarianID</title>
      </Head>
      <Suspense fallback={<p>Loading Navbar...</p>}>
        <SolidarianNavbar />
      </Suspense>
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
