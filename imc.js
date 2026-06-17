// ── Mapa de faixas de IMC ─────────────────────────────────────────
// Cada entrada define: limite superior, cor, rótulo, faixa da tabela,
// cor do badge e cor de texto do badge
var FAIXAS = [
  { limite: 18.5, cor: '#4A9EFF', label: 'Abaixo do peso',   faixa: 'baixo',  bgBadge: 'rgba(74,158,255,0.15)',  textBadge: '#4A9EFF' },
  { limite: 25,   cor: '#C8F135', label: 'Peso normal',       faixa: 'normal', bgBadge: 'rgba(200,241,53,0.15)', textBadge: '#8FAF1E' },
  { limite: 30,   cor: '#FFB830', label: 'Sobrepeso',          faixa: 'sobre',  bgBadge: 'rgba(255,184,48,0.15)', textBadge: '#FFB830' },
  { limite: 35,   cor: '#FF6B35', label: 'Obesidade  ·  I',   faixa: 'ob1',    bgBadge: 'rgba(255,107,53,0.15)', textBadge: '#FF6B35' },
  { limite: 40,   cor: '#E63946', label: 'Obesidade  ·  II',  faixa: 'ob2',    bgBadge: 'rgba(230,57,70,0.15)',  textBadge: '#E63946' },
  { limite: Infinity, cor: '#9B1D20', label: 'Obesidade  ·  III', faixa: 'ob3', bgBadge: 'rgba(155,29,32,0.15)', textBadge: '#C0484C' },
];

// ── Função principal ───────────────────────────────────────────────
function calcular() {

  // Lê e converte os valores dos campos
  var peso     = parseFloat(document.getElementById('peso').value);
  var alturaCm = parseFloat(document.getElementById('altura').value);

  // Valida: aborta se faltarem dados ou forem inválidos
  if (!peso || !alturaCm || peso <= 0 || alturaCm <= 0) {
    sacudir(); // micro-animação de erro nos inputs
    return;
  }

  // Converte altura de cm para metros
  var alturaM = alturaCm / 100;

  // Fórmula do IMC: peso (kg) / altura² (m²)
  var imc = peso / (alturaM * alturaM);

  // Formata com 1 casa decimal
  var imcStr = imc.toFixed(1);

  // ── Determina a faixa ──────────────────────────────────────────
  // Percorre o array até encontrar a primeira faixa cujo limite
  // seja maior que o IMC calculado
  var faixaAtual = FAIXAS.find(function(f) { return imc < f.limite; });

  // ── Atualiza número grande (placar) ───────────────────────────
  var elNumero = document.getElementById('imc-val');
  elNumero.textContent = imcStr;
  elNumero.style.color = faixaAtual.cor;

  // ── Atualiza badge de classificação ───────────────────────────
  var elBadge = document.getElementById('imc-badge');
  elBadge.textContent = faixaAtual.label;
  elBadge.style.background = faixaAtual.bgBadge;
  elBadge.style.color       = faixaAtual.textBadge;

  // ── Move ponteiro no espectro ──────────────────────────────────
  // Mapeia o IMC para a escala de 0–40 e converte em porcentagem
  var pct = Math.min((imc / 40) * 100, 100);
  document.getElementById('imc-pointer').style.left = pct.toFixed(1) + '%';

  // ── Destaca a linha ativa na tabela de referência ─────────────
  // Remove a classe "ativa" de todas as linhas antes de aplicar
  document.querySelectorAll('.ref-linha').forEach(function(linha) {
    linha.classList.remove('ativa');
  });
  // Adiciona "ativa" apenas na linha correspondente à faixa atual
  var linhaAtiva = document.querySelector('.ref-linha[data-faixa="' + faixaAtual.faixa + '"]');
  if (linhaAtiva) linhaAtiva.classList.add('ativa');

  // ── Exibe o card de resultado (estava display:none) ───────────
  var elResultado = document.getElementById('resultado');
  elResultado.style.display = 'flex';

  // Reinicia a animação de entrada a cada novo cálculo
  elResultado.style.animation = 'none';
  elResultado.offsetHeight;   // força reflow para reiniciar o keyframe
  elResultado.style.animation = '';
}

// ── Micro-animação de erro nos inputs ─────────────────────────────
// Sacude levemente o formulário quando dados estão ausentes/inválidos
function sacudir() {
  var row = document.querySelector('.inputs-row');
  row.style.animation = 'none';
  row.offsetHeight;
  row.style.animation = 'sacudir 0.35s ease';
}

// Injeta o keyframe de sacudida via CSS dinâmico
var style = document.createElement('style');
style.textContent = '@keyframes sacudir { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }';
document.head.appendChild(style);

// ── Atalho Enter ──────────────────────────────────────────────────
// Permite acionar o cálculo sem clicar no botão
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calcular();
});