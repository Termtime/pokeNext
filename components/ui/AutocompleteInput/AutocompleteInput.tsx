import React, {useCallback, useEffect, useId, useMemo, useState} from "react";
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
import {SmallPokemon} from "../../../interfaces";
import {capitalizeFirstLetter} from "../../../utils/text";
import styles from "./autocompleteInput.module.css";

export interface AutocompleteOption {
  label: string;
  value: SmallPokemon;
}

interface AutocompleteInputProps extends Partial<InputProps> {
  autocompleteOptions: AutocompleteOption[];
  onAutocompleteOptionClick?: (option: AutocompleteOption) => void;
  onAutocompleteSubmit?: (value?: string) => void;
  suggestionGenerator?: (value: string) => AutocompleteOption[];
}

// TODO: Maybe implement floating-ui in the future.
// Reference: https://codesandbox.io/s/fragrant-water-bsuirj?file=/src/App.tsx
export const AutocompleteInput = ({
  value,
  onChange,
  autocompleteOptions,
  onAutocompleteOptionClick,
  onAutocompleteSubmit,
  suggestionGenerator,
  ...rest
}: AutocompleteInputProps) => {
  const [suggestions, setSuggestions] = useState<AutocompleteOption[]>([]);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [internalValue, setInternalValue] = useState<string>(
    value?.toString() || ""
  );
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] =
    useState<number>(-1);
  const id = useId();
  const {theme} = useTheme();

  useEffect(() => {
    const elements = Array.from(
      document.getElementsByClassName(
        styles.suggestion
      ) as HTMLCollectionOf<HTMLElement>
    );

    setElements(elements);
  }, [suggestions]);

  /**
   * Cleans up suggestions and sets the input value to the selected option
   */
  const cleanupSuggestionsOnSubmit = useCallback((option: string) => {
    cleanupSuggestions();
    setInternalValue(capitalizeFirstLetter(option));
  }, []);

  const handleAutocompleteClick = useCallback(
    (option: AutocompleteOption) => {
      if (onAutocompleteOptionClick) {
        onAutocompleteOptionClick(option);
      }
      cleanupSuggestionsOnSubmit(option.label);
    },
    [cleanupSuggestionsOnSubmit, onAutocompleteOptionClick]
  );

  const cleanupSuggestions = () => {
    setSuggestions([]);
    setFocusedSuggestionIndex(-1);
  };

  const handleSubmit = useCallback(
    (value?: string) => {
      if (onAutocompleteSubmit) {
        onAutocompleteSubmit(value);
        cleanupSuggestionsOnSubmit(capitalizeFirstLetter(value || ""));
      }

      if (focusedSuggestionIndex !== -1) {
        const option = suggestions[focusedSuggestionIndex];
        if (option && onAutocompleteOptionClick) {
          handleAutocompleteClick(option);
        }
      }
    },
    [
      onAutocompleteSubmit,
      focusedSuggestionIndex,
      cleanupSuggestionsOnSubmit,
      suggestions,
      onAutocompleteOptionClick,
      handleAutocompleteClick,
    ]
  );

  const defaultSuggestionGenerator = (text: string) => {
    if (!text || text.length === 0) {
      return [];
    }

    // Because its only one letter, return matches that start specifically with that letter
    if (text.length < 2) {
      return autocompleteOptions
        .filter((option) => option.label.startsWith(text))
        .sort((a, b) => a.label.localeCompare(b.label));
    }

    // Return matches that contains the letters in any part of the string
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

  const handleGenerateSuggestion = (text: string) => {
    if (suggestionGenerator) {
      return suggestionGenerator(text);
    }

    return defaultSuggestionGenerator(text);
  };

  const handleKeyDown = useMemo(() => {
    return (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        if (focusedSuggestionIndex < elements.length - 1) {
          setFocusedSuggestionIndex((prev) => prev + 1);
        } else {
          setFocusedSuggestionIndex(0);
        }
        e.preventDefault();
      }
      if (e.key === "ArrowUp") {
        if (focusedSuggestionIndex > 0) {
          setFocusedSuggestionIndex((prev) => prev - 1);
        } else {
          setFocusedSuggestionIndex(elements.length - 1);
        }

        e.preventDefault();
      }
    };
  }, [elements, focusedSuggestionIndex]);

  const handleOnChange = (e: React.ChangeEvent<FormElement>) => {
    if (onChange) {
      onChange(e);
    } else {
      setInternalValue(e.target.value);
      setFocusedSuggestionIndex(-1);
    }

    // trigger autocomplete logic from suggestions
    setSuggestions(handleGenerateSuggestion(e.target.value || ""));
  };

  const handleBlur = () => {
    // close suggestions
    cleanupSuggestions();
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
          onKeyDown={handleKeyDown}
          onChange={handleOnChange}
          onBlur={handleBlur}
          onFocus={() =>
            setSuggestions(handleGenerateSuggestion(internalValue))
          }
          css={{
            ...rest.css,

            // Needed cause the button has a minWidth of .space[48]
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
                isFocusVisible={i === focusedSuggestionIndex}
                className={styles.suggestion}
                color="default"
                css={{
                  p: 0,
                  m: 3,
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
