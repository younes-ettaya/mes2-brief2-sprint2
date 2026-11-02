// Ma liste de courses — starter de la mise en situation.
// Fourni : données, affichage et ajout validé.
// À réaliser : statut, suppression, recherche, filtre, tri par prix, réinitialisation et localStorage.

const produitsInitiaux = [
  { id: 1, nom: "Lait entier", prix: 9, statut: "À acheter" },
  { id: 2, nom: "Pain complet", prix: 6, statut: "Acheté" },
  { id: 3, nom: "Lait demi-écrémé", prix: 8.5, statut: "À acheter" },
  { id: 4, nom: "Pommes", prix: 15, statut: "À acheter" },
  { id: 5, nom: "Œufs", prix: 18, statut: "Acheté" },
  { id: 6, nom: "Riz", prix: 14, statut: "À acheter" },
];
let produits = produitsInitiaux.map((produit) => ({ ...produit }));
let prochainId = 1;

const formulaire = document.getElementById("formulaire-produit");
const champNom = document.getElementById("nom");
const champPrix = document.getElementById("prix");
const champRecherche = document.getElementById("recherche");
const filtreStatut = document.getElementById("filtre-statut");
const triPrix = document.getElementById("tri-prix");
const listeProduits = document.getElementById("liste-produits");
const message = document.getElementById("message");



function afficherProduits(liste) {
  listeProduits.replaceChildren();
  document.getElementById("etat-vide").hidden = liste.length > 0;
  document.getElementById("nombre-resultats").textContent =
    liste.length +
    (liste.length > 1 ? " produits affichés" : " produit affiché");

  liste.forEach((produit) => {
    const achete = produit.statut === "Acheté";
    const ligne = document.createElement("li");
    ligne.className = achete ? "product is-bought" : "product";

    const informations = document.createElement("div");
    informations.className = "product-info";
    const repere = document.createElement("span");
    repere.className = "product-marker";
    repere.setAttribute("aria-hidden", "true");
    const textes = document.createElement("div");
    const nom = document.createElement("h3");
    nom.className = "product-name";
    nom.textContent = produit.nom;
    const details = document.createElement("div");
    details.className = "product-meta";
    const prix = document.createElement("span");
    prix.className = "product-price";
    prix.textContent = produit.prix.toFixed(2) + " DH";
    const statut = document.createElement("span");
    statut.className = achete ? "badge badge-bought" : "badge badge-pending";
    statut.textContent = produit.statut;
    const identifiant = document.createElement("span");
    identifiant.className = "product-id";
    identifiant.textContent = "#" + produit.id;
    details.append(prix, statut, identifiant);
    textes.append(nom, details);
    informations.append(repere, textes);

    const actions = document.createElement("div");
    actions.className = "product-actions";
    const boutonStatut = document.createElement("button");
    boutonStatut.type = "button";
    boutonStatut.className = "button button-status";
    boutonStatut.textContent = achete ? "Remettre à acheter" : "Marquer acheté";
    boutonStatut.setAttribute(
      "aria-label",
      boutonStatut.textContent + " : " + produit.nom,
    );
    boutonStatut.addEventListener("click", () => modifierStatut(produit.id));

    const boutonSupprimer = document.createElement("button");
    boutonSupprimer.type = "button";
    boutonSupprimer.className = "button button-delete";
    boutonSupprimer.textContent = "Supprimer";
    boutonSupprimer.setAttribute("aria-label", "Supprimer " + produit.nom);
    boutonSupprimer.addEventListener("click", () =>
      supprimerProduit(produit.id),
    );
    actions.append(boutonStatut, boutonSupprimer);
    ligne.append(informations, actions);
    listeProduits.append(ligne);
  });
}

