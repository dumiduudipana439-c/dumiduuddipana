/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + MOBILE MENU
   ======================================== */


/* ========================================
   SUPABASE CONFIG
   ======================================== */

const SUPABASE_URL =
  "https://ggukgsxjbrnkkdzukqka.supabase.co";

const SUPABASE_KEY =
  "PASTE_YOUR_PUBLISHABLE_KEY_HERE";


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

    return;

  }

  if (
    SUPABASE_KEY ===
    "PASTE_YOUR_PUBLISHABLE_KEY_HERE"
  ) {

    console.error(
      "Supabase publishable key is missing."
    );

    return;

  }

  supabaseClient =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  setupAuthForms();

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

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const navMenu =
      document.getElementById("navMenu");

    if (!navMenu) return;

    const links =
      navMenu.querySelectorAll("a");

    links.forEach(function (link) {

      link.addEventListener(
        "click",
        function () {

          navMenu.classList.remove(
            "mobile-open"
          );

        }
      );

    });

  }
);


/* ========================================
   REGISTER + LOGIN
   ======================================== */

function setupAuthForms() {

  const registerForm =
    document.getElementById(
      "registerForm"
    );

  const loginForm =
    document.getElementById(
      "loginForm"
    );


  /* ======================================
     REGISTER
     ====================================== */

  if (registerForm) {

    registerForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const name =
          document.getElementById(
            "name"
          ).value.trim();

        const email =
          document.getElementById(
            "email"
          ).value.trim();

        const password =
          document.getElementById(
            "password"
          ).value;

        const confirmPassword =
          document.getElementById(
            "confirmPassword"
          ).value;

        const message =
          document.getElementById(
            "registerMessage"
          );


        /* Password check */

        if (
          password !==
          confirmPassword
        ) {

          message.textContent =
            "Passwords do not match.";

          return;

        }


        /* Password length */

        if (
          password.length < 8
        ) {

          message.textContent =
            "Password must be at least 8 characters.";

          return;

        }


        message.textContent =
          "Creating your account...";


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
                  window.location.origin +
                  "/login.html"

              }

            });


          if (error) {

            message.textContent =
              error.message;

            return;

          }


          message.textContent =
            "Account created! Please check your email and confirm your account.";

          registerForm.reset();


        } catch (error) {

          console.error(error);

          message.textContent =
            "Something went wrong. Please try again.";

        }

      }
    );

  }


  /* ======================================
     LOGIN
     ====================================== */

  if (loginForm) {

    loginForm.addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const email =
          document.getElementById(
            "loginEmail"
          ).value.trim();

        const password =
          document.getElementById(
            "loginPassword"
          ).value;

        const message =
          document.getElementById(
            "loginMessage"
          );


        message.textContent =
          "Logging in...";


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

            message.textContent =
              error.message;

            return;

          }


          message.textContent =
            "Login successful!";


          setTimeout(function () {

            window.location.href =
              "dashboard.html";

          }, 800);


        } catch (error) {

          console.error(error);

          message.textContent =
            "Something went wrong. Please try again.";

        }

      }
    );

  }

}


/* ========================================
   START WHEN PAGE LOADS
   ======================================== */

window.addEventListener(
  "load",
  startSupabase
);
