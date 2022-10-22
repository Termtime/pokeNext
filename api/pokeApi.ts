import axios from "axios";
import {PokemonListResponse, SmallPokemon} from "../interfaces";

export class PokeApi {
  public static api = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
  });

  public static getPokemonList = async (limit: number = 151) => {
    const {data} = await this.api.get<PokemonListResponse>(
      `/pokemon?limit=${limit}`
    );

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

    return pokemons;
  };
}