function ajouterProduit(event) {
  event.preventDefault();
  const nom = champNom.value.trim();
  const prix = Number(champPrix.value);
  const erreurNom = document.getElementById("erreur-nom");
  const erreurPrix = document.getElementById("erreur-prix");
  erreurNom.textContent = "";
  erreurPrix.textContent = "";
  champNom.removeAttribute("aria-invalid");
  champPrix.removeAttribute("aria-invalid");
  message.textContent = "";
  let valide = true;
  if (nom === "") {
    erreurNom.textContent = "Saisissez un nom de produit.";
    champNom.setAttribute("aria-invalid", "true");
    valide = false;
  }
  if (!Number.isFinite(prix) || prix <= 0) {
    erreurPrix.textContent = "Saisissez un prix strictement positif.";
    champPrix.setAttribute("aria-invalid", "true");
    valide = false;
  }
  if (!valide) return;

  produits.push({ id: prochainId, nom, prix, statut: "À acheter" });
  prochainId++;
  sauvegarderProduits();
  actualiserAffichage();
  formulaire.reset();
  champNom.focus();
  message.textContent = "Produit ajouté à la liste.";
}

// FONCTIONS À COMPLÉTER — aucune solution n'est fournie ci-dessous.


function modifierStatut(id) {
  // TODO : changer uniquement le statut du bon produit dans les deux sens.
  const produit = produits.find((produit) => produit.id === id);


  if (!produit) return;

  produit.statut = produit.statut === "Acheté" ? "À acheter" : "Acheté";

  
    // Le nom, le prix et l'id ne changent pas.
  // Mettre à jour la sauvegarde et l'affichage selon les critères actifs.


  sauvegarderProduits();
  actualiserAffichage();
}





function supprimerProduit(id) {
  // TODO : demander confirmation et retirer uniquement le bon produit.
  const delet = confirm("confirmer la modification")
  // Mettre à jour la sauvegarde et l'affichage si la suppression est confirmée.
  if (delet) {
    produits = produits.filter(produit => produit.id !== id)
    afficherProduits(produits);
  }
  if (!delet) {
    return;
  }
  if (produits.length === 0) {
    prochainId = 1;
  }
}

function appliquerCriteres() {

  // Combiner la recherche et le statut.
  const recherche = champRecherche.value.trim().toLowerCase();
  const statut = filtreStatut.value;

  const resultats = produits.filter((produit) => {
    const nomCorrespond = produit.nom.toLowerCase().includes(recherche);
    const statutCorrespond = statut === "tous" || produit.statut === statut;
    return nomCorrespond && statutCorrespond;
  });

  // Trier numériquement la copie créée par filter(), selon triPrix.value.
  // Mode initial : garder l'ordre actuel des résultats.
  const ordre = triPrix.value;
  if (ordre === "initial") return resultats;

  // Modes croissant et decroissant : comparer deux prix voisins.
  for (let i = 0; i < resultats.length - 1; i++) {
    for (let j = 0; j < resultats.length - 1 - i; j++) {
      const gauche = resultats[j];
      const droite = resultats[j + 1];

      if (
        (ordre === "croissant" && gauche.prix > droite.prix) ||
        (ordre === "decroissant" && gauche.prix < droite.prix)
      ) {
        resultats[j] = droite;
        resultats[j + 1] = gauche;
      }
    }
  }

  // Retourner les résultats sans modifier le tableau complet produits.
 

  return produits;
}

function reinitialiserCriteres() {
  // TODO : vider la recherche, sélectionner tous les produits et l'ordre initial.
  // Actualiser l'affichage, sans modifier les produits ni leur sauvegarde.
}
function sauvegarderProduits() {
  // TODO : sauvegarder le tableau complet produits dans localStorage.
  // Cette fonction est déjà appelée après un ajout.
}

function chargerProduits() {
  // TODO : récupérer la sauvegarde dans produits si elle existe.
  // En l'absence de sauvegarde, conserver les données initiales.
  // Une sauvegarde contenant [] doit rester une liste vide.
}

// Connexions fournies : compléter les fonctions appelées, sans les dupliquer.
function actualiserAffichage() {
  afficherProduits(appliquerCriteres());
}
formulaire.addEventListener("submit", ajouterProduit);
champRecherche.addEventListener("input", actualiserAffichage);
filtreStatut.addEventListener("change", actualiserAffichage);
triPrix.addEventListener("change", actualiserAffichage);
document
  .getElementById("reinitialiser-criteres")
  .addEventListener("click", reinitialiserCriteres);

chargerProduits();
prochainId = Math.max(0, ...produits.map((produit) => produit.id)) + 1;
actualiserAffichage();
