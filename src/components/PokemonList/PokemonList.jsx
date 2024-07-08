/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Empty, Pagination, Row, Spin } from "antd";
import React, { useMemo, useState } from "react";
import {
  useGetDataPokemons,
  useGetDataPokemonsByUrl,
} from "../../services/pokemonService";
import PokemonCard from "../PokemonCard/PokemonCard";
import PokemonDetail from "./PokemonDetail";
import SearchPokemon from "./SearchPokemon";

export default function PokemonList() {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({});
  const { data: pokemons = [], isPending } = useGetDataPokemons({
    limit: 500,
    page: 0,
  });
  const { data: allPokemons = [], isPending: isAllPending } =
    useGetDataPokemonsByUrl(pokemons);

  const filterPokemons = useMemo(() => {
    if (search) {
      return allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return allPokemons.slice(page * pageSize, (page + 1) * pageSize);
  });

  const handleOpenDetail = (pokemon) => {
    setCurrentPokemon(pokemon);
    setOpenDetail(true);
  };

  const handleChangePagination = (e) => {
    setPage(e);
  };

  const handleChangeSizePagination = (currentPage, newPageSize) => {
    setPageSize(newPageSize);
  };

  const renderPokemons = () => {
    if (filterPokemons.length === 0 || isPending || isAllPending) {
      const getMessage = () => {
        if (!isAllPending && !isPending) {
          return "No se encontraron resultados...";
        }
        return "";
      };

      return (
        <Spin spinning={isPending || isAllPending} tip="Cargando...">
          <Empty
            description={getMessage()}
            imageStyle={{
              height: 350,
            }}
          />
        </Spin>
      );
    }

    return filterPokemons.map((pokemon) => (
      <Col style={{ width: "100%" }} span={6} key={pokemon.name}>
        <PokemonCard {...pokemon} onClick={() => handleOpenDetail(pokemon)} />
      </Col>
    ));
  };

  return (
    <Row gutter={[32, 32]}>
      <Row style={{ width: "100%" }} align={"center"}>
        <SearchPokemon onSearch={(value) => setSearch(value)} />
      </Row>
      <Row style={{ width: "100%" }} gutter={[24, 24]} align="center">
        {renderPokemons()}
      </Row>
      <Row style={{ width: "100%" }} gutter={[24, 24]} align={"center"}>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={500}
          onChange={handleChangePagination}
          onShowSizeChange={handleChangeSizePagination}
        />
      </Row>

      <PokemonDetail
        {...currentPokemon}
        openModal={openDetail}
        handleOpenModal={() => setOpenDetail(false)}
      />
    </Row>
  );
}
