import {Container, Image, Text} from "@nextui-org/react";
import React from "react";

export const EmptyFavorites = () => {
  return (
    <Container
      css={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 100px)",
        alignItems: "center",
        alignSelf: "center",
      }}
    >
      <Text h1>No hay favoritos</Text>
      <Image
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/404.svg"
        alt="404 Pokemon"
        width={250}
        height={250}
        css={{
          opacity: 0.5,
        }}
      />
    </Container>
  );
};
