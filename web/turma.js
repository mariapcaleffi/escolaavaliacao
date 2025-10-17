document.addEventListener("DOMContentLoaded", async () => {
  const turmaId = new URLSearchParams(window.location.search).get("id");
  const turmaNomeEl = document.getElementById("turmaNome");
  const lista = document.getElementById("atividadesList");

  // 🔹 Carregar nome da turma
  try {
    const respTurma = await fetch(`http://localhost:5000/turmas/${turmaId}`);
    const turma = await respTurma.json();
    turmaNomeEl.textContent = turma.nome || "Turma";
  } catch (err) {
    console.error("Erro ao carregar turma:", err);
  }

  // 🔹 Carregar atividades
  async function carregarAtividades() {
    try {
      const resp = await fetch(`http://localhost:5000/atividades/turma/${turmaId}`);
      const atividades = await resp.json();

      lista.innerHTML = "";
      if (!atividades.length) {
        lista.innerHTML = `<li>Nenhuma atividade cadastrada.</li>`;
        return;
      }

      atividades.forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a.descricao;
        lista.appendChild(li);
      });
    } catch (err) {
      console.error("Erro ao carregar atividades:", err);
      lista.innerHTML = `<li>Erro ao carregar atividades.</li>`;
    }
  }

  await carregarAtividades();

  // === MODAL ===
  const modal = document.getElementById("modalAtv");
  const openBtn = document.getElementById("openNewAtv");
  const closeBtn = document.getElementById("closeAtv");
  const form = document.getElementById("formAtv");

  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // === Cadastrar nova atividade ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const descricao = document.getElementById("descricaoAtv").value.trim();
    if (!descricao) {
      alert("Digite uma descrição!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/atividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ descricao, turmaId: Number(turmaId) }),
      });

      if (response.ok) {
        alert("Atividade cadastrada com sucesso!");
        modal.style.display = "none";
        form.reset();
        await carregarAtividades();
      } else {
        alert("Erro ao cadastrar atividade.");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Falha na conexão com o servidor.");
    }
  });
});
