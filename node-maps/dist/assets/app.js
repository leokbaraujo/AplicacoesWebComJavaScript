window.onload = () => {
    let grid = document.querySelector("#grid");
    let button = document.querySelector("#send");
    read();
};

function templanteCar(address, image) {
    return `
        <div class="demo-card-wide mdl-card mdl-shadow--2dp">
            <div class="mdl-card__title">
                <img src="${image}" alt="">
            </div>
            <div class="mdl-card__supporting-text">
                ${address}
            </div>
        </div>
    `; 
};

function read() {
    axios
        .get('/all')
        .then((response) => {
            response.data.forEach((element) => {
                let card = templanteCar(element.address, element.image);
                grid.innerHTML += card;
            });
        })
        .catch((error) => {
            console.error(`Erro ao executar leitura dos cards. ${error}`);
        });
};