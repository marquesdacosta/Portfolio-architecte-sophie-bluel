const baseUrl = 'http://localhost:5678/api/';

async function recupererTravaux() {
    try {
        const urlApi = baseUrl+'works';
        const response = await fetch(urlApi); // Envoi de la requête GET à l'API

        if (!response.ok) { // gere les erreurs http de la reponse server
            throw new Error(`Erreur lors de la récupération des travaux : ${response.status}`);
        }

        const travaux = await response.json(); // Conversion de la réponse en format JSON
        console.log('Travaux récupérés avec succès dans recupererTravaux:', travaux);

        return travaux;// renvoi la liste des travaux
    } catch (error) { // gere les erreurs de façon plus general
        console.error('Erreur lors de la récupération des travaux :', error);

        return []; // renvoi une liste vide en cas d'erreur
    }
}


// Fonction pour afficher les travaux dans la galerie
function afficherTravaux(travaux) { // prend notre liste de travaux en parametre 
    // Sélectionne l'élément de la galerie dans le DOM
    const galerieElement = document.querySelector('#portfolio .gallery');

    // Parcourt tous les travaux dans le tableau
    for (let i = 0; i < travaux.length; i++) {
        
        const travail = travaux[i]; // Récupère un travail à la fois

        
        const figureElement = document.createElement('figure'); // Crée un élément figure pour chaque travail
        
        const imgElement = document.createElement('img'); // Crée un élément img pour afficher l'image du travail

        
        imgElement.src = travail.imageUrl; // Définit l'attribut src de l'élément img avec l'URL de l'image       
        imgElement.alt = travail.title; // Définit l'attribut alt de l'élément img avec le titre du travail
        imgElement.style.height = '490px';

        
        const figcaptionElement = document.createElement('figcaption'); // Crée un élément figcaption pour afficher le titre du travail
    
        figcaptionElement.textContent = travail.title; // Définit le texte du figcaption avec le titre du travail

        
        figureElement.appendChild(imgElement); // Ajoute l'élément img à l'élément figure

        
        figureElement.appendChild(figcaptionElement); // Ajoute l'élément figcaption à l'élément figure

        
        galerieElement.appendChild(figureElement); // Ajoute l'élément figure à la galerie
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // Vérifie si l'URL contient "index.html"
    if (window.location.href.includes("index.html")) {
        const travaux = await recupererTravaux();
        afficherTravaux(travaux);
        ajouterFiltre(travaux);
    }
});


 function resetStyles() { // reset les styles des buttons de filtre 
        const allButtons = document.querySelectorAll('.filter__button');
        for (let j = 0; j < allButtons.length; j++) {
            allButtons[j].style.backgroundColor = '';
            allButtons[j].style.color = '';
        }
    }





    function ajouterFiltre(travaux) { // ajoute les buttons des filtres 
    const categories = new Set(); // Utilisation de l'objet Set pour stocker les catégories sans doublons

    for (let i = 0; i < travaux.length; i++) {
        const travail = travaux[i];
        categories.add(travail.category.name); // Ajoute le nom de la catégorie du travail à l'objet Set.
    }

    const buttonName = Array.from(categories); // Convertir l'objet Set en tableau
    buttonName.unshift("Tous"); // Ajouter "Tous" au début du tableau

    const filterDiv = document.querySelector('.filter');

    for (let i = 0; i < buttonName.length; i++) {
        const button = document.createElement('button');
        button.className = 'filter__button';
        button.innerHTML = buttonName[i];

        filterDiv.appendChild(button);
        
        if (estDansLeModeEdition()) {
            // En mode édition, supprime le bouton du DOM
            button.remove();
        } else {
            // Ajouter un gestionnaire d'événements uniquement si nous ne sommes pas en mode édition
            button.addEventListener("click", function () {
                resetStyles();

                this.style.backgroundColor = '#1D6154';
                this.style.color = 'white';

                filtrerEtMettreAJourGalerie(travaux, buttonName[i]);
            });

        }
    }
}


function filtrerEtMettreAJourGalerie(travaux, categoryCliqué) {
    // Filtrer les travaux en fonction de la catégorie
    const travauxFiltres = filterTravauxByCategory(travaux, categoryCliqué);

    // Vider la galerie
    viderGalerie();

    // Mettre à jour la galerie avec les travaux filtrés
    afficherTravaux(travauxFiltres);
}

function viderGalerie() {
    const galerieElement = document.querySelector('#portfolio .gallery');
    galerieElement.innerHTML = ''; 
}

