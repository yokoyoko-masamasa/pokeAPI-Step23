import './style.css';
import axios from 'axios';

// DOM要素を取得
const pokemon1Input = document.getElementById('pokemon1-input');
const pokemon2Input = document.getElementById('pokemon2-input');
const compareBtn = document.getElementById('compare-btn');
const result1 = document.getElementById('result-1');
const result2 = document.getElementById('result-2');

// 比較ボタン押下時の処理
compareBtn.addEventListener('click', async () => {
  // 入力値を取得
  const poke1 = pokemon1Input.value;
  const poke2 = pokemon2Input.value;

  // PokeAPI検索用に小文字へ変換
  let poke1komo = poke1.toLowerCase();
  let poke2komo = poke2.toLowerCase();

  // 2匹分のデータを同時取得
  const [res1, res2] = await Promise.all([fetchPokemon(poke1komo), fetchPokemon(poke2komo)]);

  // res1を表示 or エラー表示
  if (!res1) {
    result1.innerHTML = "ポケモンが見つかりませんでした";
  } else {
    result1.innerHTML = renderPokemon(res1);
  }

  // res2を表示 or エラー表示
  if (!res2) {
    result2.innerHTML = "ポケモンが見つかりませんでした";
  } else {
    result2.innerHTML = renderPokemon(res2);
  }
});

// PokeAPIから1匹分のデータを取得
async function fetchPokemon(name) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("ポケモンが見つかりませんでした:", error.message);
  }
}

// 1匹分のデータをHTML文字列に変換
function renderPokemon(data) {
  // タイプ名をカンマ区切りの文字列に変換
  const typeNames = data.types.map((t) => t.type.name);
  const typeText = typeNames.join(", ");

  // ステータスを1項目ずつ<li>に変換
  const statsList = data.stats
    .map((s) => `<li>${s.stat.name}: ${s.base_stat}</li>`)
    .join("");

  return `
    <div class="pokemon-card">
      <h2>${data.name}</h2>
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <p>タイプ: ${typeText}</p>
      <ul class="stats-list">
        ${statsList}
      </ul>
    </div>
  `;
}