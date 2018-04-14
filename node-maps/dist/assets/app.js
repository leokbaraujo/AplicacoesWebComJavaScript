window.onload = () => {
    let grid = document.querySelector("#grid");
    let button = document.querySelector("#send");
    button.addEventListener('click', save());
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

function save() {
    if (!navigator.geolocation) {
        alert('Seu browser não suporta geolocalização.</p>');
        return;
    }
    navigator.geolocation.getCurrentPosition(sucess, error, {
        enableHighAccuracy: true //essa propriedade habilitada melhora a precisão da localização
    });
    
    function sucess(position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const spinner = document.querySelector("#spinner");
        spinner.classList.add("is-active");

        axios
            .post('/geocode', { lat, lng })
            .then((response) => {
                let card = templanteCar(response.data.address, response.data.image);
                grid.innerHTML += card;
                spinner.classList.remove("is-active");
            })
            .catch((error) => {
                spinner.classList.remove("is-active");
            })
    }

    function error(err) {
        alert(err);
    }
}