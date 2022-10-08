import {Grid} from "@nextui-org/react";
import {GetStaticProps} from "next";
import {ReactElement} from "react";
import {Layout} from "../components/layouts";
import {NextPageWithLayout} from "./_app";
import {pokeApi} from "../api";
import {PokemonListResponse, SmallPokemon} from "../interfaces/pokemonList";
import Image from "next/image";
import {PokemonCard} from "../components/pokemon/PokemonCard";

interface HomeProps {
  pokemons: SmallPokemon[];
}

const Home: NextPageWithLayout<HomeProps> = ({pokemons}) => {
  console.log({pokemons});
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

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout title="PokéNext - Pokedex con NextJS">{page}</Layout>;
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const {data} = await pokeApi.get<PokemonListResponse>("/pokemon?limit=151");
  console.log({data});

  const pokemons = data.results.map<SmallPokemon>((pokemon) => {
    const id = pokemon.url.match(/(?<=\/)[0-9]+(?=\/$)/)?.[0];

    if (!id) {
      throw new Error("No se pudo obtener el id del pokemon");
    }

    const img = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

    return {
      name: pokemon.name,
      url: pokemon.url,
      id,
      img,
    };
  });

  return {
    props: {
      pokemons,
    },
  };
};

export default Home;
