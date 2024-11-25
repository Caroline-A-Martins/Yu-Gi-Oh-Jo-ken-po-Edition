const state = {
    score:{
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points")
    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    playerSides:{
        player1: "player-cards",
        player1BOX : document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX : document.querySelector("#computer-cards"),
    },
    fieldCards:{
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    action:{
        button: document.getElementById("next-duel"),
    },
};

const pathImages = "./src/assets/icons/";

const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        WinOf:[1],
        LoseOf:[2],
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        WinOf:[2],
        LoseOf:[0],
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        WinOf:[0],
        LoseOf:[1],
    },
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length)
    return cardData[randomIndex].id;
}

async function createCardImage(idCard,fieldSide){
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",idCard);
    cardImage.classList.add("card");


    if(fieldSide === state.playerSides.player1) {

        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"))
        });

        cardImage.addEventListener("mouseover",()=>{
            drawSelectCard(idCard);
    
        });
    }
    
    return cardImage;
}

async function removeAllCardsImages(){

    let cards = state.playerSides.computerBOX
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img)=> img.remove())

    cards = state.playerSides.player1BOX
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img)=> img.remove())
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId,computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`;
}



async function drawButton(text){
    state.action.button.innerText = text;
    state.action.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId){
    let duelResults = "Empate!";
    let playerCard = cardData[playerCardId];

    if(playerCard.WinOf.includes(computerCardId)){
        duelResults = "Ganhou!"
        await playAudio("Win")
        state.score.playerScore++
    }

    if(playerCard.LoseOf.includes(computerCardId)){
        duelResults = "Perdeu!"
        await playAudio("Lose")
        state.score.computerScore++
    }

    return duelResults
}

async function drawSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide){
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard,fieldSide);
        
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.action.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
    init();
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try{
        audio.play();
    }catch {}
}

function init(){
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);
    bgm.play()
}

const bgm = document.getElementById("bgm")

init();
