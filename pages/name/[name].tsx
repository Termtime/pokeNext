import {Layout} from "../../components";
import {Pokemon} from "../../interfaces";
import {capitalizeFirstLetter, LocalStorageService} from "../../utils";
import {NextPageWithLayout} from "../_app";
import {GetStaticPaths, GetStaticProps} from "next";
import {PokeApi} from "../../api/pokeApi";
import confetti from "canvas-confetti";
import {
  ButtonProps,
  Grid,
  Card,
  Button,
  Container,
  Text,
  Image,
} from "@nextui-org/react";
import {useState, useCallback, useMemo, useEffect} from "react";

export interface PokemonByNamePageProps {
  pokemon: Pokemon;
}

const PokemonByNamePage: NextPageWithLayout<PokemonByNamePageProps> = ({
  pokemon,
}) => {
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

PokemonByNamePage.getLayout = (page) => {
  const {pokemon} = page.props.children.props as PokemonByNamePageProps;

  return (
    <Layout title={`PokéNext - ${capitalizeFirstLetter(pokemon.name)}`}>
      {page}
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const pokemonsByName = await PokeApi.getPokemonList();

  const paths = [
    ...pokemonsByName.map((pokemon) => ({
      params: {
        name: pokemon.name,
      },
    })),
  ];

  return {
    paths,
    // Show 404 if the page doesn't exist
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {name} = params as {name: string};

  return {
    props: {
      pokemon: await PokeApi.getPokemonBasicInfo(name),
    },
  };
};

export default PokemonByNamePage;
