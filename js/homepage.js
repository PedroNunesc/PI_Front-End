const token = localStorage.getItem("token");

const avatarImg = document.querySelector(".user-avatar");

async function loadUserAvatar() {
  if (!avatarImg) return;

  if (!token) {
    avatarImg.src = "../assets/placeholder-avatar.png"; // corrigido
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/me", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Usuário não encontrado");

    const user = await response.json();
    avatarImg.src = user.profilePhotoUrl || "../assets/placeholder-avatar.png"; // corrigido

  } catch (err) {
    console.error(err);
    avatarImg.src = "../assets/placeholder-avatar.png"; // corrigido
  }
}

loadUserAvatar();

document.querySelector(".btn-principal").addEventListener("click", () => {
  window.location.href = "create_trip.html";
});
