// ========================================
// DUMIDUUDDIPANA - MAIN JAVASCRIPT
// ========================================
// MOBILE MENU
function toggleMenu() {
  const navMenu = document.getElementById("navMenu");
  if (!navMenu) return;
  navMenu.classList.toggle("mobile-open");
}
// CLOSE MOBILE MENU WHEN LINK IS CLICKED
document.addEventListener("DOMContentLoaded", function () {
  const navMenu = document.getElementById("navMenu");
  if (!navMenu) return;
  const links = navMenu.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navMenu.classList.remove("mobile-open");
    });
  });
});
// REGISTER FORM
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const name =
      document.getElementById("name").value.trim();
    const email =
      document.getElementById("email").value.trim();
    const password =
      document.getElementById("password").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;
    const message =
      document.getElementById("registerMessage");
    if (password !== confirmPassword) {
      message.textContent =
        "Passwords do not match.";
      return;
    }
    message.textContent =
      "Account form submitted successfully.";
  });
}
// LOGIN FORM
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const message =
      document.getElementById("loginMessage");
    message.textContent =
      "Login system will be connected to the secure backend.";
  });
}
