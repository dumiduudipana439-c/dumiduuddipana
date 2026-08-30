/* =========================================
   DUMIDUUDDIPANA
   AUTH + SUPABASE + DASHBOARD + PROTECTION
   FINAL CLEAN VERSION
   ========================================= */


/* =========================================
   SUPABASE CONFIG
   ========================================= */

const SUPABASE_URL =
  "https://ggukgsxjbrnkkdzukqka.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_7SzuHUW5E7SjmLVr3Ao7qg_xNCoQ5QK";


/* =========================================
   WEBSITE URL
   ========================================= */

const WEBSITE_URL =
  "https://dumiduudipana439-c.github.io/dumiduuddipana";


/* =========================================
   SUPABASE CLIENT
   ========================================= */

let supabaseClient = null;


/* =========================================
   START SUPABASE
   ========================================= */

function startSupabase() {

  if (!window.supabase) {

    console.error(
      "Supabase library was not loaded."
    );

    return false;
  }

  try {

    supabaseClient =
      window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
      );

    return true;

  } catch (error) {

    console.error(
      "Supabase initialization error:",
      error
    );

    return false;
  }
}


/* =========================================
   MOBILE MENU
   ========================================= */

function toggleMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.toggle("mobile-open");
}


/* =========================================
   CLOSE MOBILE MENU
   ========================================= */

function closeMobileMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.remove("mobile-open");
}


/* =========================================
   MOBILE LINKS
   ========================================= */

function setupMobileLinks() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  const links =
    navMenu.querySelectorAll("a");

  links.forEach(function (link) {

    link.addEventListener(
      "click",
      closeMobileMenu
    );

  });
}


/* =========================================
   GET CURRENT USER
   ========================================= */

async function getCurrentUser() {

  if (!supabaseClient) {
    return null;
  }

  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();

    if (error) {

      console.error(
        "Get user error:",
        error
      );

      return null;
    }

    return data?.user || null;

  } catch (error) {

    console.error(
      "Get user exception:",
      error
    );

    return null;
  }
}


/* =========================================
   UPDATE NAVIGATION
   ========================================= */

async function updateNavigation() {

  if (!supabaseClient) return;

  const user =
    await getCurrentUser();


  const navLogin =
    document.getElementById("navLogin");

  const navRegister =
    document.getElementById("navRegister");

  const navDashboard =
    document.getElementById("navDashboard");

  const navLogout =
    document.getElementById("navLogout");

  const menuLogoutButton =
    document.getElementById(
      "menuLogoutButton"
    );

  const heroButtons =
    document.getElementById(
      "heroButtons"
    );


  /* =======================================
     LOGGED OUT
     ======================================= */

  if (!user) {

    if (navLogin) {

      navLogin.style.display =
        "inline-flex";

    }

    if (navRegister) {

      navRegister.style.display =
        "inline-flex";

    }

    if (navDashboard) {

      navDashboard.style.display =
        "none";

    }

    if (navLogout) {

      navLogout.style.display =
        "none";

    }

    if (menuLogoutButton) {

      menuLogoutButton.style.display =
        "none";

    }

    return;
  }


  /* =======================================
     LOGGED IN
     ======================================= */

  if (navLogin) {

    navLogin.style.display =
      "none";

  }

  if (navRegister) {

    navRegister.style.display =
      "none";

  }

  if (navDashboard) {

    navDashboard.style.display =
      "inline-flex";

  }

  if (navLogout) {

    navLogout.style.display =
      "inline-flex";

  }

  if (menuLogoutButton) {

    menuLogoutButton.style.display =
      "block";

  }


  /* =======================================
     HOME HERO
     ======================================= */

  if (heroButtons) {

    heroButtons.innerHTML = `

      <a
        href="dashboard.html"
        class="btn primary"
      >
        Open Dashboard →
      </a>

    `;

  }

}


/* =========================================
   LOGIN FORM
   ========================================= */

