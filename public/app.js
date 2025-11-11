const form = document.getElementById("regForm");
const msg = document.getElementById("msg");
const submitBtn = document.getElementById("submitBtn");

const phoneInput = document.querySelector('input[name="phone"]');
const emailInput = document.querySelector('input[name="email"]');

// 🔍 Real-time check for duplicate registration
async function checkDuplicate() {
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!email && !phone) return;

  try {
    const res = await fetch("/api/check-duplicate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone }),
    });

    const data = await res.json();

    if (data.exists) {
      msg.textContent = "⚠️ Registration already exists with this email or phone!";
      msg.style.color = "red";
      submitBtn.disabled = true;
    } else {
      msg.textContent = "";
      submitBtn.disabled = false;
    }
  } catch (err) {
    console.error("Error checking duplicate:", err);
  }
}

// Trigger check when leaving phone or email input field
phoneInput.addEventListener("blur", checkDuplicate);
emailInput.addEventListener("blur", checkDuplicate);

// 🧾 Handle registration form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = Object.fromEntries(new FormData(e.target).entries());

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  const data = await res.json();
  msg.textContent = data.message || "Registered successfully!";
  msg.style.color = data.message.includes("success") ? "green" : "red";

  e.target.reset();
  loadWinners(); // refresh winners list
});

// 🏆 Fetch and display winners
async function loadWinners() {
  const res = await fetch("/api/winners");
  const data = await res.json();

  const container = document.getElementById("winners");
  container.innerHTML = data.length
    ? data.map((w) => `<p>🎉 ${w.name} (${w.email})</p>`).join("")
    : "<p>No winners yet. Stay tuned!</p>";
}

 // ⏱️ Auto-hide welcome screen after 4 seconds
    setTimeout(() => {
      document.getElementById("welcomeScreen").style.animation = "fadeOut 1s forwards";
      setTimeout(() => {
        document.getElementById("welcomeScreen").style.display = "none";
        document.querySelector("main").style.display = "block";
      }, 1000);
    }, 4000);

loadWinners();
