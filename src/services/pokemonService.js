import axios from "axios";
import { useQueries, useQuery } from "@tanstack/react-query";

const BASE_URL = "https://pokeapi.co/api/v2/";

export const useGetDataPokemons = ({ limit, page }) => {
  return useQuery({
    queryKey: ["get-data-pokemons", limit, page],
    queryFn: async () => {
      const PATH_URL = `${BASE_URL}/pokemon/?limit=${limit}&offset=${page}`;
      const { data } = await axios.get(PATH_URL);
      return data.results;
    },
  });
};

export const useGetDataPokemonsByUrl = (urls = []) => {
  return useQueries({
    queries: urls.map(({ url }) => ({
      queryKey: ["get-data-pokemons-by-url", url],
      queryFn: async () => {
        const { data } = await axios.get(url);
        return data;
      },
    })),
    combine: (results) => {
      return {
        data: results
          .filter((res) => !res.isPending)
          .map(({ data }) => ({
            name: data.name,
            types: data.types,
            stats: data.stats,
            pokemonImg: data?.sprites?.other?.dream_world?.front_default,
          })),
        isPending: results.some((result) => result.isPending),
      };
    },
  });
};
