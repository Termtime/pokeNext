import {Grid} from "@nextui-org/react";
import React from "react";
import {FavoritePokemonCard} from "./FavoritePokemonCard";

export interface FavoritePokemonListProps {
  pokemons: number[];
}
export const FavoritePokemonList = ({pokemons}: FavoritePokemonListProps) => {
  return (
    <Grid.Container gap={2} direction="row" justify="flex-start">
      {pokemons.map((pokemonId) => (
        <Grid xs={6} sm={3} md={2} xl={1} key={pokemonId}>
          <FavoritePokemonCard pokemonId={pokemonId} />
        </Grid>
      ))}
    </Grid.Container>
  );
};
