import React, { useEffect, useState } from 'react';
import { fetchData } from '../../services/fetchData';
import { Col, Row, notification, Pagination, Empty } from 'antd';
import PokemonCard from '../PokemonCard/PokemonCard';
import SearchPokemon from './SearchPokemon';
import PokemonDetail from './PokemonDetail';

// Función para mostrar notificaciones de error
const showErrorNotification = (message) => {
  notification.error({
    message: 'Error',
    description: message,
  });
};

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const [searchList, setSearchList] = useState([]);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({});

  const getPokemonIdByUrl = (url) => {
    const segments = url.split('/');
    const pokemonId = segments[segments.length - 2];
    return pokemonId;
  };

  const getPokemonInfo = async (list) => {
    try {
      const pokemonPromises = list.map(async (pokemon) => {
        const response = await fetchData({ endpoint: `pokemon/${getPokemonIdByUrl(pokemon.url)}` });
        return response;
      });

      const pokemonInfo = await Promise.all(pokemonPromises);

      const pokemonList = list.map((pokemon, index) => {
        return {
          name: pokemon.name,
          pokemonImg: pokemonInfo[index].sprites.other.dream_world.front_default,
          types: pokemonInfo[index].types,
        };
      });

      return pokemonList;
    } catch (error) {
      showErrorNotification('Error fetching Pokemon info');
      console.error('Error fetching Pokemon info:', error);
    }
  };

  const getData = async (page) => {
    try {
      const { count, results: allPokemons } = await fetchData({
        endpoint: `pokemon/?limit=20&offset=${(page - 1) * 20}`,
      });
      const pokemonList = await getPokemonInfo(allPokemons);
      setPokemons(pokemonList);
      setTotalPokemons(count);
    } catch (error) {
      showErrorNotification('Error fetching data');
      console.error('Error fetching Pokemon info:', error);
    }
  };

  const handleSearchPokemon = async (value) => {
    try {
      if (value) {
        const { results: allPokemons } = await fetchData({ endpoint: 'pokemon/?limit=10000&offset=0' });
        const filterPokemons = allPokemons.filter((pokemon) => pokemon.name.includes(value));
        const pokemonList = await getPokemonInfo(filterPokemons);
        setSearchList(pokemonList);
        setSearchEmpty(pokemonList.length === 0);
      } else {
        setSearchList([]);
        setSearchEmpty(false);
      }
    } catch (error) {
      showErrorNotification('Error searching Pokemon');
      console.error('Error searching Pokemon:', error);
    }
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const onCardClick = async (name) => {
    try {
      const pokemon = await fetchData({ endpoint: `pokemon/${name}` });
      setCurrentPokemon({
        name: name,
        pokemonImg: pokemon.sprites.other.dream_world.front_default,
        stats: pokemon.stats,
      });
      setOpenDetail(true);
    } catch (error) {
      showErrorNotification('Error fetching Pokemon details');
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
  };

  const renderPokemonList = (list) =>
    list.map((pokemon) => (
      <Col span={6} key={pokemon.name}>
        <PokemonCard {...pokemon} onClick={onCardClick} />
      </Col>
    ));

  return (
    <Row gutter={[0, 24]}>
      <Row style={{ width: '100%' }} align={'end'}>
        <SearchPokemon onSearch={handleSearchPokemon} />
      </Row>
      <Row gutter={[12, 12]}>
        {searchEmpty ? (
          <Col span={24}>
            <Empty description="No se encontraron Pokémon con ese nombre" />
          </Col>
        ) : searchList.length > 0 ? (
          renderPokemonList(searchList)
        ) : (
          renderPokemonList(pokemons)
        )}
      </Row>
      <Row align={'center'} style={{ width: '100%' }}>
        <Pagination current={currentPage} total={totalPokemons} pageSize={20} onChange={handlePageChange} />
      </Row>
      <PokemonDetail {...currentPokemon} openModal={openDetail} handleOpenModal={handleCloseDetail} />
    </Row>
  );
}
