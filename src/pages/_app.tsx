import { AppProps } from 'next/app';
import Head from 'next/head';

import Header from '../components/Header';

import '../styles/globals.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <title>spacetraveling | Home</title>
      </Head>

      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
