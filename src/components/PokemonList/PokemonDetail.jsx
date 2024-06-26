import { Button, Card, Col,  Modal, Progress, Row } from 'antd'
import React, { useEffect, useState } from 'react'

export default function PokemonDetail({ name, pokemonImg, stats, openModal, handleOpenModal }) {

  const [open, setOpen] = useState(false)

  const onClose = () =>{
    setOpen(false)
    handleOpenModal()
  }

  useEffect(() => {
    if(openModal){
      setOpen(true)
    }
  }, [openModal]);

  
  return (

    <Modal
      open={open}
      title={name}
      destroyOnClose
      onCancel={onClose}
      footer={<Button onClick={onClose}>Cerrar</Button>}
    >
      <Card
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
        <Row>
          {stats.map((stat, index) => (
            <Col key={`pokemon-stat-${index}`} span={8} align="middle">
              <h3>{stat.stat.name}</h3>
              <Progress
                format={(percent) => `${percent}`}
                percent={stat.base_stat}
                type='circle'
              />
            </Col>
          ))}
        </Row>

      </Card>
    </Modal>
  )
}



PokemonDetail.defaultProps = {
  name: "bulbasaur",
  pokemonImg: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg',
  stats: [
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "hp",
        "url": "https://pokeapi.co/api/v2/stat/1/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "attack",
        "url": "https://pokeapi.co/api/v2/stat/2/"
      }
    },
    {
      "base_stat": 49,
      "effort": 0,
      "stat": {
        "name": "defense",
        "url": "https://pokeapi.co/api/v2/stat/3/"
      }
    },
    {
      "base_stat": 65,
      "effort": 1,
      "stat": {
        "name": "special-attack",
        "url": "https://pokeapi.co/api/v2/stat/4/"
      }
    },
    {
      "base_stat": 65,
      "effort": 0,
      "stat": {
        "name": "special-defense",
        "url": "https://pokeapi.co/api/v2/stat/5/"
      }
    },
    {
      "base_stat": 45,
      "effort": 0,
      "stat": {
        "name": "speed",
        "url": "https://pokeapi.co/api/v2/stat/6/"
      }
    }
  ]
}