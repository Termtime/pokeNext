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
import {
  AutocompleteInput,
  AutocompleteOption,
} from "./AutocompleteInput/AutocompleteInput";
import {useRouter} from "next/router";
import {SmallPokemon} from "../../interfaces";
import {useEffect} from "react";
import {PokeApi} from "../../api";

/**
 * TODO: This component is a candidate to be a statically generated component,
 * whenever this becomes possible in NextJS
 */
export const Navbar = () => {
  const {theme} = useTheme();
  const router = useRouter();
  const [pokemons, setPokemons] = React.useState<SmallPokemon[]>([]);

  useEffect(() => {
    const getPokemons = async () => {
      const pokemons = await PokeApi.getPokemonList();
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
    router.push(`/pokemon/${option.value?.name}`);
  };

  const onAutoCompleteSubmit = (value?: string) => {
    if (value) {
      router.push(`/pokemon/${value}`);
    }
  };

  const customSuggestionGenerator = (text: string) => {
    if (!text || text.length === 0) {
      return [];
    }

    const byId = autocompleteOptions.filter(
      (option) => option.value?.id === text
    );

    // Because its only one letter, return matches that start specifically with that letter
    if (text.length < 2) {
      const byName = autocompleteOptions
        .filter((option) => option.label.startsWith(text))
        .sort((a, b) => a.label.localeCompare(b.label));

      return [...byId, ...byName];
    }

    // Return matches that contains the letters in any part of the string
    const byName = autocompleteOptions
      .filter((option) => {
        const value = option.label;
        return value.toLowerCase().includes(text.toLowerCase());
      })
      .slice(0, 5)
      .sort((a, b) => {
        const valueA = a.label;
        const valueB = b.label;

        return valueA.localeCompare(valueB);
      });

    return [...byId, ...byName];
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
            okéNext
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
        suggestionGenerator={customSuggestionGenerator}
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
