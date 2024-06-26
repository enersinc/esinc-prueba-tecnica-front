import React from 'react'
import { Input } from 'antd';
const { Search } = Input;

export default function SearchPokemon({onSearch}) {

  return (
    <Search placeholder="Buscar pokemon"   style={{width:"25vw"}} onSearch={onSearch} allowClear/>
  )
}
