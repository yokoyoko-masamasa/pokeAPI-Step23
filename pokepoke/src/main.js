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
  // 入力値を取得し、小文字に変換
  const poke1Lower = pokemon1Input.value.toLowerCase();
  const poke2Lower = pokemon2Input.value.toLowerCase();

  // 2匹分のデータを同時取得
  const [res1, res2] = await Promise.all([fetchPokemon(poke1Lower), fetchPokemon(poke2Lower)]);

  // 結果を画面に表示
  displayResult(result1, res1);
  displayResult(result2, res2);

});

// pokeAPIから1匹分のデータを取得
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

// 結果処理
function displayResult(resultElement, data) {
  if (!data) {
    resultElement.innerHTML = '<p class="error-message">ポケモンが見つかりませんでした</p>';
  } else {
    resultElement.innerHTML = renderPokemon(data);
  }
}