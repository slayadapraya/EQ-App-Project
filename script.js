const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const dock = $('.dock');
const label = $('.dock-label');
const navIcons = $$('.dock > img');
const icons = {
  home: ['home-on.svg', 'gear.svg', 'user.svg'],
  settings: ['home.svg', 'gear-on.svg', 'user.svg'],
  profile: ['home.svg', 'gear.svg', 'user-on.svg'],
  equalizer: ['home.svg', 'gear.svg', 'user.svg']
};

function showScreen(name) {
  $$('.screen').forEach(screen =>
    screen.classList.toggle('active', screen.classList.contains(`screen-${name}`))
  );
  dock.className = `dock dock-${name}`;
  navIcons.forEach((icon, i) => icon.src = `assets/${icons[name][i]}`);
  label.textContent = name === 'equalizer' ? '' : name[0].toUpperCase() + name.slice(1);
  label.classList.remove('reveal');
  requestAnimationFrame(() => label.classList.add('reveal'));
  localStorage.setItem('screen', name);
}

$$('[data-go]').forEach(button =>
  button.addEventListener('click', () => showScreen(button.dataset.go))
);

const switches = $$('.switch');
const savedSwitches = JSON.parse(localStorage.getItem('switches') || 'null');

function setSwitch(button, on) {
  button.classList.toggle('on', on);
  button.setAttribute('aria-checked', on);
}

switches.forEach((button, i) => {
  if (savedSwitches) setSwitch(button, savedSwitches[i]);
  button.addEventListener('click', () => {
    setSwitch(button, !button.classList.contains('on'));
    localStorage.setItem('switches', JSON.stringify(switches.map(item => item.classList.contains('on'))));
  });
});

let playing = localStorage.getItem('playing') === 'true';

function renderPlayer() {
  $('.headphones').classList.toggle('playing', playing);
  $('.main-play').classList.toggle('playing', playing);
  $('.main-play img').src = `assets/${playing ? 'pause' : 'play'}.svg`;
  $('.main-play').ariaLabel = playing ? 'Pause' : 'Play';
}

[$('.hero'), $('.main-play')].forEach(button => button.addEventListener('click', () => {
  playing = !playing;
  localStorage.setItem('playing', playing);
  renderPlayer();
}));

const progress = $('.progress-input');
const progressTrack = $('.progress-track');
const progressFill = $('.progress-fill');
const progressKnob = $('.progress-knob');

function renderProgress() {
  const ratio = progress.value / progress.max;
  const start = progressTrack.offsetLeft + progressTrack.clientLeft;
  const end = progressTrack.offsetLeft + progressTrack.offsetWidth - progressTrack.clientLeft;
  progressFill.style.width = `${ratio * (end - start)}px`;
  progressKnob.style.left = `${start + ratio * (end - start) - progressKnob.offsetWidth / 2}px`;
  $('.time-current').textContent = `${Math.floor(progress.value / 60)}:${String(progress.value % 60).padStart(2, '0')}`;
}

progress.addEventListener('input', renderProgress);
renderProgress();

const presets = {
  BALANCED: [43, 43, 70, 43, 43, 17, 43, 70],
  WARM: [72, 64, 57, 48, 40, 34, 30, 26],
  PUNCH: [74, 62, 46, 38, 44, 58, 67, 55]
};
const frequencies = ['60', '120', '250', '500', '1k', '2k', '4k', '8k'];
const bands = $('.bands');
let values = JSON.parse(localStorage.getItem('bands') || 'null') || presets.BALANCED;

function setPreset(name) {
  $('.preset-card strong').textContent = name;
}

frequencies.forEach((frequency, i) => {
  const band = document.createElement('label');
  band.innerHTML = `<input type="range" min="0" max="100" value="${values[i]}" aria-label="${frequency} hertz"><span>${frequency}</span>`;
  band.firstChild.addEventListener('input', event => {
    values[i] = Number(event.target.value);
    localStorage.setItem('bands', JSON.stringify(values));
    setPreset('CUSTOM');
  });
  bands.appendChild(band);
});

$$('[data-preset]').forEach(button => button.addEventListener('click', () => {
  values = [...presets[button.dataset.preset]];
  $$('.bands input').forEach((input, i) => input.value = values[i]);
  localStorage.setItem('bands', JSON.stringify(values));
  setPreset(button.dataset.preset);
}));

renderPlayer();
showScreen(localStorage.getItem('screen') || 'home');
