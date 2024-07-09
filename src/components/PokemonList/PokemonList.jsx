import React, { useEffect,  useState } from 'react'
import { fetchData } from '../../services/fetchData';
import { Col, Row, notification, Pagination, Typography } from 'antd';
import PokemonCard from '../PokemonCard/PokemonCard';
import SearchPokemon from './SearchPokemon';
import PokemonDetail from './PokemonDetail';

export default function PokemonList() {

  const [pokemons, setPokemons] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [openDetail, setOpenDetail] = useState(false)
  const [searchEmpty, setSearchEmpty] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState({})
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (title, description, duration = 0) => {
    api.open({
      message: title,
      description: description,
      duration: duration,
    });
  };
  
  const getPokemonIdByUrl = (url) => {
    const segments = url.split("/");
    const pokemonId = segments[segments.length - 2]
    return pokemonId

  }

  const getPokemonInfo = async (list) => {
    try {
      const promises = list.map(async (pokemon) => {
        const response = await fetchData({ endpoint: `pokemon/${getPokemonIdByUrl(pokemon.url)}` })
        return response
      });
  
      const pokemonInfo = await Promise.all(promises); 
  
      const pokemonList = pokemonInfo.map((info) => {
        return {
          name: info.name, 
          pokemonImg: info.sprites.other.dream_world.front_default,
          types: info.types
        }
      });
  
      return pokemonList;
    } catch (error) {
      console.error('Error fetching Pokemon info:', error);
      openNotification('Error Fetching Pokemon', error.message || 'Failed to fetch Pokemon details.');
    }
  }
  
  

  const getData = async () => {
    
    const url = `pokemon/?limit=20&offset=${(currentPage - 1) * 20}`;
    try {
      const response = await fetchData({ endpoint: url });
      const { count, results: allPokemons } = response;
      const pokemonList = await getPokemonInfo(allPokemons);
      setPokemons(pokemonList);
      setTotalPages(count);
    } catch (error) {
      console.error('Error fetching Pokemon info:', error);
      openNotification('Loading Error', 'Failed to load Pokemon data.', 4);
    }
  };
  
  

  const handleSearchPokemon = async (value) => {
    const url = `pokemon/?limit=10000&offset=0`
    try {
      if (value) {
        const { results: allPokemons } = await fetchData({ endpoint: url });
        const filterPokemons = allPokemons.filter((pokemon) => pokemon.name.toLowerCase().includes(value.toLowerCase()));
   
        const pokemonList = await getPokemonInfo(filterPokemons);
        const totalFiltered = pokemonList.length;
        const filteredList = pokemonList.slice((currentPage - 1) * 20, currentPage * 20);
        setSearchEmpty(totalFiltered === 0);
        setPokemons(filteredList);
        setTotalPages(Math.ceil(totalFiltered / 20));
      } else {
        getData()
        setSearchEmpty(false);
      }
    } catch (error) {
      console.error('Error searching Pokemon:', error);
      openNotification('Search Error', 'Failed to perform search operation.', 4);
    }
  }
  

  useEffect(() => {
    getData() 
  }, [currentPage]);



  const onCardClick = async (name) => {

    const pokemon = await fetchData({ endpoint: `pokemon/${name}` })
    setOpenDetail(true)
    setCurrentPokemon({
      name: name,
      pokemonImg: pokemon.sprites.other.dream_world.front_default,
      stats: pokemon.stats
    })

  }

  const handleCloseDetail = () => {
    setOpenDetail(false)
  }
  const handlePageChange = (page) => {
    setCurrentPage(page); 
  };

  return (
    <>
      {contextHolder}
    <Row gutter={[0, 24]}>
      <Row style={{ width: "100%" }} align={"end"}>
        <SearchPokemon onSearch={handleSearchPokemon} />
      </Row>
      <Row gutter={[12, 12]}>
        {pokemons.length > 0 ?(
          pokemons.map((pokemon) => (
            <Col span={6} key={pokemon.id}>
              <PokemonCard {...pokemon} onClick={onCardClick} />
            </Col>
          ))) : (
          <Typography.Title level={1} style={{ margin: "auto" }}>
          We haven't found anything  :(
        </Typography.Title>
        )       
        }   
      </Row>
      <Row align={"center"} style={{ width: "100%" }}>
        {totalPages> 1 && (
          <Pagination
            current={currentPage}
            onChange={handlePageChange}
            total={totalPages}
            pageSize={20}
            showSizeChanger={false}
          />
        )}
      </Row>

      <PokemonDetail {...currentPokemon} openModal={openDetail} handleOpenModal={handleCloseDetail} />
    </Row>
    </>
  )
}
