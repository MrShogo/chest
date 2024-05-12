const config = {
  domIds: {
    GOLDS_INDICATOR: 'golds-indicator',
    PRICE_INDICATOR: 'price-indicator',
    RESULT_INDICATOR: 'result-indicator'
  },
  localStorage: {
    GOLDS_KEY: 'golds'
  },
  DEFAULT_GOLDS: 400,
  GAME_PRICE: 40,
  chestRewards: []
};

config.chestRewards.push(0, config.GAME_PRICE, config.GAME_PRICE * 2);

config.vocab = {
  exceptions: {
    notEnoughGolds: "Vous n'avez pas assez de golds pour jouer !"
  },
  endOfGameMessages: {
    lostTheGame: 'Vous avez perdu !',
    neutral: 'Vous avez récupéré votre mise !',
    won: (amount) => `Vous avez gagné ${amount - config.GAME_PRICE} golds !`
  }
};

Object.freeze(config);
Object.freeze(config.chestRewards);

Object.freeze(config.vocab);
Object.freeze(config.vocab.exceptions);
Object.freeze(config.vocab.endOfGameMessages);

const cleanGoldsLocalStorageField = () => localStorage.setItem(config.localStorage.GOLDS_KEY, config.DEFAULT_GOLDS);

function getGolds() {
  const getMaybeGolds = () => parseInt(localStorage.getItem(config.localStorage.GOLDS_KEY));

  if (isNaN(getMaybeGolds())) {
    cleanGoldsLocalStorageField();
    return getMaybeGolds();
  }

  return getMaybeGolds();
}

function updateResultIndicator(maybeReward = null) {
  const resultIndicatorElement = document.getElementById(config.domIds.RESULT_INDICATOR);

  if (maybeReward === null) {
    resultIndicatorElement.innerText = '';
    return;
  }

  const rewardAndVocabAssoc = {
    0: config.vocab.endOfGameMessages.lostTheGame,
    [config.GAME_PRICE]: config.vocab.endOfGameMessages.neutral,
    otherwise: config.vocab.endOfGameMessages.won(maybeReward)
  };

  resultIndicatorElement.innerText = rewardAndVocabAssoc[maybeReward] ?? rewardAndVocabAssoc.otherwise;
}

function updateMoneyIndicators() {
  const golds = getGolds();

  const goldsIndicatorElement = document.getElementById(config.domIds.GOLDS_INDICATOR);
  const priceIndicatorElement = document.getElementById(config.domIds.PRICE_INDICATOR);

  goldsIndicatorElement.innerText = golds;
  priceIndicatorElement.innerText = config.GAME_PRICE;
}

function reward(amount) {
  const golds = getGolds();

  localStorage.setItem(config.localStorage.GOLDS_KEY, golds + amount);
  updateMoneyIndicators();
}

function pay() {
  const amount = config.GAME_PRICE;
  const golds = getGolds();

  if (golds < amount) {
    throw new Error(config.vocab.exceptions.notEnoughGolds);
  }

  localStorage.setItem(config.localStorage.GOLDS_KEY, golds - amount);
  updateMoneyIndicators();
}

const getRandomChestReward = () => config.chestRewards[Math.floor(Math.random() * config.chestRewards.length)];

function hitChest() {
  try {
    pay();
    const randomReward = getRandomChestReward();

    reward(randomReward);
    updateResultIndicator(randomReward);
  } catch (error) {
    alert(error.message);
  }
}

function initialize() {
  updateMoneyIndicators();
  updateResultIndicator();
}

initialize();
