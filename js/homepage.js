const token = localStorage.getItem("token");
const avatarImg = document.getElementById("user-avatar");

async function loadUserAvatar() {
  if (!avatarImg) return;

  const defaultAvatar = "../assets/perfil.png";

  if (!token) {
    avatarImg.src = defaultAvatar;
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Usuário não encontrado");

    const user = await response.json();
    avatarImg.src = user.profilePhotoUrl || defaultAvatar;

  } catch (err) {
    console.error(err);
    avatarImg.src = defaultAvatar;
  }
}

loadUserAvatar();

document.querySelectorAll(".btn-principal").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const target = e.target.textContent.includes("VIAGEM") ? "create_trip.html" : "tela_mala.html";
    window.location.href = target;
  });
});
