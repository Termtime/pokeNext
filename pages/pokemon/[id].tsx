import {GetStaticProps, GetStaticPaths} from "next";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Layout} from "../../components/layouts";
import {Pokemon} from "../../interfaces";
import {NextPageWithLayout} from "../_app";
import {PokeApi} from "../../api/pokeApi";
import {
  Grid,
  Card,
  Text,
  Button,
  Container,
  Image,
  ButtonProps,
} from "@nextui-org/react";
import {capitalizeFirstLetter, LocalStorageService} from "../../utils";
import confetti from "canvas-confetti";

interface PokemonPageProps {
  pokemon: Pokemon;
}

const PokemonPage: NextPageWithLayout<PokemonPageProps> = ({pokemon}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = useCallback(() => {
    LocalStorageService.toggleFavorite(pokemon.id);
    setIsFavorite(!isFavorite);

    if (isFavorite) return;

    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: -100,
      origin: {y: 0, x: 1},
    });
  }, [isFavorite, pokemon.id]);

  const buttonStyleProps: Partial<ButtonProps> = useMemo(() => {
    return {
      color: isFavorite ? "success" : "gradient",
      children: isFavorite ? "Remove from favorites" : "Add to favorites",
    };
  }, [isFavorite]);

  useEffect(() => {
    const isFav = LocalStorageService.getFavorite(pokemon.id);

    setIsFavorite(isFav);
  }, [pokemon.id]);

  return (
    <Grid.Container css={{marginTop: "5px"}} gap={2}>
      <Grid xs={12} sm={4}>
        <Card isHoverable css={{p: "30px"}}>
          <Card.Body>
            <Card.Image
              src={
                pokemon.sprites.other?.dream_world.front_default ||
                "/no-image.png"
              }
              alt={pokemon.name}
              width="100%"
              height={200}
            />
          </Card.Body>
        </Card>
      </Grid>
      <Grid xs={12} sm={8}>
        <Card>
          <Card.Header css={{display: "flex", justifyContent: "space-between"}}>
            <Text transform="capitalize" h1>
              {pokemon.name}
            </Text>

            <Button ghost onClick={handleFavoriteClick} {...buttonStyleProps} />
          </Card.Header>
          <Card.Body>
            <Text>Sprites:</Text>
            <Container direction="row" display="flex" gap={0}>
              <Image
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                width={100}
                height={100}
              />
              <Image
                src={pokemon.sprites.back_default}
                alt={pokemon.name}
                width={100}
                height={100}
              />
              <Image
                src={pokemon.sprites.front_shiny}
                alt={pokemon.name}
                width={100}
                height={100}
              />
              <Image
                src={pokemon.sprites.back_shiny}
                alt={pokemon.name}
                width={100}
                height={100}
              />
            </Container>
          </Card.Body>
        </Card>
      </Grid>
    </Grid.Container>
  );
};

PokemonPage.getLayout = function getLayout(page) {
  const {pokemon} = page.props.children.props as PokemonPageProps;

  return (
    <Layout title={`PokéNext - ${capitalizeFirstLetter(pokemon.name)}`}>
      {page}
    </Layout>
  );
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const pokemonsByName = await PokeApi.getPokemonList();

  const paths = [
    // Create all phats for the 151 first pokemons by id
    ...pokemonsByName.map((pokemon) => ({
      params: {
        id: pokemon.id,
      },
    })),
    // Create all phats for the 151 first pokemons by name
    ...pokemonsByName.map((pokemon) => ({
      params: {
        id: pokemon.name,
      },
    })),
  ];

  return {
    paths,
    // Allow Incremental Static Generation
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {id: nameOrId} = params as {id: string};

  const pokemon = await PokeApi.getPokemonBasicInfo(nameOrId);

  if (!pokemon) {
    return {
      redirect: {
        destination: "/",
        // This is not permanent, as there could be a new pokemon with the
        // specified id/name in the future
        permanent: false,
      },
    };
  }

  return {
    props: {
      pokemon,
    },
    // Just testing Incremental Static Regeneration
    // Really not needed for this project
    revalidate: 86400, // 24 hours
  };
};

export default PokemonPage;
