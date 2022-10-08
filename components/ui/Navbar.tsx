import {Link, Spacer, Text, useTheme} from "@nextui-org/react";
import Image from "next/image";
import React from "react";
import NextLink from "next/link";

export const Navbar = () => {
  const {theme, isDark} = useTheme();

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
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png"
        alt="Pokemon-static logo"
        width={70}
        height={70}
      />

      <NextLink href="/">
        <Link>
          <Text color="white" h2>
            P
          </Text>
          <Text color="white" h3>
            okémon
          </Text>
        </Link>
      </NextLink>

      <Spacer
        css={{
          flex: 1,
        }}
      />
      <NextLink href="/favoritos">
        <Link>
          <Text color="white">Favoritos</Text>
        </Link>
      </NextLink>
    </div>
  );
};
