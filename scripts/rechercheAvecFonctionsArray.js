export function rechercherRecettes(recettes, requete, labels = []) {
    // Convertir la requête de recherche en minuscules pour une comparaison insensible à la casse
    const requeteLower = requete.toLowerCase();

    // Utiliser la méthode filter pour parcourir toutes les recettes
    return recettes.filter(recette => {
        // Vérifier si la requête de recherche correspond au nom ou à la description de la recette
        const matchesRequete = recette.name.toLowerCase().includes(requeteLower) ||
            recette.description.toLowerCase().includes(requeteLower);

        // Vérifier si la requête de recherche correspond à un ingrédient de la recette
        const matchesIngredients = recette.ingredients.some(ingredient =>
            ingredient.ingredient.toLowerCase().includes(requeteLower)
        );

        // Vérifier si tous les labels sélectionnés correspondent à la recette
        const matchesLabels = labels.every(label => {
            return recette.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase() === label.toLowerCase()
            ) ||
            recette.appliance.toLowerCase() === label.toLowerCase() ||
            recette.ustensils.some(ustensil =>
                ustensil.toLowerCase() === label.toLowerCase()
            );
        });

        // Retourner vrai si la recette correspond à la requête de recherche ou aux ingrédients et correspond à tous les labels sélectionnés
        return (matchesRequete || matchesIngredients) && matchesLabels;
    });
}