function setupLoginForm() {

  const loginForm =
    document.getElementById(
      "loginForm"
    );

  if (!loginForm) return;


  if (
    loginForm.dataset.initialized ===
    "true"
  ) {

    return;

  }

  loginForm.dataset.initialized =
    "true";


  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();
      event.stopPropagation();


      const emailInput =
        document.getElementById(
          "loginEmail"
        );

      const passwordInput =
        document.getElementById(
          "loginPassword"
        );

      const message =
        document.getElementById(
          "loginMessage"
        );

      const button =
        loginForm.querySelector(
          'button[type="submit"]'
        );


      const email =
        emailInput?.value.trim();

      const password =
        passwordInput?.value;


      /* VALIDATION */

      if (!email) {

        if (message) {

          message.textContent =
            "❌ Please enter your email.";

        }

        emailInput?.focus();

        return;
      }


      if (!password) {

        if (message) {

          message.textContent =
            "❌ Please enter your password.";

        }

        passwordInput?.focus();

        return;
      }


      if (!supabaseClient) {

        if (message) {

          message.textContent =
            "❌ Connection error. Please refresh.";

        }

        return;
      }


      /* LOADING */

      if (button) {

        button.disabled = true;

        button.innerHTML =
          "Logging in... ⏳";

      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth
            .signInWithPassword({

              email: email,

              password: password

            });


        if (error) {

          console.error(
            "Login error:",
            error
          );

          if (message) {

            message.textContent =
              "❌ " + error.message;

          }

          if (button) {

            button.disabled = false;

            button.innerHTML =
              "Login →";

          }

          return;
        }


        if (data?.user) {

          if (message) {

            message.textContent =
              "✅ Login successful!";

          }

          if (button) {

            button.innerHTML =
              "Success ✓";

          }


          setTimeout(
            function () {

              window.location.href =
                WEBSITE_URL +
                "/dashboard.html";

            },
            500
          );

          return;
        }


      } catch (error) {

        console.error(
          "Login exception:",
          error
        );

        if (message) {

          message.textContent =
            "❌ Unable to login. Please try again.";

        }

        if (button) {

          button.disabled = false;

          button.innerHTML =
            "Login →";

        }

      }

    }
  );

}


/* =========================================
   REGISTER FORM
   ========================================= */

function setupRegisterForm() {

  const registerForm =
    document.getElementById(
      "registerForm"
    );

  if (!registerForm) return;


  if (
    registerForm.dataset.initialized ===
    "true"
  ) {

    return;

  }

  registerForm.dataset.initialized =
    "true";


  registerForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();
      event.stopPropagation();


      const nameInput =
        document.getElementById("name");

      const emailInput =
        document.getElementById("email");

      const passwordInput =
        document.getElementById("password");

      const confirmPasswordInput =
        document.getElementById(
          "confirmPassword"
        );

      const message =
        document.getElementById(
          "registerMessage"
        );

      const button =
        registerForm.querySelector(
          'button[type="submit"]'
        );


      const name =
        nameInput?.value.trim();

      const email =
        emailInput?.value.trim();

      const password =
        passwordInput?.value;

      const confirmPassword =
        confirmPasswordInput?.value;


      /* VALIDATION */

      if (!name) {

        if (message)
          message.textContent =
            "❌ Please enter your name.";

        nameInput?.focus();

        return;
      }


      if (!email) {

        if (message)
          message.textContent =
            "❌ Please enter your email.";

        emailInput?.focus();

        return;
      }


      if (!password) {

        if (message)
          message.textContent =
            "❌ Please create a password.";

        passwordInput?.focus();

        return;
      }


      if (password.length < 8) {

        if (message)
          message.textContent =
            "❌ Password must be at least 8 characters.";

        passwordInput?.focus();

        return;
      }


      if (
        password !==
        confirmPassword
      ) {

        if (message)
          message.textContent =
            "❌ Passwords do not match.";

        confirmPasswordInput?.focus();

        return;
      }


      if (!supabaseClient) {

        if (message)
          message.textContent =
            "❌ Connection error. Please refresh.";

        return;
      }


      if (button) {

        button.disabled = true;

        button.textContent =
          "Creating Account...";

      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth
            .signUp({

              email: email,

              password: password,

              options: {

                data: {

                  full_name: name

                },

                emailRedirectTo:
                  WEBSITE_URL +
                  "/login.html"

              }

            });


        if (error) {

          console.error(
            "Register error:",
            error
          );

          if (message)
            message.textContent =
              "❌ " + error.message;

          if (button) {

            button.disabled = false;

            button.textContent =
              "Create Account";

          }

          return;
        }


        if (message) {

          if (data?.session) {

            message.textContent =
              "✅ Account created successfully!";

          } else {

            message.textContent =
              "✅ Account created! Check your email.";

          }

        }


        if (button) {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }


      } catch (error) {

        console.error(
          "Register exception:",
          error
        );

        if (message)
          message.textContent =
            "❌ Something went wrong.";

        if (button) {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }

      }

    }
  );

}


/* =========================================
   LOGOUT FUNCTION
   ========================================= */

async function logoutUser(button) {

  if (!supabaseClient) {

    console.error(
      "Supabase is not ready."
    );

    return;
  }


  if (button) {

    button.disabled = true;

    button.textContent =
      "Logging out...";

  }


  try {

    const {
      error
    } =
      await supabaseClient.auth
        .signOut();


    if (error) {

      console.error(
        "Logout error:",
        error
      );

      if (button) {

        button.disabled = false;

        button.textContent =
          "Logout";

      }

      alert(
        "Logout failed. Please try again."
      );

      return;
    }


    /* CLEAR LOCAL SESSION */

    try {

      localStorage.clear();

    } catch (e) {

      console.log(
        "Local storage clear skipped."
      );

    }


    /* GO HOME */

    window.location.replace(
      WEBSITE_URL +
      "/index.html"
    );


  } catch (error) {

    console.error(
      "Logout exception:",
      error
    );

    if (button) {

      button.disabled = false;

      button.textContent =
        "Logout";

    }

  }

}


