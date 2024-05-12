const config = {
  GOLDS_LOCAL_STORAGE_KEY: 'golds',
  GOLDS_INDICATOR_ELEMENT_ID: 'golds-indicator',
  PRICE_INDICATOR_ELEMENT_ID: 'price-indicator',
  DEFAULT_GOLDS: 400,
  GAME_PRICE: 40,
  chestRewards: []
};

config.chestRewards.push(0, config.GAME_PRICE, config.GAME_PRICE * 2.5);

Object.freeze(config);
Object.freeze(config.chestRewards);

const cleanGoldsLocalStorageField = () => localStorage.setItem(config.GOLDS_LOCAL_STORAGE_KEY, config.DEFAULT_GOLDS);

function getGolds() {
  const getMaybeGolds = () => parseInt(localStorage.getItem(config.GOLDS_LOCAL_STORAGE_KEY));

  if (isNaN(getMaybeGolds())) {
    cleanGoldsLocalStorageField();
    return getMaybeGolds();
  }

  return getMaybeGolds();
}

function updateIndicators() {
  const golds = getGolds();

  const goldsIndicatorElement = document.getElementById(config.GOLDS_INDICATOR_ELEMENT_ID);

  const priceIndicatorElement = document.getElementById(config.PRICE_INDICATOR_ELEMENT_ID);

  goldsIndicatorElement.innerText = golds;
  priceIndicatorElement.innerText = config.GAME_PRICE;
}

function reward(amount) {
  const golds = getGolds();

  localStorage.setItem(config.GOLDS_LOCAL_STORAGE_KEY, golds + amount);

  updateIndicators();
}

function pay() {
  const amount = config.GAME_PRICE;
  const golds = getGolds();

  if (golds < amount) {
    throw new Error('You do not have enough golds!');
  }

  localStorage.setItem(config.GOLDS_LOCAL_STORAGE_KEY, golds - amount);

  updateIndicators();
}

const getRandomChestReward = () => config.chestRewards[Math.floor(Math.random() * config.chestRewards.length)];

function hitChest() {
  try {
    pay();
    const randomReward = getRandomChestReward();

    if (randomReward !== 0) {
      reward(randomReward);
      alert('You got ' + randomReward + ' golds!');
    } else {
      alert('You got nothing!');
    }
  } catch (error) {
    alert(error.message);
  }
}

function initialize() {
  updateIndicators();
}

initialize();
