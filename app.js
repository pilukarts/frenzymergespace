const OBJECTS = [
  { name: 'Polvo Estelar', icon: '✨', value: 10, glow: '#ffd66b' },
  { name: 'Fragmento', icon: '🪨', value: 25, glow: '#8f9bb3' },
  { name: 'Cristal Cósmico', icon: '💎', value: 60, glow: '#47e4ff' },
  { name: 'Núcleo de Plasma', icon: '🔮', value: 150, glow: '#a96dff' },
  { name: 'Módulo Estelar', icon: '⚙️', value: 400, glow: '#c6d1e8' },
  { name: 'Explorador', icon: '🚀', value: 1000, glow: '#ff7657' },
  { name: 'Nave de Carga', icon: '🛸', value: 2500, glow: '#70ffbc' },
  { name: 'Crucero', icon: '🛰️', value: 6000, glow: '#79a2ff' },
  { name: 'Motor Curvatura', icon: '🌌', value: 15000, glow: '#d467ff' },
  { name: 'StarForge Ark', icon: '☀️', value: 50000, glow: '#fff37d' }
];

const initialBoard = [0, 0, null, null, 1, null, 0, null, null, 1, null, null, null, null, null, null];
let state = JSON.parse(localStorage.getItem('frenzy-merge-state')) || { board: initialBoard, score: 0, merges: 0, selected: null, maxLevel: 1 };
const $ = (id) => document.getElementById(id);

function persist() { localStorage.setItem('frenzy-merge-state', JSON.stringify(state)); }
function nextLevel() { return Math.random() < .82 ? 0 : 1; }
function showToast(message) { const toast = $('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800); }

function render() {
  const board = $('board'); board.innerHTML = '';
  state.board.forEach((level, index) => {
    const cell = document.createElement('button');
    cell.className = `cell${state.selected === index ? ' selected' : ''}`;
    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', level == null ? `Espacio ${index + 1} vacío` : `${OBJECTS[level].name}, nivel ${level + 1}`);
    if (level != null) cell.innerHTML = `<span class="object" style="--glow:${OBJECTS[level].glow}">${OBJECTS[level].icon}<small>LV.${level + 1}</small></span>`;
    cell.addEventListener('click', () => selectCell(index)); board.appendChild(cell);
  });
  $('score').textContent = String(state.score).padStart(6, '0');
  $('merges').textContent = String(state.merges).padStart(2, '0');
  $('maxLevel').textContent = String(state.maxLevel).padStart(2, '0');
  const empty = state.board.filter(x => x == null).length;
  $('boardStatus').textContent = `${empty} ESPACIOS DISPONIBLES`;
  $('missionProgress').style.width = `${Math.min(state.merges / 5 * 100, 100)}%`;
  $('missionText').textContent = `${Math.min(state.merges, 5)} / 5 fusiones`;
  $('missionTitle').textContent = state.merges >= 5 ? 'Misión completada' : 'Cadena de reacción';
  $('codex').innerHTML = OBJECTS.map((o, i) => `<div class="codex-item ${i < state.maxLevel ? 'unlocked' : ''}"><b>${i < state.maxLevel ? o.icon : '◈'}</b><span>${i < state.maxLevel ? o.name : 'Señal desconocida'}<small>NIVEL ${String(i + 1).padStart(2, '0')}</small></span></div>`).join('');
  persist();
}

function selectCell(index) {
  const level = state.board[index];
  if (level == null) { state.selected = null; render(); return; }
  if (state.selected == null) { state.selected = index; render(); return; }
  if (state.selected === index) { state.selected = null; render(); return; }
  const first = state.board[state.selected];
  if (first === level && level < OBJECTS.length - 1) {
    state.board[state.selected] = null; state.board[index] = level + 1; state.selected = null;
    state.merges++; state.score += OBJECTS[level + 1].value; state.maxLevel = Math.max(state.maxLevel, level + 2);
    render(); $('board').children[index].classList.add('merge'); showToast(`FUSIÓN COMPLETADA · +${OBJECTS[level + 1].value}`);
  } else { state.selected = index; render(); showToast(first === level ? 'NIVEL MÁXIMO ALCANZADO' : 'LOS OBJETOS DEBEN SER IGUALES'); }
}

function deploy() {
  const empty = state.board.map((v, i) => v == null ? i : -1).filter(i => i >= 0);
  if (!empty.length) { showToast('SECTOR LLENO · FUSIONA OBJETOS'); return; }
  const index = empty[Math.floor(Math.random() * empty.length)]; const level = nextLevel();
  state.board[index] = level; state.selected = null; render(); showToast(`${OBJECTS[level].name.toUpperCase()} DESPLEGADO`);
}

$('deployButton').addEventListener('click', deploy);
$('resetButton').addEventListener('click', () => { state = { board: [...initialBoard], score: 0, merges: 0, selected: null, maxLevel: 1 }; render(); showToast('PARTIDA REINICIADA'); });
render();
