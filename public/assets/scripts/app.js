const API_URL = "http://localhost:3000";

async function renderizaCardsJogadores() {
  const containerDosCards = document.getElementById("cards-jogadores");
  if (!containerDosCards) return;

  try {
    const resposta = await fetch(`${API_URL}/jogadores`);
    const jogadores = await resposta.json();

    let todoHtmlDosCards = "";
    jogadores.forEach((jogador) => {
      todoHtmlDosCards += `
        <a href="detalhes2.html?id=${jogador.id}" class="col card-link">
          <div class="card h-100">
            <img src="${jogador.imagem_principal}" class="card-img-top" alt="Foto de ${jogador.nome}">
            <div class="card-body">
              <h5 class="card-title">${jogador.nome}</h5>
              <p class="card-text">${jogador.posicao}</p>
            </div>
          </div>
        </a>
      `;
    });
    containerDosCards.innerHTML = todoHtmlDosCards;
  } catch (erro) {
    console.error("Erro ao buscar jogadores:", erro);
    containerDosCards.innerHTML =
      "<p class='text-danger'>Falha ao carregar jogadores. O servidor (json-server) está ligado?</p>";
  }
}

async function renderizaCarrosselDestaques() {
  const carouselContainer = document.getElementById("carousel-container");
  if (!carouselContainer) return;

  try {
    const resposta = await fetch(`${API_URL}/jogadores?destaque=true`);
    const jogadoresDestaque = await resposta.json();

    let todoHtmlDoCarrossel = "";
    jogadoresDestaque.forEach((jogador, index) => {
      const activeClass = index === 0 ? "active" : "";
      todoHtmlDoCarrossel += `
        <a href="detalhes2.html?id=${jogador.id}" class="carousel-item-link">
          <div class="carousel-item ${activeClass}">
            <img src="${jogador.imagem_principal}" class="d-block w-100" alt="Foto de ${jogador.nome}">
            <div class="carousel-caption d-none d-md-block">
              <h5>${jogador.nome}</h5>
              <p>${jogador.descricao}</p>
            </div>
          </div>
        </a>
      `;
    });
    carouselContainer.innerHTML = todoHtmlDoCarrossel;
  } catch (erro) {
    console.error("Erro ao buscar destaques:", erro);
  }
}

async function carregarNoticias() {
  const container = document.getElementById("noticias");
  if (!container) return;

  try {
    const resposta = await fetch(`${API_URL}/noticias`);
    const noticias = await resposta.json();

    container.innerHTML = "";
    noticias.forEach((noticia) => {
      container.innerHTML += `
            <div class="card mb-3 bg-light">
              <img src="${noticia.imagem}" class="card-img-top" alt="${noticia.titulo}" style="height: 150px; object-fit: cover;" />
              <div class="card-body">
                <h6 class="card-title fw-bold">${noticia.titulo}</h6>
                <p class="card-text small">${noticia.descricao}</p>
                <a href="detalhes.html?id=${noticia.id}" class="btn btn-primary btn-sm">Leia mais</a>
              </div>
            </div>
          `;
    });
  } catch (erro) {
    console.error("Erro ao buscar notícias:", erro);
    container.innerHTML =
      "<p class='text-danger'>Falha ao carregar notícias.</p>";
  }
}

