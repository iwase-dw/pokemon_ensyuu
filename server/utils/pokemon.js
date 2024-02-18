/** ポケモンの取得 */
import { ProxyAgent } from "proxy-agent";
const agent = new ProxyAgent();

export const findPokemon = async (name) => {
  //process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {agent,});
  const pokemon = await response.json();
  return pokemon;
};
