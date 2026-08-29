/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + AUTH + PROTECTED CARDS
   FULL UPDATED SCRIPT
   ======================================== */


/* ========================================
   SUPABASE CONFIG
   ======================================== */

const SUPABASE_URL =
  "https://ggukgsxjbrnkkdzukqka.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_7SzuHUW5E7SjmLVr3Ao7qg_xNCoQ5QK";


/* ========================================
   WEBSITE URL
   ======================================== */

const WEBSITE_URL =
  "https://dumiduudipana439-c.github.io/dumiduuddipana";


/* ========================================
   SUPABASE CLIENT
   ======================================== */

let supabaseClient = null;


/* ========================================
   START SUPABASE
   ======================================== */

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


/* ========================================
   MOBILE MENU
   ======================================== */

function toggleMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.toggle(
    "mobile-open"
  );
}


/* ========================================
   CLOSE MOBILE MENU
   ======================================== */

function closeMobileMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.remove(
    "mobile-open"
  );
}


/* ========================================
   MOBILE NAV LINKS
   ======================================== */

function setupMobileLinks() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  const links =
    navMenu.querySelectorAll("a");

  links.forEach(function (link) {

    link.addEventListener(
      "click",
      function () {

        closeMobileMenu();

      }
    );

  });
}


/* ========================================
   UPDATE NAVIGATION
   ======================================== */

async function updateNavigation() {

  if (!supabaseClient) return;

  const navLogin =
    document.getElementById("navLogin");

  const navRegister =
    document.getElementById("navRegister");

  const navDashboard =
    document.getElementById("navDashboard");

  const navLogout =
    document.getElementById("navLogout");

  const heroButtons =
    document.getElementById("heroButtons");


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();


    const user =
      data?.user;


    /* ====================================
       LOGGED OUT
       ==================================== */

    if (error || !user) {

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

      return;
    }


    /* ====================================
       LOGGED IN
       ==================================== */

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


    /* ====================================
       HERO BUTTON
       ==================================== */

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

  } catch (error) {

    console.error(
      "Navigation error:",
      error
    );

  }
}


/* ========================================
   LOGIN
   ======================================== */

