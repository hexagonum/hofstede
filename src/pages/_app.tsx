import '@/styles/globals.scss';
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  BarElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import type { AppProps } from 'next/app';
import Head from 'next/head';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const App: React.FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Hofstede</title>
        <meta
          name="description"
          content="Geert Hofstede - The 6 Dimension Model of National Culture"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default App;
