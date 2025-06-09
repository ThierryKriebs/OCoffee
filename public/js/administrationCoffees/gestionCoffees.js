

//Configure all evenements for gestionCoffees.ejs
function configureEvenements() {

  //Event for all <<normal>> select buttons
  const allNormalSelect = document.querySelectorAll(".selectActions");
  
  for (const oneSelect of allNormalSelect){
    oneSelect.addEventListener('change', normalSelectAction);
  }

  //Event for general select button
  const generalSelect = document.querySelector("#selectGeneralActions");
  generalSelect.addEventListener('change', generalSelectAction);

  //Event for general checkbox
  const generalCheckbox = document.querySelector("#generalCheckbox");
  generalCheckbox.addEventListener('change', generalCheckboxAction);
  
  //Save all tr from the tbody from the table => For filter
  const tableCoffees = document.querySelector('#tableCoffees');
  const tbody = tableCoffees.querySelector('tbody');
  tableCoffeesRows = tbody.querySelectorAll('tr'); //save all coffees

  //Event for modale
  //Button for open modal filter
  const btnOpenModalFilter = document.querySelector("#btnOpenModalForFilter");

  //Button/span for close modal filter
  const closeModalFilterButton = document.querySelector(".spanCloseModalForFilter");

  //When user click on button for open modal filter => open the modal filter
  btnOpenModalFilter.addEventListener('click', displayModaleFilter);
 
  //When user click on button for close modal filter => close the modal filter
  closeModalFilterButton.addEventListener('click', hideModalFilter );
 
  //When user click out the content from modal filter (modal recover all the page) => close the modal filter
  window.addEventListener('click', windowHideModalFilter );
  


  //Event for filter with name
  const filterWithName = document.querySelector("#filterWithName");
  filterWithName.addEventListener('input', filterCoffees);

  //Event for filter with reference
  const filterWithReference = document.querySelector("#filterWithReference");
  filterWithReference.addEventListener('input', filterCoffees);

  //Event for filter with filterWithCountry
  const filterWithCountry = document.querySelector("#filterWithCountry");
  filterWithCountry.addEventListener('input', filterCoffees);

  //Event for filter with price min and max
  const filterWithPriceMin = document.querySelector("#filterWithPriceMin");
  filterWithPriceMin.addEventListener('input', filterCoffees);

  const filterWithPriceMax = document.querySelector("#filterWithPriceMax");
  filterWithPriceMax.addEventListener('input', filterCoffees);

  //Event for filter with characteristic
  const filterWithCharacteristic = document.querySelector("#filterWithCharacteristic");
  filterWithCharacteristic.addEventListener('input', filterCoffees);

  //Event for filter with disponibility
  const filterWithDisponibility = document.querySelector("#filterWithDisponibility");
  filterWithDisponibility.addEventListener('input', filterCoffees);
}

function normalSelectAction(event) {

  const actionSelected = this.value;  
  document.getElementById('hiddenAction').value = actionSelected;
  
  //Modify the value from hiddenSelectId
  const idSelectButton = event.target.id;
  let idCoffeeSelected = idSelectButton.split("_");
  idCoffeeSelected = idCoffeeSelected[1];
  console.log(idCoffeeSelected);
  document.getElementById('hiddenSelectId').value = idCoffeeSelected;

  document.getElementById(`selectActions_${idCoffeeSelected}`).value = ""; //Delete the action in the form select
  
 
  //trigger formulaire
  const form = document.getElementById('coffee-form');
  form.submit();
}

function generalSelectAction() {

  const actionSelected = this.value;  
  console.log("salt");
  console.log("actionSelected " + actionSelected);
  document.getElementById('hiddenAction').value = actionSelected;
  document.getElementById('selectGeneralActions').value = ""; //Delete the action in the general form select

  //trigger formulaire
  const form = document.getElementById('coffee-form');
  form.submit();
}

function generalCheckboxAction() {

  const allFormCheckbox = document.querySelectorAll("input[name='checkboxIdCoffee']");
  
  for (const oneCheckbox of allFormCheckbox){
    oneCheckbox.checked = this.checked;
  }
}

