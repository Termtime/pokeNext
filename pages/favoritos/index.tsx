import {Card, Grid} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {EmptyFavorites, Layout, FavoritePokemonList} from "../../components";
import {LocalStorageService} from "../../utils";
import {NextPageWithLayout} from "../_app";

interface FavoritosPageProps {}

const FavoritosPage: NextPageWithLayout = () => {
  const [favoritePokemons, setFavoritePokemons] = useState<number[]>([]);

  useEffect(() => {
    const favoritePokemons = LocalStorageService.getFavorites();

    setFavoritePokemons(favoritePokemons);
  }, []);

  return (
    <>
      {favoritePokemons.length === 0 && <EmptyFavorites />}
      {favoritePokemons.length > 0 && (
        <FavoritePokemonList pokemons={favoritePokemons} />
      )}
    </>
  );
};

FavoritosPage.getLayout = (page) => {
  return <Layout title="PokéNext - Favoritos">{page}</Layout>;
};
export default FavoritosPage;