function setupLoginForm() {

  const loginForm =
    document.getElementById(
      "loginForm"
    );

  if (!loginForm) return;


  /* Prevent duplicate listeners */

  if (
    loginForm.dataset.initialized === "true"
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


      /* ==================================
         VALIDATION
         ================================== */

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


      /* ==================================
         SUPABASE CHECK
         ================================== */

      if (!supabaseClient) {

        if (message) {

          message.textContent =
            "❌ Connection error. Please refresh the page.";

        }

        return;

      }


      /* ==================================
         LOADING
         ================================== */

      if (button) {

        button.disabled = true;

        button.innerHTML = `
          <span>Logging in...</span>
          <span>⏳</span>
        `;

      }


      if (message) {

        message.textContent =
          "Checking your account...";

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


        /* ==================================
           LOGIN ERROR
           ================================== */

        if (error) {

          console.error(
            "Login error:",
            error
          );


          if (message) {

            message.textContent =
              "❌ " + error.message;

          }


          /* DO NOT CLEAR INPUTS */

          if (button) {

            button.disabled = false;

            button.innerHTML = `
              <span>Login</span>
              <span>→</span>
            `;

          }

          return;

        }


        /* ==================================
           SUCCESS
           ================================== */

        if (data?.user) {

          if (message) {

            message.textContent =
              "✅ Login successful!";

          }


          if (button) {

            button.disabled = true;

            button.innerHTML = `
              <span>Success!</span>
              <span>✓</span>
            `;

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


        /* ==================================
           UNKNOWN RESULT
           ================================== */

        if (message) {

          message.textContent =
            "❌ Login failed. Please try again.";

        }


        if (button) {

          button.disabled = false;

          button.innerHTML = `
            <span>Login</span>
            <span>→</span>
          `;

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

          button.innerHTML = `
            <span>Login</span>
            <span>→</span>
          `;

        }

      }

    }
  );

}


/* ========================================
   REGISTER
   ======================================== */

function setupRegisterForm() {

  const registerForm =
    document.getElementById(
      "registerForm"
    );

  if (!registerForm) return;


  /* Prevent duplicate listeners */

  if (
    registerForm.dataset.initialized === "true"
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
        document.getElementById(
          "name"
        );

      const emailInput =
        document.getElementById(
          "email"
        );

      const passwordInput =
        document.getElementById(
          "password"
        );

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


      /* ==================================
         VALIDATION
         ================================== */

      if (!name) {

        if (message) {

          message.textContent =
            "❌ Please enter your name.";

        }

        nameInput?.focus();

        return;

      }


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
            "❌ Please create a password.";

        }

        passwordInput?.focus();

        return;

      }


      if (password.length < 8) {

        if (message) {

          message.textContent =
            "❌ Password must be at least 8 characters.";

        }

        passwordInput?.focus();

        return;

      }


      if (!confirmPassword) {

        if (message) {

          message.textContent =
            "❌ Please confirm your password.";

        }

        confirmPasswordInput?.focus();

        return;

      }


      if (
        password !==
        confirmPassword
      ) {

        if (message) {

          message.textContent =
            "❌ Passwords do not match.";

        }

        confirmPasswordInput?.focus();

        return;

      }


      /* ==================================
         SUPABASE CHECK
         ================================== */

      if (!supabaseClient) {

        if (message) {

          message.textContent =
            "❌ Connection error. Please refresh the page.";

        }

        return;

      }


      /* ==================================
         LOADING
         ================================== */

      if (button) {

        button.disabled = true;

        button.textContent =
          "Creating Account...";

      }


      if (message) {

        message.textContent =
          "Creating your account...";

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


        /* ==================================
           REGISTER ERROR
           ================================== */

        if (error) {

          console.error(
            "Register error:",
            error
          );


          if (message) {

            message.textContent =
              "❌ " + error.message;

          }


          /* DO NOT CLEAR FORM */

          if (button) {

            button.disabled = false;

            button.textContent =
              "Create Account";

          }

          return;

        }


        /* ==================================
           SUCCESS
           ================================== */

        if (message) {

          if (
            data?.session
          ) {

            message.textContent =
              "✅ Account created successfully!";

          } else {

            message.textContent =
              "✅ Account created! Please check your email and confirm your account.";

          }

        }


        if (button) {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }


        /*
           We intentionally do NOT reset
           the form.
        */


      } catch (error) {

        console.error(
          "Register exception:",
          error
        );


        if (message) {

          message.textContent =
            "❌ Something went wrong. Please try again.";

        }


        if (button) {

          button.disabled = false;

          button.textContent =
            "Create Account";

        }

      }

    }
  );

}


/* ========================================
   LOGOUT
   ======================================== */

function setupLogout() {

  const logoutButton =
    document.getElementById(
      "navLogout"
    );

  if (!logoutButton) return;


  if (
    logoutButton.dataset.initialized === "true"
  ) {

    return;

  }

  logoutButton.dataset.initialized =
    "true";


  logoutButton.addEventListener(
    "click",
    async function () {

      if (!supabaseClient) return;


      logoutButton.disabled =
        true;

      logoutButton.textContent =
        "Logging out...";


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


          logoutButton.disabled =
            false;

          logoutButton.textContent =
            "Logout";

          return;

        }


        window.location.href =
          WEBSITE_URL +
          "/index.html";


      } catch (error) {

        console.error(
          "Logout exception:",
          error
        );


        logoutButton.disabled =
          false;

        logoutButton.textContent =
          "Logout";

      }

    }
  );

}


