/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + MOBILE MENU + AUTH + DASHBOARD
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
   MOBILE MENU ☰
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


        const message =
          document.getElementById(
            "registerMessage"
          );


        /* Check fields */

        if (
          !name ||
          !email ||
          !password ||
          !confirmPassword
        ) {

          if (message) {

            message.textContent =
              "Please fill in all fields.";

          }

          return;

        }


        /* Check password */

        if (
          password !==
          confirmPassword
        ) {

          if (message) {

            message.textContent =
              "Passwords do not match.";

          }

          return;

        }


        /* Minimum password length */

        if (
          password.length < 8
        ) {

          if (message) {

            message.textContent =
              "Password must be at least 8 characters.";

          }

          return;

        }


        if (message) {

          message.textContent =
            "Creating your account...";

        }


        try {

          const {
            error
          } =
            await supabaseClient.auth.signUp({

              email: email,

              password: password,

              options: {

                data: {

                  full_name: name

                },


                /* Email confirmation redirect */

                emailRedirectTo:
                  WEBSITE_URL +
                  "/login.html"

              }

            });


          if (error) {

            console.error(error);

            if (message) {

              message.textContent =
                error.message;

            }

            return;

          }


          if (message) {

            message.textContent =
              "Account created! Please check your email and confirm your account.";

          }


          registerForm.reset();


        } catch (error) {

          console.error(error);

          if (message) {

            message.textContent =
              "Something went wrong. Please try again.";

          }

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
          )?.value.trim();


        const password =
          document.getElementById(
            "loginPassword"
          )?.value;


        const message =
          document.getElementById(
            "loginMessage"
          );


        if (
          !email ||
          !password
        ) {

          if (message) {

            message.textContent =
              "Please enter your email and password.";

          }

          return;

        }


        if (message) {

          message.textContent =
            "Logging in...";

        }


        try {

          const {
            error
          } =
            await supabaseClient.auth
              .signInWithPassword({

                email: email,

                password: password

              });


          if (error) {

            console.error(error);

            if (message) {

              message.textContent =
                error.message;

            }

            return;

          }


          if (message) {

            message.textContent =
              "Login successful!";

          }


          setTimeout(function () {

            window.location.href =
              WEBSITE_URL +
              "/dashboard.html";

          }, 800);


        } catch (error) {

          console.error(error);

          if (message) {

            message.textContent =
              "Something went wrong. Please try again.";

          }

        }

      }
    );

  }

}


/* ========================================
   DASHBOARD SECURITY
   ======================================== */

async function setupDashboard() {

  const userName =
    document.getElementById(
      "userName"
    );


  const logoutButton =
    document.getElementById(
      "logoutButton"
    );


  /*
     If this is not the dashboard page,
     stop here.
  */

  if (
    !userName &&
    !logoutButton
  ) {

    return;

  }


  /*
     Make sure Supabase is ready.
  */

  if (!supabaseClient) {

    console.error(
      "Supabase is not ready."
    );

    return;

  }


  /*
     Get current logged-in user.
  */

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  const user =
    data?.user;


  /*
     If user is NOT logged in,
     send them to Login.
  */

  if (
    error ||
    !user
  ) {

    window.location.href =
      WEBSITE_URL +
      "/login.html";

    return;

  }


  /*
     Get user's registered name.
  */

  const fullName =
    user.user_metadata?.full_name;


  /*
     Show user's name.
  */

  if (userName) {

    userName.textContent =
      fullName ||
      user.email ||
      "Student";

  }


  /*
     LOGOUT
  */

  if (logoutButton) {

    logoutButton.addEventListener(
      "click",
      async function () {

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

            console.error(error);

            logoutButton.disabled =
              false;

            logoutButton.textContent =
              "Logout";

            return;

          }


          /*
             Go back to Login
          */

          window.location.href =
            WEBSITE_URL +
            "/login.html";


        } catch (error) {

          console.error(error);

          logoutButton.disabled =
            false;

          logoutButton.textContent =
            "Logout";

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
  function () {

    startSupabase();


    /*
       Wait a little for
       Supabase client to initialize.
    */

    setTimeout(
      setupDashboard,
      500
    );

  }
);