async function renderizaDetalhesJogador() {
  const containerDetalhes = document.getElementById(
    "detalhe-jogador-container"
  );
  if (!containerDetalhes) return;

  const parametros = new URLSearchParams(window.location.search);
  const idDoJogador = parametros.get("id");
  if (!idDoJogador) {
    containerDetalhes.innerHTML =
      "<h2 class='text-center text-danger'>ID do jogador não fornecido!</h2>";
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/jogadores/${idDoJogador}`);
    const jogadorEncontrado = await resposta.json();

    if (jogadorEncontrado) {
      containerDetalhes.innerHTML = `
              <div class="row">
                  <div class="col-md-6">
                      <img src="${jogadorEncontrado.imagem_principal}" class="img-fluid rounded shadow" alt="Foto de ${jogadorEncontrado.nome}">
                  </div>
                  <div class="col-md-6">
                      <h2>${jogadorEncontrado.nome}</h2>
                      <h4 class="text-muted">${jogadorEncontrado.posicao}</h4>
                      <p class="lead mt-4">${jogadorEncontrado.descricao}</p>
                      <h3 class="mt-5">Estatísticas</h3>
                      <table class="table table-striped">
                          <tbody>
                              <tr><th>Nota Média</th><td>${jogadorEncontrado.estatisticas.nota}</td></tr>
                              <tr><th>Minutos Jogados</th><td>${jogadorEncontrado.estatisticas.minutos_jogados}</td></tr>
                              <tr><th>Gols</th><td>${jogadorEncontrado.estatisticas.gols}</td></tr>
                              <tr><th>Assistências</th><td>${jogadorEncontrado.estatisticas.assistencias}</td></tr>
                          </tbody>
                      </table>
                      
                      <button id="btn-excluir" class="btn btn-danger w-100 mt-3">Excluir Jogador</button>
                  </div>
              </div>
          `;

      const conquistasContainer = document.getElementById(
        "conquistas-container"
      );
      if (conquistasContainer && jogadorEncontrado.conquistas) {
        let conquistasHtml = "";
        jogadorEncontrado.conquistas.forEach((conquista) => {
          conquistasHtml += `
                      <div class="col">
                          <div class="card h-100 shadow-sm">
                              <img src="${conquista.imagem}" class="card-img-top" alt="${conquista.titulo}" style="height: 180px; object-fit: cover;">
                              <div class="card-body">
                                  <h6 class="card-title fw-bold">${conquista.titulo}</h6>
                                  <p class="card-text small">${conquista.descricao}</p>
                              </div>
                          </div>
                      </div>
                  `;
        });
        conquistasContainer.innerHTML = conquistasHtml;
      }

      document.getElementById("btn-excluir").addEventListener("click", () => {
        excluirJogador(idDoJogador);
      });
    } else {
      containerDetalhes.innerHTML =
        "<h2 class='text-center text-danger'>Jogador não encontrado!</h2>";
    }
  } catch (erro) {
    console.error("Erro ao buscar detalhes do jogador:", erro);
    containerDetalhes.innerHTML =
      "<h2 class='text-center text-danger'>Falha ao carregar dados do jogador.</h2>";
  }
}

async function adicionarNovoJogador(evento) {
  evento.preventDefault();

  const nome = document.getElementById("form-nome").value;
  const posicao = document.getElementById("form-posicao").value;
  const imagem = document.getElementById("form-imagem").value;

  const novoJogador = {
    nome: nome,
    posicao: posicao,
    imagem_principal:
      imagem || "https://placehold.co/600x400/CCCCCC/000000?text=Novo+Jogador",
    descricao: "Novo jogador adicionado via formulário.",
    destaque: false,
    estatisticas: { nota: 0, minutos_jogados: 0, gols: 0, assistencias: 0 },
    conquistas: [],
  };

  try {
    await fetch(`${API_URL}/jogadores`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoJogador),
    });

    alert("Novo jogador adicionado com sucesso!");
    document.getElementById("form-novo-jogador").reset();
    renderizaCardsJogadores();
  } catch (erro) {
    console.error("Erro ao adicionar jogador:", erro);
    alert("Falha ao adicionar jogador. Verifique o console.");
  }
}

async function excluirJogador(id) {
  if (confirm("Tem certeza que deseja excluir este jogador?")) {
    try {
      await fetch(`${API_URL}/jogadores/${id}`, {
        method: "DELETE",
      });

      alert("Jogador excluído com sucesso!");
      window.location.href = "index.html";
    } catch (erro) {
      console.error("Erro ao excluir jogador:", erro);
      alert("Falha ao excluir jogador. Verifique o console.");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("cards-jogadores")) {
    renderizaCardsJogadores();
    renderizaCarrosselDestaques();
    carregarNoticias();

    const formNovoJogador = document.getElementById("form-novo-jogador");
    if (formNovoJogador) {
      formNovoJogador.addEventListener("submit", adicionarNovoJogador);
    }
  }

  if (document.getElementById("detalhe-jogador-container")) {
    renderizaDetalhesJogador();
  }
});