function filterTravauxByCategory(travaux, categoryCliqué) {
    if (categoryCliqué === "Tous") {
        // Si "Tous" est sélectionné, renvoyer tous les travaux
        return travaux;
    } else {
        // Sinon, retourne un tableau filtré contenant les travaux dont la catégorie correspond à la catégorie spécifiée
        return travaux.filter(travail => travail.category.name === categoryCliqué);
    }
}


// options , menu deroulant 

async function options() {
    if (estDansLeModeEdition()){

      const categorieSelect = document.getElementById('categorieSelect');

    try {
        const urlApi = baseUrl+'categories';
        const response = await fetch(urlApi);

        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des categories : ${response.status}`);
        }

        const cate = await response.json();
        console.log(':', cate);

         cate.forEach( cate=> { 
        const option = document.createElement('option');
        option.value = cate.id;
        option.textContent = cate.name;
        categorieSelect.appendChild(option);
    });

    } catch (error) {
        console.error('Erreur lors de la récupération des categories :', error);

    }
}
}
 options();


// Login page // 


window.addEventListener("load", function() {
  const url = window.location.href;

  if (url.includes("login.html")) {

    const loginLink = document.getElementById("login-link");
      loginLink.classList.add("current-page");
  }
});


//  Authentification de l’utilisateur

if (window.location.href.includes("login.html")) { 

    const loginForm = document.querySelector('.login__form');

    loginForm.addEventListener('submit', async function (event) { // ecouteur d'event sur la soumission du formulaire

    event.preventDefault(); // empeche le rechargement de la page

    const email = document.getElementById('email').value; // recupere les valeurs des champs
    const password = document.getElementById('password').value; // recupere les valeurs des champs

    try {
         // Effectu une requête POST vers l'URL d'authentification avec les informations d'identification
        const response = await fetch(baseUrl+'users/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }), // Convertis les informations d'identification en format JSON
        });

          if (!response.ok) {
            if (response.status === 401 || response.status === 404) { // erreur d'authentification
                alert("Mauvais email ou mot de passe.");
                console.log("Mauvais email ou mot de passe.");
                return ;
            }
            else {
                throw new Error("Erreur lors de l'envoi du formulaire. Réponse du serveur : " + response.status);
            }
        }

        const data = await response.json(); // converti la reponse afin de recuperer le token

        const token = data.token; // stock le token d'authentification
	    sessionStorage.setItem('authToken', token); // grace a la methode sessionStorage

        console.log('Token:', token);
        console.log('Connexion réussie !');
        console.log(data);

        window.location.href = 'http://127.0.0.1:5500/FrontEnd/index.html'; // renvoi vers la page d'accueil 
    } catch (error) {
        alert(error.message);
    }
});
}



// Fonction pour vérifier si l'utilisateur est authentifié et dans le "mode édition"
function estDansLeModeEdition() {
    const token = sessionStorage.getItem('authToken');
    return token !== null;
}

// Fonction pour ajouter dynamiquement le contenu du mode edition
function ajoutContenuModeEdition() {
    if (estDansLeModeEdition()) {

        // Crée une div qui indique qu'on est dans le mode edition
        const messageBienvenueDiv = document.createElement('div');
        messageBienvenueDiv.className = 'welcome-message';

        // Crée un p qui contient le message 
        const messageBienvenueP = document.createElement('p');
        messageBienvenueP.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" fill="white" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>Mode édition';

        // Ajoute du p à la div
        messageBienvenueDiv.appendChild(messageBienvenueP);

        // Insère la div avant le premier élément enfant du body ( avant le header )
        const body = document.querySelector('body');
        body.insertBefore(messageBienvenueDiv, body.firstElementChild);

        // Ajout du boutton d'edition
        //Sélectionne l'élément h2 dans la section avec l'ID "portfolio"
        const h2Element = document.querySelector('#portfolio h2');

        // Crée le bouton d'edition
        const buttonElement = document.createElement('a');
        buttonElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z"/></svg>modifier'; // Définit le texte/icone du bouton

        // Ajoute la classe "button__edition" au bouton
        buttonElement.classList.add('button__edition');

        // Ajoute l'attribut href avec la valeur "#modale"
        buttonElement.href = '#modale';

        // Ajoute le bouton après l'élément h2
        h2Element.insertAdjacentElement('afterend', buttonElement);

         // Modifie le texte du lien Login pour Logout
         const header = document.querySelector('header');
        const loginLink = header.querySelector('#login-link');
        loginLink.innerHTML = '<li id="login-link">logout</li>';

        // Ajoute un événement de clic qui appelle la fonction de deconnexion
        const logoutLink = header.querySelector('#login-link');
        logoutLink.addEventListener('click', deconnexionUtilisateur);
    }
}


 ajoutContenuModeEdition();



// Logout



// Fonction pour gérer la déconnexion de l'utilisateur
function deconnexionUtilisateur() {
    // Supprime le token d'authentification de la session
    sessionStorage.removeItem('authToken');

    // Redirige vers la page de connexion
    window.location.href = 'http://127.0.0.1:5500/FrontEnd/login.html';
}





// Modale


    const modale = document.getElementById('modale');
    const lienEdition = document.querySelector('.button__edition');
    const modalWrapper = document.querySelector('.modal-wrapper');

    // ouverture de la modale

    if (estDansLeModeEdition()){
    lienEdition.addEventListener('click', openModale);
    }

async function openModale(event) {
    try {
        modale.classList.remove('hidden');
        
        // Récupère les travaux sans les ajouter à la galerie
        const travaux = await recupererTravaux();
        console.log('Travaux récupérés avec succès dans openModale:', travaux);

        // Ajoute les images des travaux à la modale
        ajouterImagesTravauxALaModale(travaux);

        // Arrête la propagation de l'événement pour éviter que le clic ne soit capturé par le document
        event.stopPropagation();

        // Ajoute un écouteur sur le document pour détecter les clics en dehors de la modale
        document.addEventListener('click', closeModale);
    } catch (error) {
        console.error('Erreur lors de l\'ouverture de la modale :', error);
        // Gérer l'erreur (peut-être afficher un message d'erreur à l'utilisateur)
    }
}



// Fonction pour fermer la modale 
function closeModale(e) {
    // Vérifie si l'élément cliqué est à l'extérieur de modal-wrapper
    if (!modalWrapper.contains(e.target)) {
        // Ajoute la classe 'hidden' à la modale
        modale.classList.add('hidden');

        // Supprime l'écouteur d'événements du document
        document.removeEventListener('click', closeModale);
    }

    // Vérifie si l'élément cliqué a la classe "close-modal"
    if (e.target.classList.contains('close-modal')) {
        // Ajoute la classe 'hidden' à la modale
        modale.classList.add('hidden');

        // Supprime l'écouteur d'événements du document
        document.removeEventListener('click', closeModale);
    }
}

// Fonction qui ajoute dynamquement les travaux dans la modale

function ajouterImagesTravauxALaModale(travaux) {
    const modalContent = document.querySelector('.modal-content');

    // Vide le contenu existant de la modale
    modalContent.innerHTML = '';
    

    // Parcourt tous les travaux dans le tableau
    for (let i = 0; i < travaux.length; i++) {
        // Récupère un travail à la fois
        const travail = travaux[i];

        // Crée un conteneur pour chaque image
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');


        // Attribue l'ID du travail à l'attribut data-id-travaux sur imageContainer
        imageContainer.dataset.idTravaux = travail.id;

        // Crée une image pour chaque travail dans la modale
        const imgElement = document.createElement('img');
        imgElement.src = travail.imageUrl;
        imgElement.alt = travail.title;

        // Ajoute les styles pour les images
        imgElement.style.height = '102px'; // Hauteur fixe de 102px

        // Ajoute un conteneur pour l'icône
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('icon-container');

        // Ajoutes un icone pour chaque travail
        const iconElement = document.createElement('i');
        iconElement.classList.add('fas', 'fa-trash-alt');

        // Ajoute certains style a l'icone 
        iconElement.style.color = 'white';

        // Ajoute l'icône au conteneur d'icône
        iconContainer.appendChild(iconElement);

        // Ajoute l'image au conteneur
        imageContainer.appendChild(imgElement);

        // Ajoute le conteneur d'icône au conteneur d'image
        imageContainer.appendChild(iconContainer);

        // Ajoute le conteneur à la section de contenu de la modale
        modalContent.appendChild(imageContainer);
    }
}



// Modale ajout ( 2e modale )


    function contenuAjoutImgContainer() {


        const ajouterImgContainer = document.querySelector('.ajouter-img');

        // Créer l'élément svg avec les attributs nécessaires
        const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgElement.setAttribute('height', '59');
        svgElement.setAttribute('width', '68');
        svgElement.setAttribute('fill', '#B9C5CC');
        svgElement.setAttribute('viewBox', '0 0 512 512');

        // Créer l'élément path à l'intérieur du svg avec l'attribut "d"
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z');

        // Ajouter le pathElement à l'élément svg
        svgElement.appendChild(pathElement);

        // Créer l'élément bouton avec la classe "btn-ajout-photo"
        const btnAjoutPhoto = document.createElement('button');
        btnAjoutPhoto.classList.add('btn-ajout-photo');
        btnAjoutPhoto.textContent = '+ Ajouter photo';

        // Créer l'élément p avec le texte spécifié
        const pElement = document.createElement('p');
        pElement.textContent = 'jpg, png : 4mo max';

        // Ajouter les éléments créés à l'élément div principal
        ajouterImgContainer.appendChild(svgElement);
        ajouterImgContainer.appendChild(btnAjoutPhoto);
        ajouterImgContainer.appendChild(pElement);

}


    if (estDansLeModeEdition()) {
        
    document.addEventListener('DOMContentLoaded', function () {

    const buttonModalAjout = document.getElementById('ajouterPhotoBtn');
    const modalAjout = document.getElementById('modale-ajout');
    const modalWrapperAjout = document.querySelector('.modal-wrapper-ajout');
    const returnArrowBtn = document.querySelector('.return-arrow');

    buttonModalAjout.addEventListener('click', function (e) { // ouvrir modale 2 
        // Ajoute la classe 'hidden' à modale
        modale.classList.add('hidden');

        // Supprime la classe 'hidden' de modalAjout
        modalAjout.classList.remove('hidden');

        // Arrête la propagation du clic pour éviter que closeModale soit déclenché immédiatement
        e.stopPropagation();

        // Ajoute un écouteur d'événements sur le document pour gérer la fermeture de la modaleAjout
        document.addEventListener('click', closeModaleAjout);
    });

    returnArrowBtn.addEventListener('click', function (e) { // retour de la modale 2 a la modale 1 
        // Ajouter la classe 'hidden' à modaleAjout
        modalAjout.classList.add('hidden');

        // Supprimer la classe 'hidden' de modale
        modale.classList.remove('hidden');

        // Arrêter la propagation du clic pour éviter que closeModale soit déclenché immédiatement
        e.stopPropagation();

        // Ajouter un écouteur d'événements sur le document pour gérer la fermeture de la modale
        document.addEventListener('click', closeModale);
    });

    // Fonction pour fermer la modaleAjout en fonction de l'élément cliqué
    function closeModaleAjout(e) {
        const ajouterImgContainer = document.querySelector('.ajouter-img');
        // Vérifie si l'élément cliqué est à l'extérieur de modalWrapperAjout
        if (!modalWrapperAjout.contains(e.target) || e.target.classList.contains('close-modal-ajout')) {
            // Ajoute la classe 'hidden' à la modaleAjout
            modalAjout.classList.add('hidden');

            ajouterImgContainer.innerHTML = '';

            contenuAjoutImgContainer();

            // Supprime l'écouteur d'événements du document
            document.removeEventListener('click', closeModaleAjout);
        }
    }
})
};


// formulaire ajout de photo dans la form

    if (estDansLeModeEdition()) {

        // Assurez-vous que l'accès à input-photo se fait après le chargement du DOM
document.addEventListener('DOMContentLoaded', function () {
    const btnAjoutPhoto = document.querySelector('.btn-ajout-photo');
    const inputAjoutPhoto = document.querySelector('.input-photo');
    const ajouterImgContainer = document.querySelector('.ajouter-img');

    // Ajoutez un écouteur pour le clic sur le bouton
    btnAjoutPhoto.addEventListener('click', function (e) {
        // Réinitialiser le contenu de ajouter-img
        ajouterImgContainer.innerHTML = '';

        // Empêcher la propagation de l'événement de clic
        e.stopPropagation();

        inputAjoutPhoto.click(); // Simule le clic sur l'élément input de type fichier
    });

    // Ajoutez un écouteur pour le changement de fichier
    inputAjoutPhoto.addEventListener('change', function () {
        const selectedFile = inputAjoutPhoto.files[0];

            // Vérifier le type de fichier
            if (selectedFile.type.startsWith('image/')) {
                // Créer un objet URL pour l'image sélectionnée
                const imageUrl = URL.createObjectURL(selectedFile);

                // Créer un élément image
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = 'Selected Image';
                imgElement.style.maxHeight = '169px';
                imgElement.style.maxWidth = '100%';

                // Ajouter l'image à ajouter-img
                ajouterImgContainer.appendChild(imgElement);
            } else {
                // Afficher une erreur si le fichier n'est pas une image
                alert('Veuillez sélectionner une image valide.');
            }
    });

    // Empêche la propagation du clic sur l'élément input pour éviter la fermeture de la modale
    inputAjoutPhoto.addEventListener('click', function (e) {
        e.stopPropagation();
    });
});
}

        // boutton modale 2 accessibilité + change style
    if (estDansLeModeEdition()){
    document.addEventListener('DOMContentLoaded', function () {
    const titreInput = document.getElementById('titreInput');
    const inputPhoto = document.querySelector('.input-photo');
    const validerBtn = document.getElementById('validerBtn');

    function activerValiderBtn() {
        // Vérifier si les champs titreInput et inputPhoto sont remplis
        if (titreInput.value.trim() !== '' && inputPhoto.value.trim() !== '') {
            // Activer le bouton et appliquer les styles
            validerBtn.style.backgroundColor = '#1D6154';
            validerBtn.style.color = 'white';
            validerBtn.style.pointerEvents = 'auto';
            validerBtn.style.cursor = 'pointer';
        } else {
            // Désactiver le bouton et restaurer les styles par défaut
            validerBtn.style.backgroundColor = ''; // Restaurer la couleur par défaut
            validerBtn.style.color = ''; // Restaurer la couleur par défaut
            validerBtn.style.pointerEvents = 'none';
            validerBtn.style.cursor = 'not-allowed';
        }
    }

    // Ajouter des gestionnaires d'événements pour les champs titreInput et inputPhoto
    titreInput.addEventListener('input', activerValiderBtn);
    inputPhoto.addEventListener('input', activerValiderBtn);
})
    };





    // Soumission Formulaire ( ajout nouveau projet )

    
async function submitForm() {
    try {
        // Vérifier si l'utilisateur est connecté
        if (!estDansLeModeEdition()) {
            throw new Error("Vous devez être connecté pour effectuer cette opération.");
        }

        // recupere les valeurs du form
        const titreInput = document.getElementById("titreInput").value;
        const categorieSelect = document.getElementById("categorieSelect").value;
        const inputPhoto = document.querySelector(".input-photo");

        // verfie si tout les champs sont bien rempli
        if (!titreInput || !categorieSelect || inputPhoto.files.length === 0) {
            throw new Error("Veuillez remplir tous les champs du formulaire.");
        }

       
        // creer l'objet form data pour stocker les données du form
        const formData = new FormData();
        formData.append("title", titreInput);
        formData.append("category", categorieSelect);
        formData.append("image", inputPhoto.files[0]);

        // Récupérer le token du sessionStorage
        const accessToken = sessionStorage.getItem('authToken');

        //defini l'entete ed la requete
        const headers = new Headers({
            "Authorization": "Bearer " + accessToken,
        });

        // envoie de la requete au server
        const response = await fetch(baseUrl+"works", {
            method: "POST",
            headers: headers,
            body: formData,
        });

        // gere les erreurs http venant de la reponse du serveur
        if (!response.ok) {
            if (response.status === 401) { // erreur d'authentification
                throw new Error("Authentification requise. Veuillez vous connecter.");
            } else {
                throw new Error("Erreur lors de l'envoi du formulaire. Réponse du serveur : " + response.status);
            }
        }

        // reponse extraite en json
        const data = await response.json();

        console.log(data);
    
        // gere les erreurs de façon plus general et approfondi
    } catch (error) {
        console.error("Erreur lors de l'envoi du formulaire :", error.message);
        alert(error.message);
    }
}

// Écouteur d'événement pour le formulaire
 if (estDansLeModeEdition()) {
const form = document.getElementById("ajoutForm");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitForm();
})
 };




    // Suppression travaux

 const modalContent = document.querySelector('.modal-content');

// Ajouter un écouteur d'événements à modalContent
 if (estDansLeModeEdition()) {
modalContent.addEventListener('click', async function (event) {
    console.log('Click détecté');  

    console.log('Élément cliqué :', event.target);

    // Si l'élément cliqué a la classe .icon-container ou ...
    if (event.target.classList.contains('icon-container')||
        event.target.classList.contains('fa-trash-alt')||
        event.target.classList.contains('fa-trash-alt::before')
        ) {
        event.preventDefault();

        // Trouve l'élément parent .image-container
        const imageContainer = event.target.closest('.image-container');
        console.log('Image Container :', imageContainer);

        // Récupére l'ID du travail à partir du dataset
        const idTravaux = imageContainer.dataset.idTravaux;
        console.log('ID du travail :', idTravaux);
        
        try {
            console.log('Tentative de suppression pour idTravaux :', idTravaux);  

            const accessToken = sessionStorage.getItem('authToken'); // recupere le token

            // envoie de la requete delete a l'api
            const response = await fetch(baseUrl+`works/${idTravaux}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken,
                },
            });

            console.log('Réponse de la requête de suppression :', response);  

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du travail.');
            }

            // Supprimer l'élément du DOM 
            imageContainer.remove();

            console.log('Travail supprimé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression du travail :', error.message);
            alert(error.message);
        }
    }
})
 };



