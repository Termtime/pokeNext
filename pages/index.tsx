import {Grid} from "@nextui-org/react";
import {GetStaticProps} from "next";
import {ReactElement, useEffect} from "react";
import {Layout} from "../components/layouts";
import {NextPageWithLayout} from "./_app";
import {SmallPokemon} from "../interfaces/pokemonList";
import {PokemonCard} from "../components/pokemon/PokemonCard";
import {useContext} from "react";
import {getPokemonList} from "../api/pokeApi";

interface HomePageProps {
  pokemons: SmallPokemon[];
}

const HomePage: NextPageWithLayout<HomePageProps> = ({pokemons}) => {
  return (
    <>
      <Grid.Container gap={2} justify="flex-start">
        {pokemons.map((pokemon) => (
          <PokemonCard pokemon={pokemon} key={pokemon.id} />
        ))}
      </Grid.Container>
    </>
  );
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout title="PokéNext - Pokedex con NextJS">{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const pokemons = await getPokemonList();

  return {
    props: {
      pokemons,
    },
  };
};

export default HomePage;
