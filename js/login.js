const loginButton = document.querySelector(".login-button");
const statusMsg = document.getElementById("status-msg");

loginButton.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Preencha email e senha");
    return;
  }

  statusMsg.innerText = "Conectando ao servidor...";

  await new Promise(resolve => setTimeout(resolve, 2000));

  const slowTimer = setTimeout(() => {
    statusMsg.innerText =
      "Servidor acordando 😴 Aguarde alguns segundos...";
  }, 3000);

  try {
    const response = await fetch("https://pi-back-end-oip6.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    clearTimeout(slowTimer);

    const data = await response.json();

    if (!response.ok) {
      statusMsg.innerText = "";
      alert(data.message || "Erro ao fazer login");
      return;
    }

    localStorage.setItem("token", data.token);

    const meResponse = await fetch("https://pi-back-end-oip6.onrender.com/api/me", {
      headers: {
        "Authorization": `Bearer ${data.token}`
      }
    });

    const user = await meResponse.json();
    localStorage.setItem("user", JSON.stringify(user));

    statusMsg.innerText = "Login realizado!";

    window.location.href = "./html/homepage.html";

  } catch (error) {
    clearTimeout(slowTimer);
    console.error(error);
    statusMsg.innerText = "";
    alert("Erro de conexão com o servidor");
  }
});

document.getElementById("btn-demo").addEventListener("click", async () => {
  statusMsg.innerText = "Conectando ao servidor...";

  await new Promise(resolve => setTimeout(resolve, 2000));

  const slowTimer = setTimeout(() => {
    statusMsg.innerText =
      "Servidor acordando 😴 Aguarde alguns segundos...";
  }, 3000);

  try {
    const res = await fetch("https://pi-back-end-oip6.onrender.com/api/auth/demo", { method: "POST" });

    clearTimeout(slowTimer);

    if (!res.ok) throw new Error("Erro ao logar como visitante");

    const data = await res.json();
    localStorage.setItem("token", data.token);

    window.location.href = "./html/homepage.html"; 
  } catch (err) {
    clearTimeout(slowTimer);
    console.error(err);
    statusMsg.innerText = "";
    alert("Não foi possível entrar como visitante.");
  }
});

fetch("https://pi-back-end-oip6.onrender.com/api/health").catch(() => {});
