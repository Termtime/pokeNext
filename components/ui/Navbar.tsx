import {
  FormElement,
  Image,
  Link,
  Spacer,
  Text,
  useTheme,
} from "@nextui-org/react";
import React from "react";
import NextLink from "next/link";
import {AutocompleteInput, AutocompleteOption} from "./AutocompleteInput";
import {useRouter} from "next/router";
import {SmallPokemon} from "../../interfaces";
import {useEffect} from "react";
import {getPokemonList} from "../../api/pokeApi";

/**
 * TODO: Este componente es candidato para ser un componente que sea
 * estaticamente generado, cuando esto sea posible en NextJS
 */
export const Navbar = () => {
  const {theme} = useTheme();
  const router = useRouter();
  const [pokemons, setPokemons] = React.useState<SmallPokemon[]>([]);

  useEffect(() => {
    const getPokemons = async () => {
      const pokemons = await getPokemonList();
      setPokemons(pokemons);
    };
    getPokemons();
  }, []);

  const autocompleteOptions: AutocompleteOption[] = pokemons?.map(
    (pokemon) => ({
      value: pokemon,
      label: pokemon.name,
    })
  );

  const onAutocompleteOptionClick = (option: AutocompleteOption) => {
    router.push(`/pokemon/${option.value?.id}`);
  };

  const onAutoCompleteSubmit = (value?: string) => {
    console.log({value});

    if (value) {
      const pokemon = pokemons.find(
        (pokemon) => pokemon.name.toLowerCase() === value.toLowerCase()
      );
      if (pokemon) {
        router.push(`/pokemon/${pokemon.id}`);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "start",
        padding: "0 20px",
        backgroundColor: theme?.colors.gray900.value,
      }}
    >
      <Image
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dream-world/poke-ball.png"
        alt="PokeNext logo"
        width={50}
        height={50}
        css={{
          p: "5px",
        }}
      />
      <NextLink href="/" passHref>
        <Link>
          <Text css={{m: 0}} color="white" h2>
            P
          </Text>
          <Text css={{m: 0}} color="white" h3>
            okémon
          </Text>
        </Link>
      </NextLink>

      <Spacer
        css={{
          flex: 1,
        }}
      />

      <AutocompleteInput
        color="primary"
        bordered
        placeholder="Buscar pokémons..."
        autocompleteOptions={autocompleteOptions}
        onAutocompleteOptionClick={onAutocompleteOptionClick}
        onAutocompleteSubmit={onAutoCompleteSubmit}
      />

      <Spacer css={{flex: 1}} />

      <NextLink href="/favoritos">
        <Link>
          <Text color="white">Favoritos</Text>
        </Link>
      </NextLink>
    </div>
  );
};
