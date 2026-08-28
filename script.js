/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + AUTH + DASHBOARD
   + THUMBNAIL DOWNLOADER
   + TITLE & DESCRIPTION COPY
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
   YOUTUBE BACKEND URL
   ======================================== */

/*
   IMPORTANT:

   Do NOT put your Google API key here.

   Put your Cloud Run backend URL here.

   Example:

   https://dumidu-youtube-api-xxxxx.run.app

*/

const YOUTUBE_BACKEND_URL =
  "YOUR-CLOUD-RUN-URL";


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


  if (
    !userName &&
    !logoutButton
  ) {

    return;

  }


  if (!supabaseClient) {

    console.error(
      "Supabase is not ready."
    );

    return;

  }


  const {
    data,
    error
  } =
    await supabaseClient.auth.getUser();


  const user =
    data?.user;


  if (
    error ||
    !user
  ) {

    window.location.href =
      WEBSITE_URL +
      "/login.html";

    return;

  }


  const fullName =
    user.user_metadata?.full_name;


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
   GET YOUTUBE VIDEO ID
   ======================================== */

function getYouTubeVideoId(url) {

  try {

    const parsedUrl =
      new URL(url);


    const hostname =
      parsedUrl.hostname.toLowerCase();


    /* youtube.com */

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com"
    ) {

      return parsedUrl.searchParams.get(
        "v"
      );

    }


    /* youtu.be */

    if (
      hostname === "youtu.be"
    ) {

      return parsedUrl.pathname
        .split("/")
        .filter(Boolean)[0];

    }


    /* youtube-nocookie.com */

    if (
      hostname === "youtube-nocookie.com" ||
      hostname === "www.youtube-nocookie.com"
    ) {

      const parts =
        parsedUrl.pathname
          .split("/")
          .filter(Boolean);


      return parts[parts.length - 1];

    }


    return null;

  } catch (error) {

    return null;

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


      let videoId =
        getYouTubeVideoId(url);


      if (!videoId) {

        message.textContent =
          "❌ Please enter a valid YouTube URL.";


        result.style.display =
          "none";


        return;

      }


      videoId =
        videoId
          .split("&")[0]
          .split("?")[0];


      const thumbnailUrl =
        "https://img.youtube.com/vi/" +
        videoId +
        "/maxresdefault.jpg";


      image.src =
        thumbnailUrl;


      openButton.href =
        thumbnailUrl;


      if (saveButton) {

        saveButton.href =
          thumbnailUrl;

      }


      result.style.display =
        "block";


      message.textContent =
        "✅ Thumbnail found successfully!";


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
   TITLE & DESCRIPTION COPY
   ======================================== */

function setupTitleDescriptionCopy() {

  const form =
    document.getElementById(
      "copyInfoForm"
    );


  if (!form) return;


  const urlInput =
    document.getElementById(
      "copyYoutubeUrl"
    );


  const message =
    document.getElementById(
      "copyInfoMessage"
    );


  const result =
    document.getElementById(
      "copyInfoResult"
    );


  const title =
    document.getElementById(
      "videoTitle"
    );


  const description =
    document.getElementById(
      "videoDescription"
    );


  const copyTitleButton =
    document.getElementById(
      "copyTitleButton"
    );


  const copyDescriptionButton =
    document.getElementById(
      "copyDescriptionButton"
    );


  /* ======================================
     GET TITLE + DESCRIPTION
     ====================================== */

  form.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const url =
        urlInput.value.trim();


      const videoId =
        getYouTubeVideoId(url);


      if (!videoId) {

        message.textContent =
          "❌ Please enter a valid YouTube URL.";


        result.style.display =
          "none";


        return;

      }


      if (
        !YOUTUBE_BACKEND_URL ||
        YOUTUBE_BACKEND_URL ===
          "YOUR-CLOUD-RUN-URL"
      ) {

        message.textContent =
          "⚠️ YouTube API backend is not connected yet.";


        result.style.display =
          "none";


        return;

      }


      message.textContent =
        "⏳ Getting video information...";


      result.style.display =
        "none";


      try {

        const apiUrl =
          YOUTUBE_BACKEND_URL.replace(
            /\/$/,
            ""
          ) +
          "/api/youtube?videoId=" +
          encodeURIComponent(videoId);


        const response =
          await fetch(apiUrl);


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.error ||
            "Unable to get video information."
          );

        }


        title.value =
          data.title || "";


        description.value =
          data.description || "";


        result.style.display =
          "block";


        message.textContent =
          "✅ Video information loaded successfully!";


      } catch (error) {

        console.error(error);


        message.textContent =
          "❌ Unable to get video information. Please try again.";


        result.style.display =
          "none";

      }

    }
  );


  /* ======================================
     COPY TITLE
     ====================================== */

  if (copyTitleButton) {

    copyTitleButton.addEventListener(
      "click",
      async function() {

        if (!title.value) return;


        try {

          await navigator.clipboard.writeText(
            title.value
          );


          copyTitleButton.textContent =
            "Copied ✓";


          setTimeout(function() {

            copyTitleButton.textContent =
              "📋 Copy Title";

          }, 1500);


        } catch (error) {

          console.error(error);

        }

      }
    );

  }


  /* ======================================
     COPY DESCRIPTION
     ====================================== */

  if (copyDescriptionButton) {

    copyDescriptionButton.addEventListener(
      "click",
      async function() {

        if (!description.value) return;


        try {

          await navigator.clipboard.writeText(
            description.value
          );


          copyDescriptionButton.textContent =
            "Copied ✓";


          setTimeout(function() {

            copyDescriptionButton.textContent =
              "📋 Copy Description";

          }, 1500);


        } catch (error) {

          console.error(error);

        }

      }
    );

  }

}


/* ========================================
   PAGE LOAD
   ======================================== */

window.addEventListener(
  "load",
  function () {

    startSupabase();


    setupThumbnailDownloader();


    setupTitleDescriptionCopy();


    setTimeout(
      setupDashboard,
      500
    );

  }
);
