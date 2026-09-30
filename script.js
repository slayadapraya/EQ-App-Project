const app = document.querySelector('.app');
const screens = [...document.querySelectorAll('.screen')];
const dock = document.querySelector('.dock');
const dockLabel = document.querySelector('.dock-label');
const dockIcons = {
  home: document.querySelector('.dock-home-icon'),
  settings: document.querySelector('.dock-settings-icon'),
  profile: document.querySelector('.dock-profile-icon')
};

const iconSets = {
  home: ['home-ab9b7.svg', 'home-8573f.svg', 'home-e8d0e.svg'],
  settings: ['settings-06991.svg', 'settings-5852f.svg', 'settings-b94d8.svg'],
  profile: ['profile-202bb.svg', 'profile-3f7a2.svg', 'profile-a1cff.svg'],
  equalizer: ['equalizer-202bb.svg', 'equalizer-70dbb.svg', 'equalizer-72eec.svg']
};

function showScreen(name) {
  app.dataset.screen = name;
  screens.forEach(screen => screen.classList.toggle('active', screen.classList.contains(`screen-${name}`)));
  dock.className = `dock dock-${name}`;
  const icons = iconSets[name];
  dockIcons.home.src = `assets/${icons[0]}`;
  dockIcons.settings.src = `assets/${icons[1]}`;
  dockIcons.profile.src = `assets/${icons[2]}`;
  dockLabel.textContent = name === 'equalizer' ? '' : name[0].toUpperCase() + name.slice(1);
  dockLabel.classList.remove('reveal');
  requestAnimationFrame(() => dockLabel.classList.add('reveal'));
  localStorage.setItem('eq-screen', name);
}

document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.go)));

document.querySelectorAll('.switch').forEach((button, index) => {
  const saved = JSON.parse(localStorage.getItem('eq-switches') || 'null');
  if (saved) setSwitch(button, saved[index]);
  button.addEventListener('click', () => {
    setSwitch(button, !button.classList.contains('on'));
    localStorage.setItem('eq-switches', JSON.stringify([...document.querySelectorAll('.switch')].map(item => item.classList.contains('on'))));
  });
});

function setSwitch(button, on) {
  button.classList.toggle('on', on);
  button.setAttribute('aria-checked', String(on));
}

const playerButtons = [document.querySelector('.hero'), document.querySelector('.main-play')];
let playing = localStorage.getItem('eq-playing') === 'true';
function renderPlayer() {
  document.querySelector('.headphones').classList.toggle('playing', playing);
  const button = document.querySelector('.main-play');
  button.querySelector('img').src = playing ? 'assets/paused-266ea.svg' : 'assets/home-cbc92.svg';
  button.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
playerButtons.forEach(button => button.addEventListener('click', () => { playing = !playing; localStorage.setItem('eq-playing', playing); renderPlayer(); }));
renderPlayer();

const progress = document.querySelector('.progress-input');
function renderProgress() {
  const ratio = Number(progress.value) / Number(progress.max);
  document.querySelector('.progress-fill').style.width = `calc(${ratio * 426} * var(--u))`;
  document.querySelector('.progress-knob').style.left = `calc(${49 + ratio * 402} * var(--u))`;
  document.querySelector('.time-current').textContent = `${Math.floor(progress.value / 60)}:${String(progress.value % 60).padStart(2, '0')}`;
}
progress.addEventListener('input', renderProgress);

const bandLabels = ['60', '120', '250', '500', '1k', '2k', '4k', '8k'];
const presets = { BALANCED:[43,43,70,43,43,17,43,70], WARM:[72,64,57,48,40,34,30,26], PUNCH:[74,62,46,38,44,58,67,55] };
let bandValues = JSON.parse(localStorage.getItem('eq-bands') || 'null') || presets.BALANCED;
const bands = document.querySelector('.bands');
bandLabels.forEach((label, index) => {
  const item = document.createElement('label');
  item.innerHTML = `<input type="range" min="0" max="100" value="${bandValues[index]}" aria-label="${label} hertz"><span>${label}</span>`;
  item.querySelector('input').addEventListener('input', event => { bandValues[index] = Number(event.target.value); localStorage.setItem('eq-bands', JSON.stringify(bandValues)); setPresetName('CUSTOM'); });
  bands.appendChild(item);
});

function setPresetName(name) { document.querySelector('.preset-card strong').textContent = name; }
document.querySelectorAll('[data-preset]').forEach(button => button.addEventListener('click', () => {
  bandValues = [...presets[button.dataset.preset]];
  [...bands.querySelectorAll('input')].forEach((input, index) => input.value = bandValues[index]);
  localStorage.setItem('eq-bands', JSON.stringify(bandValues));
  setPresetName(button.dataset.preset);
}));

showScreen(localStorage.getItem('eq-screen') || 'home');
