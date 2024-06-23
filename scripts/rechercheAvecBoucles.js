// Fonction pour rechercher des recettes en fonction d'une requête et de labels sélectionnés
export function rechercherRecettes(recettes, requete, labels = []) {
    // Initialise un tableau pour stocker les résultats de la recherche
    const resultats = [];
    // Convertit la requête en minuscule pour une comparaison insensible à la casse
    const requeteLower = requete.toLowerCase();

    // Parcourt chaque recette
    for (const recette of recettes) {
        // Vérifie si le nom ou la description de la recette contient la requête
        const matchesRequete = recette.name.toLowerCase().includes(requeteLower) ||
            recette.description.toLowerCase().includes(requeteLower);

        // Vérifie si l'un des ingrédients de la recette contient la requête
        const matchesIngredients = recette.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(requeteLower)
        );

        // Vérifie si tous les labels sélectionnés sont présents dans les ingrédients, l'appareil ou les ustensiles de la recette
        const matchesLabels = labels.every(label => {
            return recette.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase() === label.toLowerCase()
            ) || 
            recette.appliance.toLowerCase() === label.toLowerCase() ||
            recette.ustensils.some(ustensil =>
                ustensil.toLowerCase() === label.toLowerCase()
            );
        });

        // Si la recette correspond à la requête ou aux ingrédients, et que tous les labels sont présents, ajoute la recette aux résultats
        if ((matchesRequete || matchesIngredients) && matchesLabels) {
            resultats.push(recette);
        }
    }

    // Retourne le tableau des résultats de la recherche
    return resultats;
}
