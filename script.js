/* ========================================
   DUMIDUUDDIPANA
   SUPABASE + AUTH + PROTECTED CARDS
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

}


/* ========================================
   MOBILE MENU
   ======================================== */

function toggleMenu() {

  const navMenu =
    document.getElementById(
      "navMenu"
    );

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
    document.getElementById(
      "navMenu"
    );

  if (!navMenu) return;

  navMenu.classList.remove(
    "mobile-open"
  );

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

  const heroButtons =
    document.getElementById(
      "heroButtons"
    );


  try {

    const {
      data,
      error
    } =
      await supabaseClient.auth.getUser();


    const user =
      data?.user;


    if (error || !user) {

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


    /* ================================
       HERO BUTTONS
       ================================ */

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

          console.error(error);

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

        console.error(error);

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


  if (!cards.length || !modal) {
    return;
  }


  cards.forEach(function (card) {

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

          console.error(error);

          modal.classList.add(
            "show"
          );

        }

      }
    );

  });


  /* ======================================
     CLOSE
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

    startSupabase();


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