//Filter allCoffees with the parameters from filter
function filterCoffees() {
  const filterWithName = document.querySelector('#filterWithName').value;
  const filterWithReference = document.querySelector('#filterWithReference').value;
  const filterWithCountry = document.querySelector('#filterWithCountry').value;
  const filterWithPriceMin = parseFloat(document.querySelector('#filterWithPriceMin').value);
  const filterWithPriceMax = parseFloat(document.querySelector('#filterWithPriceMax').value);
  const filterWithCharacteristic = document.querySelector('#filterWithCharacteristic').value;
  const filterWithDisponibility = document.querySelector('#filterWithDisponibility').value;

  const tableCoffees = document.querySelector('#tableCoffees');
  const tbody = tableCoffees.querySelector('tbody');
  

  //Convert table rows for easier sorting
  const rowsArray = Array.from(tableCoffeesRows);

  //Filter by coffee name
  let filteredRows = rowsArray.filter(row => {
    if (filterWithName === '') return true;
    return row.getAttribute('data-name').toLowerCase().includes(filterWithName.toLowerCase());
  });

  //Filtrer by reference
  filteredRows = filteredRows.filter(row => {
    if (filterWithReference === '') return true;
    return row.getAttribute('data-reference').toLowerCase().includes(filterWithReference.toLowerCase());
  });

  //Filter by country
  filteredRows = filteredRows.filter(row => {
    if (filterWithCountry === '') return true;
    return row.getAttribute('data-country') === filterWithCountry;
  });

  //Filter by price min and max
  filteredRows = filteredRows.filter(row => {
    if (filterWithPriceMin === '') return true;
    if (Number.isNaN(filterWithPriceMin)) return true;
    return parseFloat(row.getAttribute('data-price')) >= filterWithPriceMin;
  });

  filteredRows = filteredRows.filter(row => {
    if (filterWithPriceMax === '') return true;
    if (Number.isNaN(filterWithPriceMax)) return true;
    return parseFloat(row.getAttribute('data-price')) <= filterWithPriceMax;
  });

  //Filter by characteristic
  filteredRows = filteredRows.filter(row => {
    if (filterWithCharacteristic === '') return true;
    return row.getAttribute('data-characteristic') === filterWithCharacteristic;
  });

  //Filter by filterWithDisponibility
  filteredRows = filteredRows.filter(row => {
    if (filterWithDisponibility === '') return true;
    return row.getAttribute('data-disponibility') === filterWithDisponibility;
  });


  //Clear table
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  //Adding filtered and sorted lines
  filteredRows.forEach(row => {
    tbody.appendChild(row);
  });
}

//Call with button "Reinitialiser" => Reinit all Filter for display all Coffees
function reinitFilterCoffees() {

  let filterWithName = document.querySelector('#filterWithName');
  let filterWithReference = document.querySelector('#filterWithReference');
  let filterWithCountry = document.querySelector('#filterWithCountry');
  let filterWithPriceMin = document.querySelector('#filterWithPriceMin');
  let filterWithPriceMax = document.querySelector('#filterWithPriceMax');
  let filterWithCharacteristic = document.querySelector('#filterWithCharacteristic');
  let filterWithDisponibility = document.querySelector('#filterWithDisponibility');

  filterWithName.value = "";
  filterWithReference.value = "";
  filterWithCountry.value = "";
  filterWithPriceMin.value = "";
  filterWithPriceMax.value = "";
  filterWithCharacteristic.value = "";
  filterWithDisponibility.value = "";

  filterCoffees();
}

//Call when click on Header from table Coffees. Sort table Coffees
function sortTableCoffees(columnIndex) {
  const table = document.getElementById("tableCoffees");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));
  const th = table.querySelectorAll("th")[columnIndex];

  //Reinit all old short
  const allTh = table.querySelectorAll("th");
  allTh.forEach((oneTh, index) => {
    oneTh.classList.remove("sort-asc");
    oneTh.classList.remove("sort-desc");

    //Delete all attribute for all other th than the th clicked
    if (index !== columnIndex){
      oneTh.removeAttribute("data-sort");
    }
  });

  //Determine the current sort order
  let isAsc;
  if(th.getAttribute("data-sort")){
    isAsc = th.getAttribute("data-sort") === "asc";
  }
  else {
    isAsc = false;
  }
  
  th.removeAttribute("data-sort");
  
  th.setAttribute("data-sort", isAsc ? "desc" : "asc");
  th.classList.add(isAsc ? "sort-desc" : "sort-asc");

  //Sort rows
  rows.sort((a, b) => {
    const aValue = a.cells[columnIndex].textContent;
    const bValue = b.cells[columnIndex].textContent;

    //String comparison (returns a positive, negative or neutral number)
    return isAsc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
  });

  //Delete existing lines
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  //Add the sorted rows to the table
  rows.forEach(row => tbody.appendChild(row));
}

function displayModaleFilter(){
  const modal = document.getElementById("modalForFilter");
  modal.style.display = "block";
  
  setTimeout(() => {
    modal.classList.add("show"); // Add class show for display the modal filter
  }, 10);                        // Short delay to ensure a good display
}

function hideModalFilter() {
  const modal = document.getElementById("modalForFilter");
  
  modal.classList.remove("show"); // delete the class show start the close animation
  setTimeout(() => {
    modal.style.display = "none";
  }, 500);                        // After le end  from close animation, the modal is not display
}

//When user click out the content from modal filter (modal recover all the page) => close the modal filter
function windowHideModalFilter(event) {
  const modal = document.getElementById("modalForFilter");
 
  if (event.target == modal) {
    modal.classList.remove("show"); // delete the class show start the close animation
    setTimeout(() => {
      modal.style.display = "none"; // After le end  from close animation, the modal is not display
    }, 500);
  }
}


// Start form script
let tableCoffeesRows = "";

configureEvenements();
