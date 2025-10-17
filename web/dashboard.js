document.addEventListener("DOMContentLoaded", async () => {
  const professorNome = localStorage.getItem("professorNome");
  const professorId = localStorage.getItem("professorId");

  // se o usuário tentar entrar sem login
  if (!professorId || !professorNome) {
    alert("Faça login novamente.");
    window.location.href = "/web/login/login.html";
    return;
  }

  // mostra o nome do professor
  document.querySelector("#professor-nome").textContent = professorNome;

  // carrega turmas
  try {
    const response = await fetch(`http://localhost:5000/turmas/${professorId}`);
    const turmas = await response.json();

    const tabela = document.querySelector("#tabela-turmas tbody");
    tabela.innerHTML = "";

    if (turmas.length === 0) {
      tabela.innerHTML = `<tr><td colspan="4">Nenhuma turma cadastrada.</td></tr>`;
      return;
    }

    turmas.forEach((turma) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${turma.id}</td>
        <td>${turma.nome}</td>
        <td>
          <a href="../web/turma.html?id=${turma.id}">Ver</a>
        </td>
        <td>
          <button class="excluir" data-id="${turma.id}">🗑️</button>
        </td>
      `;

      tabela.appendChild(tr);
    });

    // botão de excluir turma
    document.querySelectorAll(".excluir").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        if (confirm("Tem certeza que deseja excluir esta turma?")) {
          try {
            const resp = await fetch(`http://localhost:5000/turmas/${id}`, {
              method: "DELETE",
            });

            if (resp.ok) {
              alert("Turma excluída!");
              e.target.closest("tr").remove();
            } else {
              alert("Erro ao excluir turma.");
            }
          } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao excluir turma.");
          }
        }
      });
    });
  } catch (error) {
    console.error("Erro ao carregar turmas:", error);
    alert("Erro ao carregar as turmas. Tente novamente mais tarde.");
  }
});

// === MODAL DE CADASTRO ===
const modal = document.getElementById("modal");
const abrirModalBtn = document.getElementById("abrirModalBtn");
const fecharModalBtn = document.getElementById("fecharModalBtn");
const formCadastrarTurma = document.getElementById("formCadastrarTurma");

// abre o modal
abrirModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

// fecha o modal
fecharModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// fecha ao clicar fora do conteúdo
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// envia nova turma
formCadastrarTurma.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomeTurma").value.trim();
  const professorId = localStorage.getItem("professorId");

  if (!nome) {
    alert("Digite um nome para a turma!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/turmas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, professor_id: professorId }),
    });

    if (response.ok) {
      alert("Turma cadastrada com sucesso!");
      modal.style.display = "none";
      window.location.reload();
    } else {
      alert("Erro ao cadastrar turma.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro de conexão com o servidor.");
  }
});
