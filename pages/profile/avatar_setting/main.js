const optionConfig = [
  {
    key: 'topType',
    label: 'Top Type',
    values: [
      'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4',
      'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads',
      'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides',
      'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand',
      'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet',
      'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved',
      'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
    ],
  },
  {
    key: 'accessoriesType',
    label: 'Accessories Type',
    values: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
  },
  {
    key: 'hairColor',
    label: 'Hair Color',
    values: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
  },
  {
    key: 'facialHairType',
    label: 'Facial Hair Type',
    values: ['Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'],
  },
  {
    key: 'facialHairColor',
    label: 'Facial Hair Color',
    values: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
  },
  {
    key: 'clotheType',
    label: 'Clothe Type',
    values: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'],
  },
  {
    key: 'clotheColor',
    label: 'Clothe Color',
    values: ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'],
  },
  {
    key: 'graphicType',
    label: 'Graphic Type',
    values: ['Blank', 'Bat', 'Cumbia', 'Deer', 'Diamond', 'Hola', 'Pizza', 'Resist', 'Selena', 'Bear', 'SkullOutline', 'Skull'],
  },
  {
    key: 'eyeType',
    label: 'Eye Type',
    values: ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
  },
  {
    key: 'eyebrowType',
    label: 'Eyebrow Type',
    values: ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'],
  },
  {
    key: 'mouthType',
    label: 'Mouth Type',
    values: ['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
  },
  {
    key: 'skinColor',
    label: 'Skin Color',
    values: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'],
  },
];

const form = {
  avatarStyle: 'Circle',
};

let activeOptionKey = optionConfig[0].key;

const avatarImage = document.getElementById('avatarImage');
const tabsContainer = document.getElementById('tabsContainer');
const itemsContainer = document.getElementById('itemsContainer');
const randomButton = document.getElementById('randomButton');

const userId = localStorage.getItem('userId');
const usersApi = 'https://681eeb44c1c291fa66357959.mockapi.io/api/v2/greenclass/users';

optionConfig.forEach((option) => {
  form[option.key] = option.values[0];
});

function serialize(params) {
  return Object.entries(params)
    .filter(([, value]) => value !== '' && value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function buildAvatarUrl(params) {
  const query = serialize(params);
  return `https://avataaars.io/?${query}`;
}

function parseQuery() {
  const search = window.location.search.replace(/^[?]/, '');
  return search.split('&').reduce((acc, part) => {
    if (!part) return acc;
    const [key, value] = part.split('=');
    acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
    return acc;
  }, {});
}

function setRadioValue(name, value) {
  const radios = document.querySelectorAll(`input[name="${name}"]`);
  radios.forEach((radio) => {
    radio.checked = radio.value === value;
  });
}

function setActiveTab(key) {
  activeOptionKey = key;
  renderTabs();
  renderItems();
}

function createTab(option) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `tab-button${option.key === activeOptionKey ? ' active' : ''}`;
  button.textContent = option.label;
  button.addEventListener('click', () => setActiveTab(option.key));
  return button;
}

function createItem(option, value) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'item-card';
  if (form[option.key] === value) {
    card.classList.add('selected');
  }

  const preview = document.createElement('div');
  preview.className = 'item-preview';
  const image = document.createElement('img');
  image.alt = `${option.label} ${value}`;
  image.src = buildAvatarUrl({ ...form, [option.key]: value });
  preview.appendChild(image);

  const label = document.createElement('div');
  label.className = 'item-label';
  label.textContent = value;

  card.appendChild(preview);
  card.appendChild(label);
  card.addEventListener('click', () => onItemSelect(option.key, value));
  return card;
}

function renderTabs() {
  tabsContainer.innerHTML = '';
  optionConfig.forEach((option) => {
    tabsContainer.appendChild(createTab(option));
  });
}

function renderItems() {
  const option = optionConfig.find((item) => item.key === activeOptionKey);
  if (!option) {
    itemsContainer.innerHTML = '';
    return;
  }

  itemsContainer.innerHTML = '';
  option.values.forEach((value) => {
    itemsContainer.appendChild(createItem(option, value));
  });
}

function refreshFormFromQuery(query) {
  if (query.avatarStyle && (query.avatarStyle === 'Circle' || query.avatarStyle === 'Transparent')) {
    form.avatarStyle = query.avatarStyle;
    setRadioValue('avatarStyle', query.avatarStyle);
  }

  optionConfig.forEach((option) => {
    const queryValue = query[option.key];
    if (queryValue && option.values.includes(queryValue)) {
      form[option.key] = queryValue;
    }
  });
}

function onAvatarStyleChange() {
  const selected = document.querySelector('input[name="avatarStyle"]:checked');
  if (selected) {
    form.avatarStyle = selected.value;
    updateAvatar(form);
    renderItems();
  }
}

function onItemSelect(optionKey, value) {
  form[optionKey] = value;
  renderItems();
  updateAvatar(form);
}

function getFormValues() {
  return { ...form };
}

function updateAvatar(values) {
  const url = buildAvatarUrl(values);
  avatarImage.src = url;
  const newUrl = `${window.location.pathname}?${serialize(values)}`;
  history.replaceState(null, '', newUrl);
  saveAvatarToAPI(values);
}

function saveAvatarToAPI(values) {
  if (!userId) return;
  fetch(`${usersApi}/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ avatar: JSON.stringify(values) })
  }).catch(err => console.error('Error saving avatar:', err));
}

function loadAvatarFromAPI() {
  if (!userId) return;
  fetch(`${usersApi}/${userId}`)
    .then(res => res.json())
    .then(user => {
      if (user.avatar) {
        try {
          const avatarData = JSON.parse(user.avatar);
          Object.assign(form, avatarData);
          setRadioValue('avatarStyle', form.avatarStyle);
          renderTabs();
          renderItems();
          updateAvatar(form);
        } catch (e) {
          console.warn('Avatar data is not valid JSON, using defaults');
        }
      }
    })
    .catch(err => console.error('Error loading avatar:', err));
}

function applyQuery() {
  const query = parseQuery();
  refreshFormFromQuery(query);
  renderTabs();
  renderItems();
  updateAvatar(form);
}

function randomChoice(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomize() {
  form.avatarStyle = randomChoice(['Circle', 'Transparent']);
  optionConfig.forEach((option) => {
    form[option.key] = randomChoice(option.values);
  });
  setRadioValue('avatarStyle', form.avatarStyle);
  renderTabs();
  renderItems();
  updateAvatar(form);
}

function init() {
  document.querySelectorAll('input[name="avatarStyle"]').forEach((radio) => {
    radio.addEventListener('change', onAvatarStyleChange);
  });
  randomButton.addEventListener('click', (event) => {
    event.preventDefault();
    randomize();
  });
  applyQuery();
  loadAvatarFromAPI();
}

init();
