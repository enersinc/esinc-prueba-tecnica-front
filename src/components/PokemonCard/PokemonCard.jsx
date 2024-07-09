import { Card, Col, Row, Tag, Typography } from 'antd'
import React from 'react'
import PropTypes from 'prop-types';
import { TYPE_LIST } from './typeList'

export default function PokemonCard({ name, pokemonImg, types,  onClick }) {
  console.log(types)
  return (
    <Card
      onClick={() => onClick(name)}
      hoverable
      cover={<img
        alt={name}
        src={pokemonImg}
        style={{
          height: "220px",
          backgroundColor: "#b4b4b4",
          paddingTop: "10px"
        }}

      />}
    >
      <Card.Meta
        title={name}
        description=
        {types.map(({ type }, index) => (
          <Tag key={`${name}-type-${index}`} color={TYPE_LIST[type.name]}>{type.name}</Tag>
        ))}
      />

    </Card>
  )
}

PokemonCard.propTypes = {
  name: PropTypes.string.isRequired,
  pokemonImg: PropTypes.string.isRequired,
  type: PropTypes.array.isRequired
}

PokemonCard.defaultProps = {
  name: "bulbasaur",
  pokemonImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
  types: [
    {
      "slot": 1,
      "type": {
        "name": "grass",
        "url": "https://pokeapi.co/api/v2/type/12/"
      }
    },
    {
      "slot": 2,
      "type": {
        "name": "poison",
        "url": "https://pokeapi.co/api/v2/type/4/"
      }
    }
  ]
}