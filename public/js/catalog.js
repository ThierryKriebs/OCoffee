
const fieldSelect = document.querySelector("#categoryFilter");
fieldSelect.addEventListener('change', filterByCategorie);

function filterByCategorie() {
  // console.log("Clic sur filtre détecté");

  const filterSelectValue = document.querySelector("#categoryFilter").value;
  //   console.log(filterSelectValue);

  const products = document.querySelectorAll(".product");

  products.forEach(product => {
    
    const characteristic = product.querySelector('.characteristic').textContent;

    if (filterSelectValue != characteristic && filterSelectValue != "Tous les produits") {
      product.classList.add("product-display-none");
    }
    else {
      product.classList.remove("product-display-none");
    }
  });
}