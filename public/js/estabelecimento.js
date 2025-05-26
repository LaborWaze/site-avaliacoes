const listaComentarios = document.getElementById('lista-comentarios');
const form = document.getElementById('form-comentario');
const input = document.getElementById('comentario-input');
const seletorOrdenacao = document.getElementById('ordenar');

let comentarios = [];
let contador = 1;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  if (!texto) return;
  comentarios.push({
    numero: contador++,
    texto,
    likes: 0,
    curtido: false,
    timestamp: Date.now(),
    respostas: [],
    mostrarRespostas: true
  });
  input.value = '';
  renderizarComentarios();
});

seletorOrdenacao.addEventListener('change', renderizarComentarios);

function renderizarComentarios() {
  const criterio = seletorOrdenacao.value;
  let comentariosOrdenados = [...comentarios];

  if (criterio === 'recentes') {
    comentariosOrdenados.sort((a, b) => b.timestamp - a.timestamp);
  } else if (criterio === 'curtidas') {
    comentariosOrdenados.sort((a, b) => {
      if (b.likes === a.likes) return b.timestamp - a.timestamp;
      return b.likes - a.likes;
    });
  }

  listaComentarios.innerHTML = '';

  comentariosOrdenados.forEach((c) => {
    const div = document.createElement('div');
    div.classList.add('comentario');

    const id = document.createElement('div');
    id.classList.add('comentario-id');
    id.textContent = `Comentário ${c.numero}`;

    const texto = document.createElement('div');
    texto.classList.add('comentario-texto');
    texto.textContent = c.texto;

    const acoes = document.createElement('div');
    acoes.classList.add('acoes');

    const botaoCurtir = document.createElement('button');
    botaoCurtir.classList.add('curtir-btn');
    botaoCurtir.innerHTML = `${c.curtido ? '❤️' : '🤍'} ${c.likes}`;
    botaoCurtir.addEventListener('click', () => {
      c.curtido = !c.curtido;
      c.likes += c.curtido ? 1 : -1;
      renderizarComentarios();
    });

    const botaoResponder = document.createElement('button');
    botaoResponder.classList.add('responder-btn');
    botaoResponder.textContent = 'Responder';

    const campoResposta = document.createElement('form');
    campoResposta.classList.add('form-resposta');
    campoResposta.style.display = 'none';
    campoResposta.innerHTML = `
      <textarea placeholder="Escreva uma resposta..." required></textarea>
      <button type="submit">Enviar</button>
    `;

    botaoResponder.addEventListener('click', () => {
      campoResposta.style.display = campoResposta.style.display === 'none' ? 'flex' : 'none';
    });

    campoResposta.addEventListener('submit', (e) => {
      e.preventDefault();
      const textoResposta = campoResposta.querySelector('textarea').value.trim();
      if (textoResposta === '') return;
      c.respostas.push({
        texto: textoResposta,
        timestamp: Date.now(),
        likes: 0,
        curtido: false
      });
      c.mostrarRespostas = true;
      renderizarComentarios();
    });

    acoes.appendChild(botaoCurtir);
    acoes.appendChild(botaoResponder);

    div.appendChild(id);
    div.appendChild(texto);
    div.appendChild(acoes);
    div.appendChild(campoResposta);

    if (c.respostas.length > 0) {
      const respostaContainer = document.createElement('div');
      respostaContainer.classList.add('resposta-container');

      const botaoToggle = document.createElement('button');
      botaoToggle.classList.add('toggle-respostas-btn');
      botaoToggle.textContent = c.mostrarRespostas
        ? `Ocultar resposta${c.respostas.length > 1 ? 's' : ''}`
        : `Ver ${c.respostas.length} resposta${c.respostas.length > 1 ? 's' : ''}`;

      const listaRespostas = document.createElement('div');
      listaRespostas.classList.add('respostas');
      listaRespostas.style.display = c.mostrarRespostas ? 'block' : 'none';

      botaoToggle.addEventListener('click', () => {
        c.mostrarRespostas = !c.mostrarRespostas;
        renderizarComentarios();
      });

      c.respostas.forEach((r) => {
        const resposta = document.createElement('div');
        resposta.classList.add('comentario-resposta');

        const spanTexto = document.createElement('span');
        spanTexto.textContent = r.texto;

        const botaoCurtirResp = document.createElement('button');
        botaoCurtirResp.classList.add('curtir-btn');
        botaoCurtirResp.innerHTML = `${r.curtido ? '❤️' : '🤍'} ${r.likes}`;
        botaoCurtirResp.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopImmediatePropagation();
          r.curtido = !r.curtido;
          r.likes += r.curtido ? 1 : -1;
          renderizarComentarios();
        });

        resposta.appendChild(spanTexto);
        resposta.appendChild(botaoCurtirResp);
        listaRespostas.appendChild(resposta);
      });

      respostaContainer.appendChild(botaoToggle);
      respostaContainer.appendChild(listaRespostas);
      div.appendChild(respostaContainer);
    }

    listaComentarios.appendChild(div);
  });
}

renderizarComentarios();