/* =========================================
   SETUP ALL LOGOUT BUTTONS
   ========================================= */

function setupLogout() {

  const logoutButtons =
    document.querySelectorAll(
      "#navLogout, #menuLogoutButton, #logoutButton"
    );


  if (!logoutButtons.length) return;


  logoutButtons.forEach(
    function (button) {

      if (
        button.dataset.initialized ===
        "true"
      ) {

        return;

      }

      button.dataset.initialized =
        "true";


      button.addEventListener(
        "click",
        async function (event) {

          event.preventDefault();
          event.stopPropagation();

          await logoutUser(button);

        }
      );

    }
  );

}


/* =========================================
   PROTECTED CARDS - HOME
   ========================================= */

function setupProtectedCards() {

  const cards =
    document.querySelectorAll(
      ".protected-card"
    );

  const modal =
    document.getElementById(
      "loginModal"
    );

  const closeButton =
    document.getElementById(
      "modalClose"
    );


  if (
    !cards.length ||
    !modal
  ) {

    return;

  }


  cards.forEach(
    function (card) {

      if (
        card.dataset.initialized ===
        "true"
      ) {

        return;

      }

      card.dataset.initialized =
        "true";


      card.addEventListener(
        "click",
        async function (event) {

          event.preventDefault();


          const user =
            await getCurrentUser();


          /* NOT LOGGED IN */

          if (!user) {

            modal.classList.add(
              "show"
            );

            return;
          }


          /* LOGGED IN */

          const page =
            card.dataset.page;


          if (page) {

            window.location.href =
              page;

          }

        }
      );

    }
  );


  /* CLOSE */

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      function () {

        modal.classList.remove(
          "show"
        );

      }
    );

  }


  /* OUTSIDE CLICK */

  modal.addEventListener(
    "click",
    function (event) {

      if (
        event.target === modal
      ) {

        modal.classList.remove(
          "show"
        );

      }

    }
  );


  /* ESC */

  document.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Escape"
      ) {

        modal.classList.remove(
          "show"
        );

      }

    }
  );

}


/* =========================================
   PROTECT DASHBOARD
   ========================================= */

async function protectDashboard() {

  const isDashboard =
    window.location.pathname
      .toLowerCase()
      .includes(
        "dashboard.html"
      );


  if (!isDashboard) return;


  if (!supabaseClient) {

    window.location.replace(
      WEBSITE_URL +
      "/login.html"
    );

    return;
  }


  const user =
    await getCurrentUser();


  /* NOT LOGGED IN */

  if (!user) {

    window.location.replace(
      WEBSITE_URL +
      "/login.html"
    );

    return;
  }


  /* =======================================
     SHOW USER NAME
     ======================================= */

  const userName =
    document.getElementById(
      "userName"
    );


  if (userName) {

    const name =
      user.user_metadata
        ?.full_name;


    userName.textContent =
      name ||
      user.email ||
      "Student";

  }

}


/* =========================================
   AUTH STATE LISTENER
   ========================================= */

function setupAuthListener() {

  if (!supabaseClient) return;


  supabaseClient.auth.onAuthStateChange(
    async function (
      event,
      session
    ) {

      console.log(
        "Auth event:",
        event
      );


      await updateNavigation();


      /* If signed out */

      if (
        event === "SIGNED_OUT"
      ) {

        const isDashboard =
          window.location.pathname
            .toLowerCase()
            .includes(
              "dashboard.html"
            );


        if (isDashboard) {

          window.location.replace(
            WEBSITE_URL +
            "/login.html"
          );

        }

      }

    }
  );

}


/* =========================================
   PASSWORD SHOW / HIDE
   ========================================= */

function togglePassword(
  inputId,
  button
) {

  const input =
    document.getElementById(
      inputId
    );

  if (!input) return;


  if (
    input.type ===
    "password"
  ) {

    input.type =
      "text";


    if (button) {

      button.textContent =
        "🙈";

      button.setAttribute(
        "aria-label",
        "Hide password"
      );

    }

  } else {

    input.type =
      "password";


    if (button) {

      button.textContent =
        "👁";

      button.setAttribute(
        "aria-label",
        "Show password"
      );

    }

  }

}


/* =========================================
   PAGE LOAD
   ========================================= */

window.addEventListener(
  "DOMContentLoaded",
  async function () {


    /* START SUPABASE */

    const started =
      startSupabase();


    if (!started) {

      return;

    }


    /* LOGIN */

    setupLoginForm();


    /* REGISTER */

    setupRegisterForm();


    /* NAVIGATION */

    await updateNavigation();


    /* LOGOUT */

    setupLogout();


    /* PROTECTED CARDS */

    setupProtectedCards();


    /* MOBILE LINKS */

    setupMobileLinks();


    /* AUTH LISTENER */

    setupAuthListener();


    /* DASHBOARD */

    await protectDashboard();

  }
);
