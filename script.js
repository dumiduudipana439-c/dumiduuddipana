/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + AUTH + DASHBOARD
   + THUMBNAIL DOWNLOADER
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


        /* CHECK FIELDS */

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


        /* PASSWORD MATCH */

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


        /* PASSWORD LENGTH */

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


  /* NOT DASHBOARD */

  if (
    !userName &&
    !logoutButton
  ) {

    return;

  }


  /* SUPABASE CHECK */

  if (!supabaseClient) {

    console.error(
      "Supabase is not ready."
    );

    return;

  }


  /* GET CURRENT USER */

  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  const user =
    data?.user;


  /* NOT LOGGED IN */

  if (
    error ||
    !user
  ) {

    window.location.href =
      WEBSITE_URL +
      "/login.html";

    return;

  }


  /* GET USER NAME */

  const fullName =
    user.user_metadata?.full_name;


  /* SHOW USER NAME */

  if (userName) {

    userName.textContent =
      fullName ||
      user.email ||
      "Student";

  }


  /* ======================================
     LOGOUT
     ====================================== */

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
   YOUTUBE THUMBNAIL DOWNLOADER
   ======================================== */

function setupThumbnailDownloader() {

  const form =
    document.getElementById(
      "thumbnailForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const input =
        document.getElementById(
          "youtubeUrl"
        );


      const message =
        document.getElementById(
          "thumbnailMessage"
        );


      const result =
        document.getElementById(
          "thumbnailResult"
        );


      const image =
        document.getElementById(
          "thumbnailImage"
        );


      const openButton =
        document.getElementById(
          "downloadThumbnail"
        );


      const saveButton =
        document.getElementById(
          "saveThumbnail"
        );


      if (
        !input ||
        !message ||
        !result ||
        !image ||
        !openButton
      ) {

        return;

      }


      const url =
        input.value.trim();


      let videoId = null;


      /* ==================================
         GET VIDEO ID
         ================================== */

      try {

        const parsedUrl =
          new URL(url);


        const hostname =
          parsedUrl.hostname.toLowerCase();


        /* YOUTUBE.COM */

        if (
          hostname ===
            "www.youtube.com" ||
          hostname ===
            "youtube.com"
        ) {

          videoId =
            parsedUrl.searchParams.get(
              "v"
            );

        }


        /* YOUTU.BE */

        else if (
          hostname ===
            "youtu.be"
        ) {

          videoId =
            parsedUrl.pathname
              .split("/")
              .filter(Boolean)[0];

        }


        /* YOUTUBE NO COOKIE */

        else if (
          hostname ===
            "www.youtube-nocookie.com"
        ) {

          videoId =
            parsedUrl.pathname
              .split("/")
              .filter(Boolean)
              .pop();

        }

      } catch (error) {

        videoId = null;

      }


      /* ==================================
         INVALID URL
         ================================== */

      if (!videoId) {

        message.textContent =
          "Please enter a valid YouTube URL.";


        result.style.display =
          "none";


        return;

      }


      /* ==================================
         CLEAN VIDEO ID
         ================================== */

      videoId =
        videoId
          .split("&")[0]
          .split("?")[0];


      /* ==================================
         THUMBNAIL URL
         ================================== */

      const thumbnailUrl =
        "https://img.youtube.com/vi/" +
        videoId +
        "/maxresdefault.jpg";


      /* ==================================
         SHOW IMAGE
         ================================== */

      image.src =
        thumbnailUrl;


      /* OPEN BUTTON */

      openButton.href =
        thumbnailUrl;


      /* DOWNLOAD BUTTON */

      if (saveButton) {

        saveButton.href =
          thumbnailUrl;

      }


      /* SHOW RESULT */

      result.style.display =
        "block";


      message.textContent =
        "Thumbnail found successfully!";


      /* ==================================
         FALLBACK
         ================================== */

      image.onerror =
        function () {

          const fallback =
            "https://img.youtube.com/vi/" +
            videoId +
            "/hqdefault.jpg";


          image.src =
            fallback;


          openButton.href =
            fallback;


          if (saveButton) {

            saveButton.href =
              fallback;

          }

        };

    }
  );

}


/* ========================================
   START WHEN PAGE LOADS
   ======================================== */

window.addEventListener(
  "load",
  function () {

    startSupabase();


    setupThumbnailDownloader();


    setTimeout(
      setupDashboard,
      500
    );

  }
);
