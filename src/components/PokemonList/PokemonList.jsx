import React, { useEffect, useState } from "react";
import { fetchData } from "../../services/fetchData";
import { Col, Row, Pagination } from "antd";
import PokemonCard from "../PokemonCard/PokemonCard";
import SearchPokemon from "./SearchPokemon";
import PokemonDetail from "./PokemonDetail";
import ErrorNotification from "../Notifications/ErrorNotification";

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({});
  const [errorNotification, setErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const getPokemonIdByUrl = (url) => {
    const segments = url.split("/");
    const pokemonId = segments[segments.length - 2];
    return pokemonId;
  };

  const getPokemonInfo = async (list) => {
    try {
      const pokemonInfo = await Promise.all(
        list.map(async (pokemon) => {
          const response = await fetchData({
            endpoint: `pokemon/${getPokemonIdByUrl(pokemon.url)}`,
          });
          return response;
        })
      );

      const pokemonList = list.map((pokemon, index) => {
        return {
          name: pokemon.name,
          pokemonImg:
            pokemonInfo[index].sprites.other.dream_world.front_default,
          types: pokemonInfo[index].types,
        };
      });

      return pokemonList;
    } catch (error) {
      setErrorModalData("Error fetching Pokemon info");
    }
  };

  const setErrorModalData = (errorMessage) => {
    setErrorNotification(true);
    setErrorMessage(errorMessage);
  };

  const getData = async () => {
    try {
      const { results: allPokemons, count } = await fetchData({
        endpoint: `pokemon/?limit=20&offset=${(currentPage - 1) * 20}`,
      });
      const pokemonList = await getPokemonInfo(allPokemons);
      setPokemons(pokemonList);
      setTotalPokemons(count);
    } catch (error) {
      setErrorModalData("Error fetching Pokemon info");
    }
  };

  const handleSearchPokemon = async (value) => {
    try {
      if (value) {
        const { results: allPokemons } = await fetchData({
          endpoint: "pokemon/?limit=10000&offset=0",
        });
        const filterPokemons = allPokemons.filter((pokemon) =>
          pokemon.name.includes(value)
        );
        const pokemonList = await getPokemonInfo(filterPokemons);
        setPokemons(pokemonList);
        setTotalPokemons(pokemonList.length);
      } else {
        getData();
      }
    } catch (error) {
      setErrorModalData("Error searching Pokemon");
    }
  };

  useEffect(() => {
    getData();
  }, [currentPage]);

  const onCardClick = async (name) => {
    const pokemon = await fetchData({ endpoint: `pokemon/${name}` });

    setCurrentPokemon({
      name: name,
      pokemonImg: pokemon.sprites.other.dream_world.front_default,
      stats: pokemon.stats,
    });
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const handlePaginatorEvent = (currentPag) => {
    setCurrentPage(currentPag);
    getData();
  };

  return (
    <Row gutter={[0, 24]}>
          <Row style={{ width: "100%" }} align={"end"}>
            <SearchPokemon onSearch={handleSearchPokemon} />
          </Row>
      {pokemons && pokemons.length > 0 && (
        <>
          <Row gutter={[12, 12]}>
            {pokemons.map((pokemon) => (
              <Col span={6}>
                <PokemonCard {...pokemon} onClick={onCardClick} />
              </Col>
            ))}
          </Row>
          <Row align={"center"} style={{ width: "100%" }}>
            <Pagination
              align="center"
              defaultCurrent={1}
              total={totalPokemons}
              onChange={handlePaginatorEvent}
            />
          </Row>
        </>
      )}
      {pokemons && pokemons.length === 0 && (
        <Row align={"center"} style={{ width: "100%" }}>
          <h2>No Encontrado</h2>
        </Row>
      )}
      <ErrorNotification
        message={errorMessage}
        errorNotification={errorNotification}
        setShowError={setErrorNotification}
      />
      <PokemonDetail
        {...currentPokemon}
        openModal={openDetail}
        handleOpenModal={handleCloseDetail}
      />
    </Row>
  );
}
