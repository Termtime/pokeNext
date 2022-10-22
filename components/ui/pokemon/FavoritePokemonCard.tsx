import {Card} from "@nextui-org/react";
import {useRouter} from "next/router";
import React from "react";

export interface FavoritePokemonCardProps {
  pokemonId: number;
}

export const FavoritePokemonCard = ({pokemonId}: FavoritePokemonCardProps) => {
  const router = useRouter();

  const onFavoriteClicked = () => {
    router.push(`/pokemon/${pokemonId}`);
  };

  return (
    <Card
      isHoverable
      isPressable
      css={{padding: 10}}
      onClick={onFavoriteClicked}
    >
      <Card.Image
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`}
        width={"100%"}
        height={140}
      />
    </Card>
  );
};
