import Head from "next/head";
import {useRouter} from "next/router";
import {Navbar} from "../ui/Navbar";

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
}

/**
 * Origin (Base URL) of the application.
 *
 * This is needed because if this layout is rendered on the server, `window.location.origin`
 * will give an error, as `window` is undefined.
 */
const origin = typeof window === "undefined" ? "" : window.location.origin;

export const Layout = ({children, title}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "PokéNext App"}</title>
        <meta name="author" content="Mario Mejía" />
        <meta name="description" content={`Information about ${title}`} />
        <meta
          name="keywords"
          content={`"${title}, pokedex, pokemon, pokemon app"`}
        />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`Information about ${title}`} />
        <meta
          property="og:description"
          content={`This is the page about ${title}`}
        />
        <meta property="og:image" content={`${origin}/img/banner.png`} />
      </Head>

      <Navbar />

      <main
        style={{
          padding: "0 20px",
        }}
      >
        {children}
      </main>
    </>
  );
};
