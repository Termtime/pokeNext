import "../styles/globals.css";
import type {AppProps} from "next/app";
import {NextUIProvider} from "@nextui-org/react";
import {darkTheme} from "../themes";
import {NextPage} from "next";
import {ReactElement} from "react";

export type NextPageWithLayout<T = any> = NextPage<T> & {
  getLayout?: (page: ReactElement) => ReactElement;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({Component, pageProps}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <NextUIProvider theme={darkTheme}>
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
