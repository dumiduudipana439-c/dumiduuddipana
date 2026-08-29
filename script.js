/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + AUTH + PROTECTED CARDS
   LOGIN + REGISTER + DASHBOARD
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

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  return true;
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


function closeMobileMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.remove(
    "mobile-open"
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

  registerForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();

      if (!supabaseClient) {

        showMessage(
          "registerMessage",
          "❌ Connection error. Please refresh the page."
        );

        return;
      }


      const name =
        document.getElementById(
          "name"
        )?.value.trim();


      const email =
        document.getElementById(
          "email"
        )?.value.trim();


      const password =
        document.getElementById(
          "password"
        )?.value;


      const confirmPassword =
        document.getElementById(
          "confirmPassword"
        )?.value;


      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword
      ) {

        showMessage(
          "registerMessage",
          "Please fill in all fields."
        );

        return;
      }


      if (
        password !== confirmPassword
      ) {

        showMessage(
          "registerMessage",
          "Passwords do not match."
        );

        return;
      }


      if (password.length < 8) {

        showMessage(
          "registerMessage",
          "Password must be at least 8 characters."
        );

        return;
      }


      showMessage(
        "registerMessage",
        "Creating your account..."
      );


      const submitButton =
        registerForm.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Creating Account...";
      }


      try {

        const {
          data,
          error
        } =
          await supabaseClient.auth.signUp({

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

          showMessage(
            "registerMessage",
            "❌ " + error.message
          );

          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.textContent =
              "Create Account";
          }

          return;
        }


        /* ==================================
           EMAIL CONFIRMATION
           ================================== */

        if (
          data?.user &&
          !data?.session
        ) {

          showMessage(
            "registerMessage",
            "✅ Account created! Please check your email and confirm your account."
          );

          registerForm.reset();

        } else {

          showMessage(
            "registerMessage",
            "✅ Account created successfully!"
          );


          setTimeout(
            function () {

              window.location.href =
                WEBSITE_URL +
                "/dashboard.html";

            },
            800
          );

        }


      } catch (error) {

        console.error(
          "Register error:",
          error
        );

        showMessage(
          "registerMessage",
          "❌ Something went wrong. Please try again."
        );

      }


      if (submitButton) {

        submitButton.disabled =
          false;

        submitButton.textContent =
          "Create Account";
      }

    }
  );
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


  loginForm.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (!supabaseClient) {

        showMessage(
          "loginMessage",
          "❌ Connection error. Please refresh the page."
        );

        return;
      }


      const email =
        document.getElementById(
          "loginEmail"
        )?.value.trim();


      const password =
        document.getElementById(
          "loginPassword"
        )?.value;


      if (
        !email ||
        !password
      ) {

        showMessage(
          "loginMessage",
          "Please enter your email and password."
        );

        return;
      }


      showMessage(
        "loginMessage",
        "Logging in..."
      );


      const submitButton =
        loginForm.querySelector(
          'button[type="submit"]'
        );


      if (submitButton) {

        submitButton.disabled =
          true;

        submitButton.textContent =
          "Logging in...";
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

          showMessage(
            "loginMessage",
            "❌ " + error.message
          );

          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.textContent =
              "Login";
          }

          return;
        }


        if (!data?.user) {

          showMessage(
            "loginMessage",
            "❌ Login failed. Please try again."
          );

          if (submitButton) {

            submitButton.disabled =
              false;

            submitButton.textContent =
              "Login";
          }

          return;
        }


        /* ==================================
           LOGIN SUCCESS
           ================================== */

        showMessage(
          "loginMessage",
          "✅ Login successful! Opening dashboard..."
        );


        setTimeout(
          function () {

            window.location.href =
              WEBSITE_URL +
              "/dashboard.html";

          },
          700
        );


      } catch (error) {

        console.error(
          "Login error:",
          error
        );

        showMessage(
          "loginMessage",
          "❌ Something went wrong. Please try again."
        );


        if (submitButton) {

          submitButton.disabled =
            false;

          submitButton.textContent =
            "Login";
        }

      }

    }
  );
}


/* ========================================
   MESSAGE HELPER
   ======================================== */

function showMessage(
  elementId,
  message
) {

  const element =
    document.getElementById(
      elementId
    );

  if (!element) return;

  element.textContent =
    message;
}


/* ========================================
   UPDATE NAVIGATION
   ======================================== */

async function updateNavigation() {

  if (!supabaseClient) return;


  const navLogin =
    document.getElementById(
      "navLogin"
    );

  const navRegister =
    document.getElementById(
      "navRegister"
    );

  const navDashboard =
    document.getElementById(
      "navDashboard"
    );

  const navLogout =
    document.getElementById(
      "navLogout"
    );


  try {

    const {
      data
    } =
      await supabaseClient.auth
        .getUser();


    const user =
      data?.user;


    if (!user) {

      /* ================================
         LOGGED OUT
         ================================ */

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


    /* ================================
       LOGGED IN
       ================================ */

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


  } catch (error) {

    console.error(
      "Navigation error:",
      error
    );

  }
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
          "Logout error:",
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
   PROTECTED CARDS
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
     ESCAPE
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
   MOBILE NAV LINKS
   ======================================== */

function setupMobileLinks() {

  const navMenu =
    document.getElementById(
      "navMenu"
    );

  if (!navMenu) return;


  const links =
    navMenu.querySelectorAll(
      "a"
    );


  links.forEach(
    function (link) {

      link.addEventListener(
        "click",
        function () {

          closeMobileMenu();

        }
      );

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
   PAGE LOAD
   ======================================== */

window.addEventListener(
  "load",
  async function () {

    /* ================================
       START SUPABASE
       ================================ */

    const started =
      startSupabase();


    if (!started) {

      console.error(
        "Supabase initialization failed."
      );

      return;
    }


    /* ================================
       AUTH FORMS
       ================================ */

    setupLoginForm();

    setupRegisterForm();


    /* ================================
       NAVIGATION
       ================================ */

    await updateNavigation();


    /* ================================
       LOGOUT
       ================================ */

    setupLogout();


    /* ================================
       PROTECTED CARDS
       ================================ */

    setupProtectedCards();


    /* ================================
       MOBILE MENU
       ================================ */

    setupMobileLinks();


    /* ================================
       AUTH LISTENER
       ================================ */

    setupAuthListener();

  }
);
