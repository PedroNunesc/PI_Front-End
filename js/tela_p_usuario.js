const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

if (!token) window.location.href = "login.html";

let userId = null;

const nameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const currentPasswordInput = document.getElementById("currentPasswordInput");
const profilePreview = document.getElementById("profilePreview");
const saveBtn = document.querySelector(".btn-save");
const logoutBtn = document.querySelector(".btn-logout");
const deleteBtn = document.querySelector(".btn-delete-account");
const passwordWarning = document.getElementById("passwordWarning");

/* ===== CARREGAR USUÁRIO ===== */
async function loadUser() {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const user = await res.json();
  userId = user.id;

  nameInput.value = user.name || "";
  emailInput.value = user.email || "";

  profilePreview.src = user.profilePhotoUrl || "../assets/perfil.png";
}

/* ===== SALVAR ===== */
saveBtn.addEventListener("click", async () => {
  if (passwordInput.value && !currentPasswordInput.value) {
    passwordWarning.textContent = "Informe a senha atual";
    return;
  }

  const body = {};
  if (nameInput.value) body.name = nameInput.value;
  if (emailInput.value) body.email = emailInput.value;
  if (passwordInput.value) body.password = passwordInput.value;

  await fetch(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  alert("Perfil atualizado!");
});

/* ===== LOGOUT ===== */
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

/* ===== DELETE ===== */
deleteBtn.addEventListener("click", async () => {
  if (!confirm("Deseja apagar sua conta?")) return;

  await fetch(`${API_URL}/users/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  localStorage.clear();
  window.location.href = "login.html";
});

loadUser();
