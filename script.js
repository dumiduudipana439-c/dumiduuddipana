function toggleMenu() {

  const nav =
    document.getElementById("navMenu");

  if (nav) {

    nav.classList.toggle("active");

  }

}


// Close mobile menu when a link is clicked

document
  .querySelectorAll("#navMenu a")
  .forEach(function(link) {

    link.addEventListener("click", function() {

      const nav =
        document.getElementById("navMenu");

      if (nav) {
        nav.classList.remove("active");
      }

    });

  });
