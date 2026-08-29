/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + AUTH + DASHBOARD
   + MOBILE MENU
   + THUMBNAIL DOWNLOADER
   + YOUTUBE TITLE & DESCRIPTION
   + AI TREND FINDER
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
   YOUTUBE BACKEND
   ======================================== */

const YOUTUBE_BACKEND_URL =
  "https://ggukgsxjbrnkkdzukqka.supabase.co/functions/v1/super-endpoint";


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
  setupHeaderAuth();

}


/* ========================================
   MOBILE MENU
   ======================================== */

function toggleMenu() {

  const navMenu =
    document.getElementById("navMenu");

  if (!navMenu) return;

  navMenu.classList.toggle("mobile-open");

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
   HEADER LOGIN / LOGOUT
   ======================================== */

async function setupHeaderAuth() {

  if (!supabaseClient) return;

  const loginButton =
    document.querySelector(".login-button");

  const navMenu =
    document.getElementById("navMenu");

  try {

    const {
      data
    } =
      await supabaseClient.auth.getUser();

    const user =
      data?.user;


    /* ======================================
       USER IS LOGGED IN
       ====================================== */

    if (user) {

      /* Remove Login button */

      if (loginButton) {

        loginButton.remove();

      }


      /* ====================================
         Add Dashboard link if needed
         ==================================== */

      if (navMenu) {

        const existingDashboard =
          navMenu.querySelector(
            'a[href="dashboard.html"]'
          );

        if (!existingDashboard) {

          const dashboardLink =
            document.createElement("a");

          dashboardLink.href =
            "dashboard.html";

          dashboardLink.textContent =
            "Dashboard";

          navMenu.insertBefore(
            dashboardLink,
            navMenu.firstChild
          );

        }

      }

    }

    /* ======================================
       USER NOT LOGGED IN
       ====================================== */

    else {

      if (
        loginButton &&
        !loginButton.textContent.trim()
      ) {

        loginButton.textContent =
          "Login";

      }

    }

  } catch (error) {

    console.error(
      "Header authentication error:",
      error
    );

  }

}


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


          setTimeout(
            function () {

              window.location.href =
                WEBSITE_URL +
                "/dashboard.html";

            },
            500
          );


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


  /* Not dashboard page */

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


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();


    const user =
      data?.user;


    /* ======================================
       NOT LOGGED IN
       ====================================== */

    if (
      error ||
      !user
    ) {

      window.location.href =
        WEBSITE_URL +
        "/login.html";

      return;

    }


    /* ======================================
       USER NAME
       ====================================== */

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


  } catch (error) {

    console.error(
      "Dashboard error:",
      error
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


    /* ======================================
       youtube.com
       ====================================== */

    if (
      hostname === "youtube.com" ||
      hostname === "www.youtube.com"
    ) {

      return parsedUrl.searchParams.get(
        "v"
      );

    }


    /* ======================================
       youtu.be
       ====================================== */

    if (
      hostname === "youtu.be"
    ) {

      return parsedUrl.pathname
        .split("/")
        .filter(Boolean)[0];

    }


    /* ======================================
       youtube-nocookie.com
       ====================================== */

    if (
      hostname ===
        "youtube-nocookie.com" ||
      hostname ===
        "www.youtube-nocookie.com"
    ) {

      const parts =
        parsedUrl.pathname
          .split("/")
          .filter(Boolean);


      return parts[
        parts.length - 1
      ];

    }


    return null;


  } catch (error) {

    return null;

  }

}


