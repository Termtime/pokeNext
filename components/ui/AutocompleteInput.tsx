import React, {ChangeEvent, useId, useState} from "react";
import {
  Button,
  Container,
  FormElement,
  Image,
  Input,
  InputProps,
  Text,
  useTheme,
} from "@nextui-org/react";
import {SmallPokemon} from "../../interfaces";
import {capitalizeFirstLetter} from "../../utils/text";

export interface AutocompleteOption {
  label: string;
  value: SmallPokemon;
}

interface AutocompleteInputProps extends Partial<InputProps> {
  autocompleteOptions: AutocompleteOption[];
  onAutocompleteOptionClick?: (option: AutocompleteOption) => void;
  onAutocompleteSubmit?: (value?: string) => void;
}

export const AutocompleteInput = ({
  value,
  onChange,
  autocompleteOptions,
  onAutocompleteOptionClick,
  onAutocompleteSubmit,
  ...rest
}: AutocompleteInputProps) => {
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
  const [internalValue, setInternalValue] = useState<string>(
    value?.toString() || ""
  );
  const id = useId();
  const {theme} = useTheme();

  const handleSubmit = (value?: string) => {
    if (onAutocompleteSubmit) {
      onAutocompleteSubmit(value);
    }
    setSuggestions([]);
    setInternalValue(capitalizeFirstLetter(value || ""));
  };

  const generateSuggestions = (text: string) => {
    if (!text || text.length === 0) {
      return [];
    }

    // Ya que solo es una letra, devolver matches que comiencen especificamente con esa letra
    if (text.length < 2) {
      return autocompleteOptions
        .filter((option) => option.label.startsWith(text))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    // Devolver matches que contengan las letras en cualquier orden
    return autocompleteOptions
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
  };

  const handleOnChange = (e: React.ChangeEvent<FormElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
    }

    // trigger autocomplete logic from suggestions
    setSuggestions(generateSuggestions(e.target.value || ""));
  };

  const handleAutocompleteClick = (option: AutocompleteOption) => {
    if (onAutocompleteOptionClick) {
      onAutocompleteOptionClick(option);
    }
    setInternalValue(capitalizeFirstLetter(option.label));
    setSuggestions([]);
  };

  return (
    <Container
      css={{
        position: "relative",
        p: 0,
        width: "fit-content",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(internalValue);
        }}
      >
        <Input
          type="text"
          aria-label="Search"
          {...rest}
          value={internalValue}
          onChange={handleOnChange}
          css={{
            ...rest.css,
            // Necesario ya que el button tiene un minWidth de .space[48]
            minWidth: theme?.space[52]?.value,
          }}
        />
        <input type="submit" hidden />
        <Container
          direction="column"
          display="flex"
          css={{
            p: 0,
            position: "absolute",
            zIndex: 1,
            backgroundColor: theme?.colors.accents1,
            border:
              (suggestions.length > 0 &&
                `2px solid ${theme?.colors.accents3.value}`) ||
              "none",
          }}
        >
          {suggestions.map((suggestion, i) => {
            const suggestionValue = suggestion.value;
            const suggestionLabel = suggestion.label;
            return (
              <Button
                flat
                color="default"
                css={{
                  p: 0,
                  m: 0,
                  color: "White",
                  border: "none",
                  borderRadius: "0px",
                  backgroundColor: theme?.colors.accents1,
                }}
                onClick={() => handleAutocompleteClick(suggestion)}
                key={`${id}-${suggestionLabel}-${i}`}
              >
                {suggestionValue && typeof suggestionValue === "object" && (
                  <Image
                    src={suggestionValue.img}
                    alt={`Sugerencia - ${suggestion.value.name}`}
                    width={24}
                    height={24}
                  />
                )}
                <Text transform="capitalize" css={{p: 10}}>
                  {suggestionLabel}
                </Text>
              </Button>
            );
          })}
        </Container>
      </form>
    </Container>
  );
};
