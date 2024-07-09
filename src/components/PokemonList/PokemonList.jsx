import React, { useEffect, useState } from 'react';
import { fetchData } from '../../services/fetchData';
import { Col, Row, notification, Pagination } from 'antd';
import PokemonCard from '../PokemonCard/PokemonCard';
import SearchPokemon from './SearchPokemon';
import PokemonDetail from './PokemonDetail';

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPokemons, setTotalPokemons] = useState(0);
  const [searchList, setSearchList] = useState([]);
  const [searchEmpty, setSearchEmpty] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [currentPokemon, setCurrentPokemon] = useState({});

  const getPokemonIdByUrl = (url) => {
    const segments = url.split("/");
    const pokemonId = segments[segments.length - 2];
    return pokemonId;
  }

  const getPokemonInfo = async (list) => {
    try {
      const pokemonInfoPromises = list.map(async (pokemon) => {
        const response = await fetchData({ endpoint: `pokemon/${getPokemonIdByUrl(pokemon.url)}` });
        return response;
      });

      const resolvedPokemonInfo = await Promise.all(pokemonInfoPromises);

      const pokemonList = list.map((pokemon, index) => {
        const pokemonData = resolvedPokemonInfo[index];
        return {
          name: pokemon.name,
          pokemonImg: pokemonData?.sprites?.other?.dream_world?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
          types: pokemonData?.types || [
            {
              "slot": 1,
              "type": {
                "name": "unknown",
                "url": "https://pokeapi.co/api/v2/type/unknown/"
              }
            }
          ],
          stats: pokemonData?.stats || []
        };
      });

      return pokemonList;
    } catch (error) {
      console.error('Error fetching Pokemon info:', error.message);
      notification.error({
        message: 'Error',
        description: 'Error fetching Pokemon info. Please try again later.'
      });
    }
  }

  const getData = async (page) => {
    try {
      const offset = (page - 1) * 20;
      const { count, results: allPokemons } = await fetchData({ endpoint: `pokemon/?limit=20&offset=${offset}` });
      const pokemonList = await getPokemonInfo(allPokemons);
      setPokemons(pokemonList);
      setTotalPokemons(count);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error.message);
      notification.error({
        message: 'Error',
        description: 'Error fetching Pokemon data. Please try again later.'
      });
    }
  }

  const handleSearchPokemon = async (value) => {
    try {
      if (value) {
        const allPokemons = await fetchData({ endpoint: `pokemon/?limit=10000&offset=0` });
        const filterPokemons = allPokemons.results.filter(pokemon => pokemon.name.includes(value.toLowerCase()));

        if (filterPokemons.length === 0) {
          setSearchEmpty(true);
          setSearchList([]);
          return;
        }

        const detailedPokemonList = await getPokemonInfo(filterPokemons);
        setSearchList(detailedPokemonList);
        setSearchEmpty(detailedPokemonList.length === 0);
      } else {
        setSearchList([]);
        setSearchEmpty(false);
      }
    } catch (error) {
      if (error.message === '404 Not Found') {
        setSearchList([]);
        setSearchEmpty(true);
        notification.error({
          message: 'Pokemon not found',
          description: `The Pokemon "${value}" does not exist. Please try searching for another Pokemon.`
        });
      } else {
        console.error('Error searching Pokemon:', error.message);
        notification.error({
          message: 'Error',
          description: 'Error searching Pokemon. Please try again later.'
        });
      }
    }
  }

  const handleCardClick = (pokemon) => {
    setCurrentPokemon(pokemon);
    setOpenDetail(true);
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPokemonList = (list) => (
    <Row gutter={[16, 16]}>
      {list.map((pokemon, index) => (
        <Col key={index} span={8}>
          <PokemonCard {...pokemon} onClick={() => handleCardClick(pokemon)} />
        </Col>
      ))}
    </Row>
  );

  return (
    <div>
      <SearchPokemon onSearch={handleSearchPokemon} />
      {searchEmpty ? (
        <p>No se encuentra el pokemón.</p>
      ) : (
        searchList.length > 0 ? renderPokemonList(searchList) : renderPokemonList(pokemons)
      )}
      {openDetail && <PokemonDetail {...currentPokemon} openModal={openDetail} handleOpenModal={() => setOpenDetail(false)} />}
      <Pagination
        current={currentPage}
        total={totalPokemons}
        pageSize={20}
        onChange={handlePageChange}
        style={{ marginTop: '20px', textAlign: 'center' }}
      />
    </div>
  );
}