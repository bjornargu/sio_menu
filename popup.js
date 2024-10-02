let isNorwegian = true;
let currentLocation = "halden";
const weekDayNo = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
const weekDayGb = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const URLno = "https://www.siost.hiof.no/spisesteder/ukens-meny";
const URLgb = "https://www.siost.hiof.no/diners/weekly-menu";

async function displayMenu(weekDay, url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    let output = "";

    const meals = doc.querySelectorAll(".font300563658");

    const haldenMeals = [];
    const fredrikstadMeals = [];

    // Loop through meals and distribute them
    meals.forEach((meal, index) => {
      if (index < 5) {
        haldenMeals.push(meal.innerText); // Halden
      } else {
        fredrikstadMeals.push(meal.innerText); // Fredrikstad
      }
    });

    const today = new Date(); // Get the current date
    const currentDayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    if (currentDayIndex >= 1 && currentDayIndex <= 5) {
      // Only highlight weekdays (Mon-Fri)
      const highlightIndex = currentDayIndex - 1; // Convert to index (0-4 for Mon-Fri)

      if (currentLocation == "halden") {
        output = '<h2 class="text-xl font-bold mb-2">Halden</h2>';
        haldenMeals.forEach((meal, i) => {
          const highlightClass = i === highlightIndex ? "highlight" : "";
          output += `<li class="whitespace-nowrap ${highlightClass}"><span id='daytext' class="font-bold">${
            weekDay[i]
          }</span>: <span id='mealtext'>${
            haldenMeals[i] || "Meal not found!"
          }</span></li>`;
        });
      } else {
        output += '<h2 class="text-xl font-bold mb-2">Fredrikstad</h2>';
        fredrikstadMeals.forEach((meal, i) => {
          const highlightClass = i === highlightIndex ? "highlight" : "";
          output += `<li class="whitespace-nowrap ${highlightClass}"><span id='daytext' class="font-bold">${
            weekDay[i]
          }</span>: <span id='mealtext'>${
            fredrikstadMeals[i] || "Meal not found!"
          }</span></li>`;
        });
      }
    } else {
      // If it's the weekend, display meals without highlighting
      if (currentLocation == "halden") {
        output = '<h2 class="text-xl font-bold mb-2">Halden</h2>';
        haldenMeals.forEach((meal, i) => {
          output += `<li class="whitespace-nowrap"><span id='daytext' class="font-bold">${
            weekDay[i]
          }</span>: <span id='mealtext'>${
            haldenMeals[i] || "Meal not found!"
          }</span></li>`;
        });
      } else {
        output += '<h2 class="text-xl font-bold mb-2">Fredrikstad</h2>';
        fredrikstadMeals.forEach((meal, i) => {
          output += `<li class="whitespace-nowrap"><span id='daytext' class="font-bold">${
            weekDay[i]
          }</span>: <span id='mealtext'>${
            fredrikstadMeals[i] || "Meal not found!"
          }</span></li>`;
        });
      }
    }

    // Insert the generated HTML into the menu element
    const menuElement = document.querySelector("#menu");
    if (menuElement) {
      menuElement.innerHTML = output;
    } else {
      console.error("Menu element not found");
    }
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
}

// Let users switch their language when clicking the langBtn
function languageChange() {
  const langBtnIcon = document.querySelector("#langBtn img");
  if (isNorwegian) {
    isNorwegian = false;
    displayMenu(weekDayGb, URLgb);
    langBtnIcon.src = "images/no.svg";
  } else {
    isNorwegian = true;
    displayMenu(weekDayNo, URLno);
    langBtnIcon.src = "images/gb.svg";
  }
  chrome.storage.local.set({ language: isNorwegian });
}

// Ensure persistent language
function loadLanguagePreference() {
  chrome.storage.local.get("language", (data) => {
    if (data.language !== undefined) {
      isNorwegian = data.language;
      const langBtnIcon = document.querySelector("#langBtn img");
      if (isNorwegian) {
        displayMenu(weekDayNo, URLno);
        langBtnIcon.src = "images/gb.svg";
      } else {
        displayMenu(weekDayGb, URLgb);
        langBtnIcon.src = "images/no.svg";
      }
    } else {
      // Default to norwegian if language is undefined
      displayMenu(weekDayNo, URLno);
    }
  });
}

function saveLocationPreference() {
  chrome.storage.local.set({ location: currentLocation });
}

// Load the user's location preference
function loadLocationPreference() {
  chrome.storage.local.get("location", (data) => {
    if (data.location) {
      currentLocation = data.location; 
      const locationSelect = document.getElementById("locationSelect");
      if (locationSelect) {
        locationSelect.value = currentLocation; 
      }
      loadLanguagePreference(); 
    }
  });
}

// Call displayMenu on load
document.addEventListener("DOMContentLoaded", () => {
  const langBtn = document.getElementById("langBtn");
  if (langBtn) {
    langBtn.addEventListener("click", languageChange);
    const locationSelect = document.getElementById("locationSelect");
    if (locationSelect) {
      locationSelect.addEventListener("change", (event) => {
        currentLocation = event.target.value;
        saveLocationPreference();
        loadLanguagePreference();
      });
    }
    loadLocationPreference();
  }
});
