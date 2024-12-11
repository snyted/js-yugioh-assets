const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.querySelector("#score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player1: "player-cards",
    player1BOX: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBOX: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Blues Eyes White Dragon",
    type: "Paper",
    img: `${pathImages}dragon.png`,
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: `${pathImages}magician.png`,
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: `${pathImages}exodia.png`,
    winOf: [0],
    loseOf: [1],
  },
];

const playerSides = {
  player1: "player-cards",
  computer: "computer-cards",
};

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === playerSides.player1) {
    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });

    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await remoteAllCardsImages();

  let computerCardId = await getRandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await drawButton(duelResults);
  await updateScore();
}

async function updateScore() {
  console.log(state.score.playerScore, state.score.computerScore);
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}


async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "Draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "Win";
    
    state.score.playerScore++;
  }
  
  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "Lose";
    state.score.computerScore++;
  }

  await playAudio(duelResults);
  
  return duelResults;
}

async function remoteAllCardsImages() {
  let { player1BOX, computerBOX } = state.playerSides;
  let imgElements = computerBOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = player1BOX.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  console.log(state.cardSprites.avatar.src);
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "Selecione uma carta";
  state.cardSprites.type.innerText = "Atribute: ";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio (`./src/assets/audios/${status}.wav`);
  audio.play();
}

function init() {
  drawCards(5, "player-cards");
  drawCards(5, "computer-cards");
}

init();
