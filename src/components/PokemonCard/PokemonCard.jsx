import { Card, Tag } from "antd";
import React from "react";
import { TYPE_LIST } from "./typeList";

const PokemonCard = ({ name = "", pokemonImg = "", types = [], onClick }) => {
  return (
    <Card
      onClick={() => onClick(name)}
      hoverable
      cover={
        <img
          alt={name}
          src={pokemonImg}
          style={{
            height: "220px",
            backgroundColor: "#b4b4b4",
            paddingTop: "10px",
          }}
        />
      }
    >
      <Card.Meta
        title={name}
        description={types.map(({ type }, index) => (
          <Tag key={`${name}-type-${index}`} color={TYPE_LIST[type.name]}>
            {type.name}
          </Tag>
        ))}
      />
    </Card>
  );
};

export default PokemonCard;
