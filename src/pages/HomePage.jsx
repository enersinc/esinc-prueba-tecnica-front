import { Row } from "antd";
import React from "react";
import PokemonList from "../components/PokemonList/PokemonList";

export default function HomePage() {
  return (
    <Row>
      <PokemonList />
    </Row>
  );
}
