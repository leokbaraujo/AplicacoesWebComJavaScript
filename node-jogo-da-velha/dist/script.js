window.onload = () => {
    new JogoVelha();
}

class JogoVelha {
    constructor() {
        this.iniciaElementos();
        this.iniciaEstado();
    }

    iniciaEstado() {
        this.turno = true;
        this.jogadas = [0,0,0,0,0,0,0,0,0];
        this.fim = false;
        this.vitoria = [448, 56, 7, 292, 146, 73, 273, 84];
    }

    iniciaElementos() {
        this.jogadorX = document.querySelector('#jogador-x');
        this.jogadorO = document.querySelector('#jogador-o');

        this.salvarLocal = document.querySelector('#salva-local');
        this.salvarLocal.addEventListener('click', this.salvaLocal.bind(this));

        this.carregarLocal = document.querySelector('#carrega-local');
        this.carregarLocal.addEventListener('click', this.carregaLocal.bind(this));

        this.limparLocal = document.querySelector('#limpar');
        this.limparLocal.addEventListener('click', this.limpaLocal.bind(this));

        this.salvar = document.querySelector('#salvar');
        this.salvar.addEventListener('click', this.enviarServidor.bind(this));

        this.velha = document.querySelector('#velha');
        this.velha.addEventListener('click', (event) => {
            this.realizaJogada(event);
            this.render();
        });
    }

    salvaLocal() {
        const dados = {
            jogadorX: this.jogadorX.value,
            jogadorO: this.jogadorO.value,
            jogadas: this.jogadas,
        }

        localStorage.setItem('jogo', JSON.stringify(dados));
    }

    carregaLocal() {
        const dados = JSON.parse(localStorage.getItem('jogo'));
        this.jogadas = dados.jogadas;
        this.render(dados);
    }

    limpaLocal() {
        localStorage.removeItem('jogo');
        this.jogadorO.value = '';
        this.jogadorX.value = '';
        this.iniciaEstado();
        this.render();
    }

    realizaJogada(event) {
        const id = event.target.dataset.id;
        if (this.fim) {
            this.modal('Partida Terminada');
            return;
        }
        //verificar se escolheram a casa correta
        if (!event.target.dataset.id) {
            this.modal('Você precisa clicar em uma casa');
            return;
        }
        //verifica se a posição é válidad
        if (this.jogadas[id] != 0) {
            this.modal('Esta posição já foi escolhida');
            return;
        }
        this.jogadas[id] = this.turno ? 'X' : 'O';
        this.turno = !this.turno;
    }

    verificaVitoria() {
        //decimal da sequencia de quem jogou x
        const valorX = parseInt(this.jogadas.map(value => value === 'X' ? 1 : 0).join(''), 2);
        //decimal da sequencia de quem jogou o
        const valorO = parseInt(this.jogadas.map(value => value === 'O' ? 1 : 0).join(''), 2);
        //percorrer array vitoria
        for (const element of this.vitoria) {
            if ((element & valorX) === element) {
                return 'X';
            }
            if ((element & valorO) === element) {
                return 'O';
            }
        }
        return '';
    }

    render(dados = undefined) {
        const resultado = this.verificaVitoria();
        if (resultado === 'X' || resultado === 'O') {
            this.fim = true;
            this.salvar.style.display = "block";
            this.modal(`O jogador ${resultado} venceu!`)
        } else {
            this.salvar.style.display = "none";
        }

        //interar nos elementos do tabuleiro
        if(dados) {
            this.jogadorX.value = dados.jogadorX;
            this.jogadorO.value = dados.jogadorO;
        }
        
        const velhaElement = document.querySelectorAll('[data-id]');
        for (let i = 0; i < 9; i++) {
            velhaElement[i].innerHTML = this.jogadas[i] === 0 ? '' : this.jogadas[i];  
        }
    }

    modal(mensagem) {
        const modais = document.querySelector("#modais");
        const modal = document.createElement("div");
        modal.innerHTML = mensagem;
        modal.classList.add("modalClass");
        modais.appendChild(modal);

        setTimeout(() => {
            modal.classList.add("remover");
            setTimeout(() => {
                modais.removeChild(modal);
            }, 1000);    
        }, 2000);
    }

    enviarServidor() {
        //receber o nome dos jogadores
        const jogadorX = this.jogadorX.value;
        const jogadorO = this.jogadorO.value;
        //criar uma imagem do tabuleiro
        domtoimage.toPng(this.velha, { width: '400', height: '400' })
                    .then((dataUrl) => {
                        //persistir os dados no servidor
                        return axios.post('/save', {
                                jogadorX, jogadorO, jogadas : JSON.stringify(this.jogadas),
                                img: dataUrl
                            });

                    })
                    .then((response) => {
                        this.modal('Dados enviados com sucesso');
                    })
                    .catch((error) => {
                        this.modal('Erro ao enviar dados ao servidor', error);
                    });
    }
}