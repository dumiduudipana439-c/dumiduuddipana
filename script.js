/* ========================================
   DUMIDUUDDIPANA
   MAIN JAVASCRIPT
   ======================================== */


/* ========================================
   MOBILE MENU
   ======================================== */

function toggleMenu() {

  const navMenu = document.getElementById("navMenu");

  if (!navMenu) {
    return;
  }

  navMenu.classList.toggle("mobile-open");

}


/* ========================================
   CLOSE MENU AFTER CLICKING A LINK
   ======================================== */

document.addEventListener("DOMContentLoaded", function () {

  const navMenu = document.getElementById("navMenu");

  if (!navMenu) {
    return;
  }

  const menuLinks = navMenu.querySelectorAll("a");

  menuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

      navMenu.classList.remove("mobile-open");

    });

  });

});
