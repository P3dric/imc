let sexo = 'M';

function setSexo(s) {
  sexo = s;
  document.getElementById('btn-m').classList.toggle('active', s === 'M');
  document.getElementById('btn-f').classList.toggle('active', s === 'F');
}

const FAIXAS = [
  { min: 0,    max: 16,   label: 'Magreza grau III', risco: 'Muito elevado', cor: '#3A8FD4' },
  { min: 16,   max: 17,   label: 'Magreza grau II',  risco: 'Elevado',       cor: '#3A8FD4' },
  { min: 17,   max: 18.5, label: 'Magreza grau I',   risco: 'Moderado',      cor: '#5DB8E0' },
  { min: 18.5, max: 25,   label: 'Normal',           risco: 'Baixo',         cor: '#00D68F' },
  { min: 25,   max: 30,   label: 'Sobrepeso',        risco: 'Aumentado',     cor: '#FFCA28' },
  { min: 30,   max: 35,   label: 'Obesidade I',      risco: 'Moderado',      cor: '#FF7043' },
  { min: 35,   max: 40,   label: 'Obesidade II',     risco: 'Severo',        cor: '#E53935' },
  { min: 40,   max: 999,  label: 'Obesidade III',    risco: 'Muito severo',  cor: '#B71C1C' },
];

function classificar(imc) {
  return FAIXAS.find(f => imc >= f.min && imc < f.max) || FAIXAS[FAIXAS.length - 1];
}

function barPos(imc) {
  return Math.min(97, Math.max(3, (imc - 14) / (42 - 14) * 100));
}

function calcTMB(peso, altM, idade, sexo) {
  const cm = altM * 100;
  if (sexo === 'M') return Math.round(88.36 + 13.4 * peso + 4.8 * cm - 5.7 * idade);
  return Math.round(447.6 + 9.25 * peso + 3.1 * cm - 4.33 * idade);
}

function pillClass(faixa) {
  if (faixa.label === 'Normal') return 'pill-green';
  if (['Magreza grau I', 'Sobrepeso'].includes(faixa.label)) return 'pill-yellow';
  if (['Magreza grau II', 'Obesidade I'].includes(faixa.label)) return 'pill-orange';
  return 'pill-red';
}

function calcular() {
  const peso  = parseFloat(document.getElementById('peso').value);
  const altCm = parseFloat(document.getElementById('altura').value);
  const idade = parseInt(document.getElementById('idade').value);
  const erro  = document.getElementById('erro');

  if (!peso || !altCm || !idade || peso < 1 || altCm < 50 || idade < 2) {
    erro.style.display = 'block';
    return;
  }
  erro.style.display = 'none';

  const altM   = altCm / 100;
  const imc    = peso / (altM * altM);
  const faixa  = classificar(imc);
  const pIdeal = parseFloat((22 * altM * altM).toFixed(1));
  const pMin   = parseFloat((18.5 * altM * altM).toFixed(1));
  const pMax   = parseFloat((24.9 * altM * altM).toFixed(1));
  const diff   = parseFloat((peso - pIdeal).toFixed(1));
  const tmb    = calcTMB(peso, altM, idade, sexo);

  const res = document.getElementById('resultado');
  res.style.display = 'block';

  document.getElementById('imc-num').textContent = imc.toFixed(1);
  document.getElementById('imc-num').style.color = faixa.cor;

  document.getElementById('imc-label').textContent = faixa.label;
  document.getElementById('imc-label').style.color = faixa.cor;

  const pill = document.getElementById('imc-pill');
  pill.innerHTML = `<span class="pill-dot"></span>Risco ${faixa.risco.toLowerCase()}`;
  pill.className = 'pill ' + pillClass(faixa);

  document.getElementById('bar-thumb').style.left = barPos(imc) + '%';

  document.getElementById('m-ideal').textContent = pIdeal + ' kg';
  document.getElementById('m-faixa').textContent = pMin + '–' + pMax + ' kg';

  const sinal = diff > 0 ? '+' : '';
  document.getElementById('m-diff').textContent = sinal + diff + ' kg';
  document.getElementById('m-tmb').textContent = tmb.toLocaleString('pt-BR');

  const tbody = document.querySelector('#ref-table tbody');
  tbody.innerHTML = '';

  FAIXAS.forEach(f => {
    const ativo = imc >= f.min && imc < f.max;
    const faixaStr = f.max >= 999 ? `≥ ${f.min}` : `${f.min}–${f.max}`;
    const tr = document.createElement('tr');
    if (ativo) tr.classList.add('active-row');
    tr.innerHTML = `
      <td>${faixaStr}</td>
      <td><span class="dot" style="background:${f.cor}"></span>${f.label}</td>
      <td>${f.risco}</td>
    `;
    tbody.appendChild(tr);
  });

  res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter') calcular();
});