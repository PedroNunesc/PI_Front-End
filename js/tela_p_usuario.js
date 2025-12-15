const API_URL = "http://localhost:3000/api";
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

let userId = null;
let uploadedPhotoUrl = null;

const nameInput = document.getElementById("usernameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const currentPasswordInput = document.getElementById("currentPasswordInput");
const profilePreview = document.getElementById("profilePreview");
const photoInput = document.getElementById("photoInput");
const avatarHeader = document.getElementById("user-avatar");
const saveBtn = document.querySelector(".btn-save");
const logoutBtn = document.querySelector(".btn-logout");
const deleteBtn = document.querySelector(".btn-delete-account");
const passwordWarning = document.getElementById("passwordWarning");

async function loadUser() {
  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro ao buscar usuário");

    const user = await response.json();
    userId = user.id;

    nameInput.value = user.name || "";
    emailInput.value = user.email || "";

    if (user.profilePhotoUrl) {
      profilePreview.src = user.profilePhotoUrl;
      if (avatarHeader) avatarHeader.src = user.profilePhotoUrl;
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dados do usuário");
  }
}
loadUser();

photoInput.addEventListener("change", async () => {
  const file = photoInput.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "PedroNunes");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dpedjsvo/image/upload",
      { method: "POST", body: formData }
    );
    const data = await response.json();
    profilePreview.src = data.secure_url;
    if (avatarHeader) avatarHeader.src = data.secure_url;
    uploadedPhotoUrl = data.secure_url;
  } catch (err) {
    console.error(err);
    alert("Erro ao enviar imagem");
  }
});

saveBtn.addEventListener("click", async () => {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!name && !email && !password && !uploadedPhotoUrl) {
    alert("Nenhuma alteração para salvar");
    return;
  }

  if (password && !currentPasswordInput.value.trim()) {
    passwordWarning.textContent = "Informe sua senha atual para alterar a senha";
    return;
  } else {
    passwordWarning.textContent = "";
  }

  const body = {};
  if (name) body.name = name;
  if (email) body.email = email;
  if (password) body.password = password;
  if (uploadedPhotoUrl) body.profilePhotoUrl = uploadedPhotoUrl;

  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.message || "Erro ao salvar alterações");
      return;
    }

    const updatedUser = await res.json();
    localStorage.setItem("user", JSON.stringify(updatedUser));
    if (avatarHeader) avatarHeader.src = updatedUser.profilePhotoUrl || "assets/logo-partiu.png";
    alert("Alterações salvas com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar alterações");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "login.html";
});

deleteBtn.addEventListener("click", async () => {
  if (!confirm("Tem certeza que deseja apagar sua conta?")) return;

  try {
    const res = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Erro ao apagar conta");

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Conta apagada com sucesso!");
    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
    alert("Erro ao apagar conta");
  }
});
