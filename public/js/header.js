
initBurgerMenu();



function initBurgerMenu() {
  const menuBurger = document.getElementById('menuBurger');
  const navMenu = document.getElementById('navMenu');
  
  menuBurger.addEventListener('click', function() {
    menuBurger.classList.toggle('change');
    navMenu.classList.toggle('nav-menu-display-on');
  });
}

//Modify the display from the active Menu (add a specific class to a link)
function addActiveLinkMenu(menuId) {
  document.querySelector(menuId).classList.add("activeLinkMenu");
}
  
