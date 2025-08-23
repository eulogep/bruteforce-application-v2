
# Architecture de l'application de brute force

## Technologies choisies
- **Backend**: Python 3.x avec Flask (pour l'API REST et la logique du moteur de brute force).
- **Frontend**: React (pour l'interface utilisateur web interactive).
- **Communication**: REST API (JSON) entre le frontend et le backend.
- **Base de données (optionnel)**: SQLite (pour stocker les résultats d'attaque, les journaux, etc., si nécessaire).

## Composants
1.  **Frontend (React App)**:
    - Interface utilisateur pour configurer et lancer les attaques.
    - Affichage en temps réel de la progression et des résultats.
    - Requêtes HTTP vers le backend pour démarrer/arrêter les attaques et récupérer les données.

2.  **Backend (Flask App)**:
    - **API REST**: Expose des endpoints pour:
        - Lancer une attaque de brute force.
        - Mettre en pause/arrêter une attaque.
        - Récupérer le statut de l'attaque.
        - Récupérer les résultats de l'attaque.
    - **Moteur de Brute Force**: Implémentation de la logique de brute force (génération de mots de passe, tentatives, gestion des protocoles).
    - **Gestionnaire de Tâches**: Pour gérer les attaques en arrière-plan (par exemple, en utilisant `threading` ou `multiprocessing` en Python).
    - **Logger**: Pour enregistrer les événements et les erreurs.

## Flux de données
1. L'utilisateur configure l'attaque via l'interface React et envoie une requête POST à l'API Flask.
2. Le backend Flask reçoit la requête, initialise le moteur de brute force et lance l'attaque en arrière-plan.
3. Le frontend React interroge régulièrement l'API Flask pour obtenir le statut et les résultats de l'attaque.
4. Le backend Flask envoie les mises à jour au frontend, qui les affiche à l'utilisateur.
5. Une fois l'attaque terminée ou arrêtée, les résultats finaux sont affichés et peuvent être exportés.


