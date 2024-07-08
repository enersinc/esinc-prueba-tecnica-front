import React, { useEffect,  useState } from 'react'
import { fetchData } from '../../services/fetchData';
import { Button, Col, Row, Alert, Pagination } from 'antd';
import PokemonCard from '../PokemonCard/PokemonCard';
import SearchPokemon from './SearchPokemon';
import PokemonDetail from './PokemonDetail';

export default function PokemonList() {

  const [pokemons, setPokemons] = useState([])
  const [pokemonsBase, setPokemonsBase] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [searchList, setSearchList] = useState([])
  const [openDetail, setOpenDetail] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState({})
  const [totalPages, setTotalPages] = useState(0)

  const [alertError, setAlertError] = useState(false)
  const [searchEmptyError, setSearchEmptyError] = useState(false)

  const getPokemonIdByUrl = (url) => {
    const segments = url.split("/");
    const pokemonId = segments[segments.length - 2]
    return pokemonId

  }

  const getPokemonInfo = async (list) => {

    try {
      const pokemonInfo = []
      for(const pokemon of list){
        const response = await fetchData({ endpoint: `pokemon/${getPokemonIdByUrl(pokemon.url)}` })
        pokemonInfo.push(response)
      }
      const pokemonList = list.map((pokemon, index) => {
        return {
          name: pokemon.name,
          pokemonImg: pokemonInfo[index].sprites.other.dream_world.front_default,
          types: pokemonInfo[index].types
        }
      });

      return pokemonList
    } catch (error) {
      console.error('Error fetching Pokemon info:', error);
      setAlertError(true);
    }
  }

  const getData = async () => {
    try {
      const { results: allPokemons, count } = await fetchData({ endpoint: `pokemon/?limit=20&offset=${currentPage * 20}` })
      setTotalPages(count)
      const pokemonList = await getPokemonInfo(allPokemons)
      setPokemons(pokemonList)
      setPokemonsBase(pokemonList)
    } catch (error) {
      console.error('Error fetching Pokemon info:', error);
      setAlertError(true);
    }
  }

  const handleSearchPokemon = async (value) => {

    try {
      if (value) {
        const { results: allPokemons } = await fetchData({ endpoint: 'pokemon/?limit=10000&offset=0' });
        const filterPokemons = allPokemons.filter((pokemon) => pokemon.name.includes(value));
        if(filterPokemons.length === 0){
          searchEmptyError(true)
        }else{
          searchEmptyError(false)
        }
        const pokemonsNoFilter = allPokemons.filter((pokemon) => !pokemon.name.includes(value));
        setPokemons([...pokemonsNoFilter])
        const pokemonList = await getPokemonInfo(filterPokemons);
        setSearchList(pokemonList);
      } else {
        setSearchList([]);
        setPokemons([...pokemonsBase])
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      setAlertError(true);
    }
  }

  useEffect(() => {
    getData()
  }, [currentPage]);

  const loadPokemons = (page) => {
    setCurrentPage(page - 1)
  };

  const onCardClick = async (name) => {

    const pokemon = await fetchData({ endpoint: `pokemon/${name}` })

    setCurrentPokemon({
      name: name,
      pokemonImg: pokemon.sprites.other.dream_world.front_default,
      stats: pokemon.stats
    })

  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
  }


  return (
    <Row gutter={[0, 24]}>
      <Row style={{ width: "100%" }} align={"end"}>
        <SearchPokemon onSearch={handleSearchPokemon} />
      </Row>

      {alertError && <Alert message="Oups! No se puede visualizar la lista de Pokemones." type="error" />}
      {searchEmptyError && <Alert message="Oups! Pokemones no Encontrado." type="warning" />}

      <Row gutter={[12, 12]}>
        {searchList.length > 0 &&
          searchList.map((pokemon) => (
            <Col span={6} >
              <PokemonCard {...pokemon} onClick={onCardClick} />
            </Col>
          ))
        }

        {pokemons.length > 0 &&
          pokemons.map((pokemon) => (
            <Col span={6} >
              <PokemonCard {...pokemon} onClick={onCardClick} />
            </Col>
          ))
        }
        
      </Row>
      {!alertError && (searchList.length > 0 || pokemons.length > 0) && <Row align={"center"} style={{ width: "100%" }}>
        <Pagination defaultCurrent={1} current={currentPage + 1} onChange={loadPokemons} total={totalPages} />
      </Row>}

      <PokemonDetail {...currentPokemon} openModal={openDetail} handleOpenModal={handleCloseDetail} />
    </Row>
  )
}
