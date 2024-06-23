import { rechercherRecettes } from './rechercheAvecBoucles.js';

let selectedLabels = [];

// Fonction pour afficher les recettes
function displayRecipes(recipes) {
    const container = document.querySelector('.container .row');
    container.innerHTML = ''; // Vider le conteneur avant d'ajouter des recettes

    recipes.forEach(recipe => {
        const col = document.createElement('div');
        col.classList.add('col-md-4');

        col.innerHTML = `
            <div class="card recette-card">
                <div class="card-image">
                    <img src="assets/images/${recipe.image}" alt="${recipe.name}">
                    <div class="badge-time">${recipe.time}min</div>
                </div>
                <div class="card-body">
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <p class="recipe-subtitle">Recette</p>
                    <p class="recipe-description">${recipe.description}</p>
                    <p class="ingredients-title">Ingrédients</p>
                    <div class="ingredients-list">
                        ${recipe.ingredients.map(ingredient => `
                            <div class="ingredient-item" style="display: grid; padding-bottom: 5px;">
                                <span class="ingredient-name">${ingredient.ingredient}</span>
                                <span class="ingredient-quantity">${ingredient.quantity || ''}${ingredient.unit || ''}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.appendChild(col);
    });

    // Mettre à jour le nombre de recettes affichées
    const recipeCountElement = document.getElementById('recipeCount');
    recipeCountElement.textContent = recipes.length;

    // Mettre à jour les listes d'ingrédients, d'appareils et d'ustensiles
    updateFilters(recipes);
}

// Fonction pour mettre à jour les listes d'ingrédients, d'appareils et d'ustensiles
function updateFilters(recipes) {
    const ingredientsSet = new Set();
    const appliancesSet = new Set();
    const ustensilsSet = new Set();

    recipes.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
            ingredientsSet.add(ingredient.ingredient.toLowerCase());
        });
        appliancesSet.add(recipe.appliance.toLowerCase());
        recipe.ustensils.forEach(ustensil => {
            ustensilsSet.add(ustensil.toLowerCase());
        });
    });

    const ingredientsList = document.querySelector('#ingredientItems');
    const appliancesList = document.querySelector('#applianceItems');
    const ustensilsList = document.querySelector('#ustensilItems');

    ingredientsList.innerHTML = Array.from(ingredientsSet).map(item => `<li class="dropdown-item">${item}</li>`).join('');
    appliancesList.innerHTML = Array.from(appliancesSet).map(item => `<li class="dropdown-item">${item}</li>`).join('');
    ustensilsList.innerHTML = Array.from(ustensilsSet).map(item => `<li class="dropdown-item">${item}</li>`).join('');
}

// Gérer l'affichage de l'icône de suppression dans la barre de recherche principale
function handleSearchInput() {
    const searchInput = document.querySelector('.search-bar input');
    const clearIcon = document.querySelector('.clear-icon');

    // Effacer la valeur de l'input au rechargement de la page
    searchInput.value = '';
    clearIcon.classList.add('d-none'); // Assurez-vous que l'icône est cachée

    searchInput.addEventListener('input', () => {
        if (searchInput.value.length > 0) {
            clearIcon.classList.remove('d-none');
            const filteredRecipes = rechercherRecettes(recipes, searchInput.value, selectedLabels);
            displayRecipes(filteredRecipes);
        } else {
            clearIcon.classList.add('d-none');
            displayRecipes(recipes); // Afficher toutes les recettes si la barre de recherche est vide
        }
    });

    clearIcon.addEventListener('click', () => {
        searchInput.value = '';
        clearIcon.classList.add('d-none');
        searchInput.focus(); // Re-focus sur l'input après effacement
        displayRecipes(recipes); // Afficher toutes les recettes si la barre de recherche est vide
    });
}

// Gérer l'affichage de l'icône de suppression dans les barres de recherche des dropdowns
function handleDropdownSearchInputs() {
    const dropdownSearchInputs = document.querySelectorAll('.dropdown-menu input');
    dropdownSearchInputs.forEach(searchInput => {
        const clearIcon = searchInput.parentElement.querySelector('.dropdown-clear-icon');

        // Effacer la valeur de l'input au rechargement de la page
        searchInput.value = '';
        clearIcon.classList.add('d-none'); // Assurez-vous que l'icône est cachée

        searchInput.addEventListener('input', () => {
            if (searchInput.value.length > 0) {
                clearIcon.classList.remove('d-none');
                updateDropdownResults(searchInput);
            } else {
                clearIcon.classList.add('d-none');
                resetDropdownResults(searchInput);
            }
        });

        clearIcon.addEventListener('click', (event) => {
            event.stopPropagation(); // Empêche le dropdown de se fermer
            searchInput.value = '';
            clearIcon.classList.add('d-none');
            searchInput.focus(); // Re-focus sur l'input après effacement
            resetDropdownResults(searchInput);
        });
    });
}

// Fonction pour mettre à jour les résultats des dropdowns
function updateDropdownResults(searchInput) {
    const filter = searchInput.value.toLowerCase();
    const items = searchInput.closest('.dropdown-menu').querySelectorAll('.dropdown-item');

    items.forEach(item => {
        if (item.textContent.toLowerCase().includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Fonction pour réinitialiser les résultats des dropdowns
function resetDropdownResults(searchInput) {
    const items = searchInput.closest('.dropdown-menu').querySelectorAll('.dropdown-item');
    items.forEach(item => {
        item.style.display = '';
    });
}

// Fonction pour créer un label
function createLabel(text, containerId) {
    const label = document.createElement('div');
    label.classList.add('label');
    label.innerHTML = `
        <span>${text}</span>
        <span class="close-icon">&times;</span>
    `;

    // Ajouter un événement de clic à l'icône de fermeture pour supprimer le label
    label.querySelector('.close-icon').addEventListener('click', () => {
        label.remove();
        // Mettre à jour les labels sélectionnés et les résultats de recherche
        updateSelectedLabels(text, false);
    });

    document.getElementById(containerId).appendChild(label);
    // Mettre à jour les labels sélectionnés et les résultats de recherche
    updateSelectedLabels(text);
}

// Mettre à jour les labels sélectionnés et les résultats de recherche
function updateSelectedLabels(text, add = true) {
    if (add) {
        selectedLabels.push(text);
    } else {
        selectedLabels = selectedLabels.filter(label => label !== text);
    }
    updateSearchResults();
}

// Mettre à jour les résultats de recherche
function updateSearchResults() {
    const searchInput = document.querySelector('.search-bar input');
    const filteredRecipes = rechercherRecettes(recipes, searchInput.value, selectedLabels);
    displayRecipes(filteredRecipes);
}

// Exemple d'utilisation : Ajouter un label lorsqu'un ingrédient est sélectionné
document.getElementById('ingredientItems').addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        createLabel(event.target.textContent, 'selectedIngredients');
    }
});

// Répéter la logique de l'événement ci-dessus pour les appareils et les ustensiles
document.getElementById('applianceItems').addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        createLabel(event.target.textContent, 'selectedAppliance');
    }
});

document.getElementById('ustensilItems').addEventListener('click', function (event) {
    if (event.target.tagName === 'LI') {
        createLabel(event.target.textContent, 'selectedUtensil');
    }
});

// Appel de la fonction pour afficher les recettes
displayRecipes(recipes);
handleSearchInput();
handleDropdownSearchInputs();