/* ========================================
   LOGIN REQUIRED MODAL
   ======================================== */

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


          if (!supabaseClient) {

            modal.classList.add(
              "show"
            );

            return;

          }


          try {

            const {
              data
            } =
              await supabaseClient.auth
                .getUser();


            const user =
              data?.user;


            /* ============================
               NOT LOGGED IN
               ============================ */

            if (!user) {

              modal.classList.add(
                "show"
              );

              return;

            }


            /* ============================
               LOGGED IN
               ============================ */

            const page =
              card.dataset.page;


            if (page) {

              window.location.href =
                page;

            }

          } catch (error) {

            console.error(
              "Protected card error:",
              error
            );


            modal.classList.add(
              "show"
            );

          }

        }
      );

    }
  );


  /* ======================================
     CLOSE BUTTON
     ====================================== */

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


  /* ======================================
     CLICK OUTSIDE
     ====================================== */

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


  /* ======================================
     ESCAPE KEY
     ====================================== */

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


/* ========================================
   AUTH STATE LISTENER
   ======================================== */

function setupAuthListener() {

  if (!supabaseClient) return;


  supabaseClient.auth.onAuthStateChange(
    function () {

      updateNavigation();

    }
  );

}


/* ========================================
   PROTECTED DASHBOARD
   ======================================== */

async function protectDashboard() {

  const isDashboard =
    window.location.pathname
      .toLowerCase()
      .includes(
        "dashboard.html"
      );


  if (!isDashboard) return;

  if (!supabaseClient) return;


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth
        .getUser();


    if (
      error ||
      !data?.user
    ) {

      window.location.href =
        WEBSITE_URL +
        "/login.html";

      return;

    }


    /* ================================
       SHOW USER NAME
       ================================ */

    const userName =
      document.getElementById(
        "userName"
      );


    if (userName) {

      userName.textContent =
        data.user.user_metadata
          ?.full_name ||
        data.user.email ||
        "Student";

    }


  } catch (error) {

    console.error(
      "Dashboard protection error:",
      error
    );

    window.location.href =
      WEBSITE_URL +
      "/login.html";

  }

}


/* ========================================
   DASHBOARD LOGOUT BUTTON
   ======================================== */

function setupDashboardLogout() {

  const logoutButton =
    document.getElementById(
      "logoutButton"
    );

  if (!logoutButton) return;


  if (
    logoutButton.dataset.initialized ===
    "true"
  ) {

    return;

  }

  logoutButton.dataset.initialized =
    "true";


  logoutButton.addEventListener(
    "click",
    async function () {

      if (!supabaseClient) return;


      logoutButton.disabled =
        true;

      logoutButton.textContent =
        "Logging out...";


      try {

        const {
          error
        } =
          await supabaseClient.auth
            .signOut();


        if (error) {

          console.error(
            error
          );

          logoutButton.disabled =
            false;

          logoutButton.textContent =
            "Logout";

          return;

        }


        window.location.href =
          WEBSITE_URL +
          "/login.html";


      } catch (error) {

        console.error(
          error
        );

        logoutButton.disabled =
          false;

        logoutButton.textContent =
          "Logout";

      }

    }
  );

}


/* ========================================
   PASSWORD SHOW / HIDE
   ======================================== */

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
    input.type === "password"
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


/* ========================================
   PAGE LOAD
   ======================================== */

window.addEventListener(
  "load",
  async function () {

    /* ====================================
       START SUPABASE
       ==================================== */

    const started =
      startSupabase();


    if (!started) {

      console.error(
        "Supabase could not be started."
      );

      return;

    }


    /* ====================================
       LOGIN
       ==================================== */

    setupLoginForm();


    /* ====================================
       REGISTER
       ==================================== */

    setupRegisterForm();


    /* ====================================
       NAVIGATION
       ==================================== */

    await updateNavigation();


    /* ====================================
       LOGOUT
       ==================================== */

    setupLogout();


    /* ====================================
       PROTECTED CARDS
       ==================================== */

    setupProtectedCards();


    /* ====================================
       MOBILE MENU
       ==================================== */

    setupMobileLinks();


    /* ====================================
       AUTH LISTENER
       ==================================== */

    setupAuthListener();


    /* ====================================
       DASHBOARD
       ==================================== */

    await protectDashboard();


    /* ====================================
       DASHBOARD LOGOUT
       ==================================== */

    setupDashboardLogout();

  }
);
