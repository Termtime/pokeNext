export interface PokemonListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: PokemonReference[];
}

export interface PokemonReference {
  name: string;
  url: string;
}

export interface SmallPokemon extends PokemonReference {
  id: string;
  img: string;
}
