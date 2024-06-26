import React, { useEffect, useRef, useState } from 'react'
import { fetchData } from '../../services/fetchData';
import { Button, Col, Modal, Pagination, Row } from 'antd';
import PokemonCard from '../PokemonCard/PokemonCard';
import SearchPokemon from './SearchPokemon';
import PokemonDetail from './PokemonDetail';

export default function PokemonList() {

  const [pokemons, setPokemons] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [searchList, setSearchList] = useState([])
  const [openDetail, setOpenDetail] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState({})

  const getPokemonIdByUrl = (url) => {
    const segments = url.split("/");
    const pokemonId = segments[segments.length - 2]
    return pokemonId

  }

  const getPokemonInfo = async (list) => {

    try {

      const pokemonInfo = list.map(async (pokemon) => {
        const response = await fetchData({ endpoint: `pokemon/${getPokemonIdByUrl(pokemon.url)}` })
        return response
      })

      const pokemonResults = await Promise.all(pokemonInfo)

      const pokemonList = list.map((pokemon, index) => {
        return {
          name: pokemon.name,
          pokemonImg: pokemonResults[index].sprites.other.dream_world.front_default,
          types: pokemonResults[index].types
        }
      });

      return pokemonList
    } catch (error) {
      console.error('Error fetching Pokemon info:', error);
    }
  }

  const getData = async () => {

    try {
      const { results: allPokemons } = await fetchData({ endpoint: `pokemon/?limit=20&offset=${currentPage * 20}` })
      const pokemonList = await getPokemonInfo(allPokemons)
      currentPage > 0 ? setPokemons(prevState => [...prevState, ...pokemonList]) : setPokemons(pokemonList)
    } catch (error) {
      console.error('Error fetching Pokemon info:', error);
    }
  }

  const handleSearchPokemon = async (value) => {

    try {
      if (value) {
        const { results: allPokemons } = await fetchData({ endpoint: 'pokemon/?limit=10000&offset=0' });
        const filterPokemons = allPokemons.filter((pokemon) => pokemon.name.includes(value));
        const pokemonList = await getPokemonInfo(filterPokemons);
        setSearchList(pokemonList);
      } else {
        setSearchList([]);
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
    }
  }

  useEffect(() => {
    getData()
  }, [currentPage]);

  const loadPokemons = () => {
    setCurrentPage(prevState => prevState + 1)

  }

  const onCardClick = async (name) => {

    const pokemon = await fetchData({ endpoint: `pokemon/${name}` })

    setCurrentPokemon({
      name: name,
      pokemonImg: pokemon.sprites.other.dream_world.front_default,
      stats: pokemon.stats
    })

    setOpenDetail(true)

  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
  }

  return (
    <Row gutter={[0, 24]}>
      <Row style={{ width: "100%" }} align={"end"}>
        <SearchPokemon onSearch={handleSearchPokemon} />
      </Row>
      <Row gutter={[12, 12]}>
        {(searchList.length ? searchList : pokemons).map((pokemon, index) =>
          <Col span={6} key={`Pokemon-item-${index}`}>
            <PokemonCard {...pokemon} onClick={onCardClick} />
          </Col>
        )}

      </Row>
      <Row align={"center"} style={{ width: "100%" }}>
        <Button type='primary' onClick={loadPokemons}>Cargar mas...</Button>
      </Row>

      <PokemonDetail {...currentPokemon} openModal={openDetail} handleOpenModal={handleCloseDetail} />
    </Row>
  )
}
