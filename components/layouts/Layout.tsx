import Head from "next/head";
import {Navbar} from "../ui/Navbar";

interface LayoutProps {
  children?: React.ReactNode;
  title?: string;
}

export const Layout = ({children, title}: LayoutProps) => {
  return (
    <>
      <Head>
        <title>{title || "PokéNext App"}</title>
        <meta name="author" content="Mario Mejía" />
        <meta
          name="description"
          content={`Informacion sobre el pokemon: ${title}`}
        />
        <meta
          name="keywords"
          content={`"${title}, pokedex, pokemon, pokemon app"`}
        />
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
