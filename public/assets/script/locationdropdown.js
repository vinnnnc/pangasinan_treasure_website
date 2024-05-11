function loadLocationDropdown() {
  const citiesAndTowns = [
    "Agno",
    "Aguilar",
    "Alaminos",
    "Alcala",
    "Anda",
    "Asingan",
    "Balungao",
    "Bani",
    "Basista",
    "Bautista",
    "Bayambang",
    "Binalonan",
    "Binmaley",
    "Bolinao",
    "Bugallon",
    "Burgos",
    "Calasiao",
    "Dagupan",
    "Dasol",
    "Infanta",
    "Labrador",
    "Laoac",
    "Lingayen",
    "Mabini",
    "Malasiqui",
    "Manaoag",
    "Mangaldan",
    "Mangatarem",
    "Mapandan",
    "Natividad",
    "Pozorrubio",
    "Rosales",
    "San Carlos",
    "San Fabian",
    "San Jacinto",
    "San Manuel",
    "San Nicolas",
    "San Quintin",
    "Santa Barbara",
    "Santa Maria",
    "Santo Tomas",
    "Sison",
    "Sual",
    "Tayug",
    "Umingan",
    "Urbiztondo",
    "Urdaneta",
    "Villasis",
  ];

  const filterFrom = document.getElementById("location-dropdown");

  citiesAndTowns.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.toLowerCase();
    option.text = city;
    filterFrom.appendChild(option);
  });
}
loadLocationDropdown();
