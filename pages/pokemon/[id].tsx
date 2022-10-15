import {GetStaticProps, GetStaticPaths} from "next";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Layout} from "../../components/layouts";
import {Pokemon} from "../../interfaces";
import {NextPageWithLayout} from "../_app";
import pokeApi from "../../api/pokeApi";
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

interface PokemonPageProps {
  pokemon: Pokemon;
}

export const PokemonPage: NextPageWithLayout<PokemonPageProps> = ({
  pokemon,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = useCallback(() => {
    LocalStorageService.toggleFavorite(pokemon.id);
    setIsFavorite(!isFavorite);
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
  const pokemons151 = Array.from({length: 151}, (_, i) => `${i + 1}`);
  const paths = [
    ...pokemons151.map((id) => ({
      params: {
        id,
      },
    })),
  ];

  return {
    paths,
    // Mostrar 404 si se coloca un id que no existe
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {id} = params as {id: string};

  const {data} = await pokeApi.get<Pokemon>(`/pokemon/${id}`);

  return {
    props: {
      pokemon: data,
    },
  };
};

export default PokemonPage;
