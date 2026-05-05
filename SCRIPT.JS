//SERVE PARA COLOCAR A PLACA DO CARRO E ADICIONAR AO ESTACIONAMENTO
let carros = [];
let historico = [];  // são vetores e guardam varios dados 
let caixa = 0;


// data
function pegarDataHoje(){
 return new Date().toISOString().split("T")[0];
}
// verificar dia
function verificarDia() {

  const dataSalva = localStorage.getItem("data");
  const hoje = pegarDataHoje();

    if (dataSalva !== hoje) {
  if (dataSalva) {
  const chave = "historico_" + dataSalva;
localStorage.setItem(chave, JSON.stringify(historico));
  localStorage.setItem("caixa_" + dataSalva, caixa);
}
    carros = [];
    historico = [];
    caixa = 0;
    localStorage.setItem("carros", JSON.stringify(carros));
    localStorage.setItem("historico", JSON.stringify(historico));
    localStorage.setItem("caixa", caixa)
    localStorage.setItem("data", hoje);
  }

}

function salvarDados(){
//salva os arrays como texto (JSON)
localStorage.setItem("carros",JSON.stringify(carros));
localStorage.setItem("historico",JSON.stringify(historico));
localStorage.setItem("caica", caixa);
}

//carregar dados salvos 
function carregarDados() {
  const carrosSalvos = localStorage.getItem("carros");
  const historicoSalvo = localStorage.getItem("historico");

  const caixaSalvo = localStorage.getItem("caixa");
caixa = Number(caixaSalvo) || 0;


// se existir dados salvos de carros
if (carrosSalvos) {
  carros = JSON.parse(carrosSalvos).map(carro => ({...carro,
  entrada: new Date(carro.entrada) // transforma de volta em date 
}));
}
// se existir historico salvo
if (historicoSalvo) {
  historico = JSON.parse(historicoSalvo).map(carro => ({
 ...carro,
entrada: new Date(carro.entrada),
 saida: new Date(carro.saida)
  }));
}
}

// ADICIONAR CARRO
function adicionarCarro() {  // função é um bloco de código que executa uma tarefa 
  const input = document.getElementById("placa");  // pega o campo do HTML
  console.log(input);
  console.log(input.value);
  const placa = input.value.trim().toUpperCase();  
// value = pegar o campo que foi digitado
// trim() = remover espaços
// toUpperCase() = deixar maiúsculo

  if (placa ==="") {
// if = validação → impede vazio
  alert("DIGITE UMA PLACA!");
  return;
}

  const carro = {
  placa: placa,
  entrada: new Date()
// new date = horario atual
  };

  carros.push(carro); 
// push() = adicionar item 
salvarDados();  // salva sepre que adicona 
  atualizarTela();
  input.value = "";  // limpa o campo
  input.focus(); // volta o cursor
}

// CALCULAR VALOR
function calcularValor(entrada) {
  const agora = new Date();
  const tempoMs = agora - entrada;   // calcula o tempo em milissegundos 
  const tempoMin = tempoMs / 60000;  // converte para minutos

  const blocos = Math.ceil(tempoMin / 15);
// divide em blocos de 15 minutos e arredonda para cima ex. 10min = paga 15min, 16min = paga 30min
  return blocos * 3;   // cada bloco custa R$3,00
}

// FORMATAR TEMPO
function formatarTempo(ms) {
const totalSeg = Math.floor(ms / 1000);  // milissegundos →  segundos 
const min = Math.floor(totalSeg / 60);
const seg = totalSeg % 60;  // transforma em minutos + segundos 

return `${min}m ${seg}s`;
}

// ATUALIZAR TELA  *A MAIS IMPORTANTE*
function atualizarTela() {

const lista = document.getElementById("lista-carros");
lista.innerHTML = "";  // limpa a tela antes de atualizar 

carros.forEach((carro, index) => {  // pecorre todos os carros 

const agora = new Date();
const tempo = agora - carro.entrada;
const valor = calcularValor(carro.entrada);

const item = document.createElement("li");  //cria elemento HTML 

// item.innerHTML = mostra o conrteudo na tela              
item.innerHTML = ` 
<span class="placa">${carro.placa}</span> |
Entrada: ${carro.entrada.toLocaleTimeString()} <br>
Tempo: ${formatarTempo(tempo)} <br>
Valor: R$ ${valor},00
<button class="btn-sair" onclick="removerCarro(${index})">Sair</button> 
<hr>
`;
// <button onclick="removerCarro(${index})"> = cria botão que chama função

 lista.appendChild(item);
});
document.getElementById("caixa").textContent = caixa.toFixed(2);
}


// REMOVER CARRO
function removerCarro(index) {
const carro = carros[index];  // pega o carro

const agora = new Date();
const tempo = agora - carro.entrada;
const valor = calcularValor(carro.entrada);

 historico.push({   // salva no historico
  placa: carro.placa,
  entrada: carro.entrada,
 saida: agora,
  tempo: tempo,
  valor: valor
  });
caixa += valor;
  carros.splice(index, 1); //remove da lista
  salvarDados(); // salva depois de remover 

atualizarTela();
atualizarHistorico();
}

// HISTÓRICO
function atualizarHistorico() {
  const lista = document.getElementById("historico");
  lista.innerHTML = "";

  historico.forEach((carro) => {  // peecorre historico e mostra na tela 
 const item = document.createElement("li");

  item.innerHTML = `
 <span class="placa">${carro.placa} </span> | 
  Entrada: ${carro.entrada.toLocaleTimeString()} <br>
  Saída: ${carro.saida.toLocaleTimeString()} <br>
  Tempo: ${formatarTempo(carro.tempo)} <br>
  Pago: R$ ${carro.valor},00
  <hr>
  `;

 lista.appendChild(item);
  });
}

// ATUALIZA AUTOMATICAMENTE
setInterval(atualizarTela, 1000);  //roda a função a cada 1 segundo 
  
// document.getElementById("placa") = conecta o JS com o HTML

carregarDados();
verificarDia();
atualizarTela();
atualizarHistorico();