import { Button, Card, Col, Modal, Progress, Row } from "antd";
import React, { useEffect, useState } from "react";

const PokemonDetail = ({
  name = "",
  pokemonImg = "",
  stats = [],
  openModal,
  handleOpenModal,
}) => {
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
    handleOpenModal();
  };

  useEffect(() => {
    if (openModal) {
      setOpen(true);
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
        <Row>
          {stats.map((stat, index) => (
            <Col key={`pokemon-stat-${index}`} span={8} align="middle">
              <h3>{stat.stat.name}</h3>
              <Progress
                format={(percent) => `${percent}`}
                percent={stat.base_stat}
                type="circle"
              />
            </Col>
          ))}
        </Row>
      </Card>
    </Modal>
  );
};

export default PokemonDetail;
