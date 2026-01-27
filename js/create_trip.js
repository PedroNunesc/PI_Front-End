const token = localStorage.getItem("token");
if (!token) {
  alert("Você precisa estar logado.");
  window.location.href = "login.html";
}

const avatarImg = document.getElementById("user-avatar");
async function loadUserAvatar() {
  if (!avatarImg) return;
  const defaultAvatar = "../assets/perfil.png";

  try {
    const response = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro ao buscar usuário");

    const user = await response.json();
    avatarImg.src = user.profilePhotoUrl || defaultAvatar;

  } catch {
    avatarImg.src = defaultAvatar;
  }
}
loadUserAvatar();

// Permitir desmarcar o radio
let lastChecked = null;
document.querySelectorAll('input[name="tripType"]').forEach((radio) => {
  radio.addEventListener("click", function () {
    if (lastChecked === this) {
      this.checked = false;
      lastChecked = null;
    } else {
      lastChecked = this;
    }
  });
});

document.querySelector(".btn-primary").addEventListener("click", async () => {
  const name = document.getElementById("tripName").value.trim();
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const country = document.getElementById("country").value.trim();
  const city = document.getElementById("city").value.trim();
  const automaticList = document.getElementById("useDefaultList").checked;
  const selectedType = document.querySelector('input[name="tripType"]:checked');
  const typeValue = selectedType ? selectedType.value : "outro";

  if (!name || !startDate || !endDate || !country || !city) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/trip", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name, startDate, endDate, country, city, type: typeValue, automaticList })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Erro backend:", data);
      alert(data.message || "Erro ao criar viagem.");
      return;
    }

    alert("Viagem criada com sucesso!");
    window.location.href = "tela_mala.html";
  } catch (err) {
    console.error(err);
    alert("Erro inesperado no front-end.");
  }
});