/* ========================================
   THUMBNAIL DOWNLOADER
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
   YOUTUBE TITLE + DESCRIPTION
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
     GET VIDEO INFORMATION
     ====================================== */

  form.addEventListener(
    "submit",
    async function (event) {

      event.preventDefault();


      if (
        !urlInput ||
        !message ||
        !result ||
        !title ||
        !description
      ) {

        return;

      }


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


      message.textContent =
        "⏳ Getting video information...";


      result.style.display =
        "none";


      try {

        const response =
          await fetch(
            YOUTUBE_BACKEND_URL,
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                "apikey":
                  SUPABASE_KEY,

                "Authorization":
                  "Bearer " +
                  SUPABASE_KEY

              },

              body: JSON.stringify({

                url: url

              })

            }
          );


        const data =
          await response.json();


        console.log(
          "YouTube API response:",
          data
        );


        if (!response.ok) {

          throw new Error(
            data?.error ||
            "Unable to get video information."
          );

        }


        if (!data.success) {

          throw new Error(
            data?.error ||
            "Video information was not found."
          );

        }


        title.value =
          data.title || "";


        description.value =
          data.description || "";


        result.style.display =
          "block";


        message.textContent =
          "✅ Title & description loaded successfully!";


      } catch (error) {

        console.error(
          "YouTube information error:",
          error
        );


        message.textContent =
          "❌ " +
          (
            error.message ||
            "Unable to get video information."
          );


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
      async function () {

        if (
          !title ||
          !title.value
        ) {

          return;

        }


        try {

          await navigator.clipboard.writeText(
            title.value
          );


          copyTitleButton.textContent =
            "Copied ✓";


          setTimeout(
            function () {

              copyTitleButton.textContent =
                "📋 Copy Title";

            },
            1500
          );


        } catch (error) {

          console.error(
            "Copy title error:",
            error
          );

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
      async function () {

        if (
          !description ||
          !description.value
        ) {

          return;

        }


        try {

          await navigator.clipboard.writeText(
            description.value
          );


          copyDescriptionButton.textContent =
            "Copied ✓";


          setTimeout(
            function () {

              copyDescriptionButton.textContent =
                "📋 Copy Description";

            },
            1500
          );


        } catch (error) {

          console.error(
            "Copy description error:",
            error
          );

        }

      }
    );

  }

}


/* ========================================
   AI TREND FINDER (DYNAMIC TOPICS)
   ======================================== */

async function generateNicheTrends() {

  const nicheInput =
    document.getElementById("userNicheInput")?.value.trim();

  const topicsList =
    document.getElementById("dynamicTopicsList");

  const loadingText =
    document.getElementById("loadingText");


  if (!nicheInput) {

    alert("Please enter a niche first!");

    return;

  }


  if (!topicsList || !loadingText) return;


  topicsList.innerHTML = "";

  loadingText.style.display = "block";


  try {

    // මෙහිදී ඔබට පසුකාලීනව Make.com Webhook හෝ Supabase Edge Function එකක් සම්බන්ධ කළ හැක.
    setTimeout(function () {

      loadingText.style.display = "none";

      const sampleTopics = [
        `The Future and Impact of ${nicheInput} in 2026`,
        `Top 5 Mistakes to Avoid in ${nicheInput}`,
        `How AI is Transforming ${nicheInput} Industry`,
        `Beginner's Guide to Mastering ${nicheInput} Fast`,
        `Advanced Strategies for ${nicheInput} Professionals`,
        `Top Tools and Resources for ${nicheInput} Success`,
        `Case Study: Growing a ${nicheInput} Channel from Scratch`,
        `Monetization Secrets for ${nicheInput} Creators`,
        `Unexplored Opportunities in ${nicheInput} Today`,
        `Expert Predictions for ${nicheInput} Next Year`
      ];

      topicsList.innerHTML =
        sampleTopics
          .map(function (topic) {
            return `<li style="margin-bottom: 8px;">${topic}</li>`;
          })
          .join("");

    }, 1000);


  } catch (error) {

    loadingText.style.display = "none";

    alert("Error fetching trending topics. Please try again.");

  }

}


/* ========================================
   PAGE LOAD
   ======================================== */

window.addEventListener(
  "load",
  async function () {

    /* ======================================
       START SUPABASE
       ====================================== */

    startSupabase();


    /* ======================================
       THUMBNAIL DOWNLOADER
       ====================================== */

    setupThumbnailDownloader();


    /* ======================================
       TITLE + DESCRIPTION
       ====================================== */

    setupTitleDescriptionCopy();


    /* ======================================
       DASHBOARD SECURITY
       ====================================== */

    setTimeout(
      setupDashboard,
      500
    );

  }
);
