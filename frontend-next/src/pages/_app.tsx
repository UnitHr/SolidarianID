import { AuthProvider } from '@/lib/context/AuthContext'; 
import type { AppProps } from 'next/app';
import {Footer} from '@/components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import Head from 'next/head';
import SolidarianNavbar from '@/components/SolidarianNavbar';


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Head>
        <title>SolidarianID</title>
      </Head>
        <SolidarianNavbar />
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  );
}

export default MyApp;
