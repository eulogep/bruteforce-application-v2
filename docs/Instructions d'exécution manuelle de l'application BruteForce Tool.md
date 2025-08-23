# Instructions d'exécution manuelle de l'application BruteForce Tool

Ce document vous guidera à travers les étapes nécessaires pour lancer et tester manuellement l'application BruteForce Tool, y compris les améliorations récentes apportées au moteur (attaques basées sur des règles, support GPU) et à l'interface utilisateur.

## 1. Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre système :

*   **Python 3.8+** : Pour le backend Flask.
*   **Node.js (version LTS recommandée)** : Pour le frontend React.
*   **pnpm** : Un gestionnaire de paquets rapide pour Node.js (peut être installé via `npm install -g pnpm`).
*   **Git** (optionnel, si vous clonez le dépôt au lieu d'utiliser l'archive).
*   **Hashcat** (pour le support GPU) : Suivez les instructions d'installation officielles de Hashcat pour votre système d'exploitation et votre GPU. C'est crucial pour les attaques de craquage de hash basées sur le GPU.
    *   **Linux** : `sudo apt update && sudo apt install hashcat` (peut varier selon la distribution).
    *   **Windows/macOS** : Téléchargez depuis le site officiel de Hashcat.

## 2. Installation

1.  **Extrayez l'archive de l'application** :
    Si vous avez reçu un fichier `bruteforce_tool.tar.gz`, extrayez-le :
    ```bash
    tar -xzf bruteforce_tool.tar.gz
    cd bruteforce_app/
    ```
    Si vous avez cloné le dépôt Git, naviguez simplement vers le répertoire `bruteforce_app`.

2.  **Installez les dépendances du Backend (Flask)** :
    Naviguez vers le répertoire `bruteforce_backend` et installez les dépendances Python. Il est fortement recommandé d'utiliser un environnement virtuel.
    ```bash
    cd bruteforce_backend/
    python3 -m venv venv
    source venv/bin/activate  # Sur Windows, utilisez `venv\Scripts\activate`
    pip install -r requirements.txt
    ```

3.  **Installez les dépendances du Frontend (React)** :
    Naviguez vers le répertoire `bruteforce_frontend` et installez les dépendances Node.js avec pnpm.
    ```bash
    cd ../bruteforce_frontend/
    pnpm install
    ```

## 3. Lancement des serveurs

Vous devrez lancer le backend et le frontend dans des terminaux séparés.

1.  **Lancer le Backend (Flask)** :
    Dans votre premier terminal, assurez-vous d'être dans le répertoire `bruteforce_backend` et que votre environnement virtuel est activé, puis exécutez :
    ```bash
    cd /chemin/vers/bruteforce_app/bruteforce_backend
    source venv/bin/activate  # Ou `venv\Scripts\activate` sur Windows
    python src/main.py
    ```
    Le serveur Flask devrait démarrer sur `http://127.0.0.1:5000` ou `http://0.0.0.0:5000`.

2.  **Lancer le Frontend (React)** :
    Dans un **deuxième terminal**, naviguez vers le répertoire `bruteforce_frontend` et exécutez :
    ```bash
    cd /chemin/vers/bruteforce_app/bruteforce_frontend
    pnpm run dev --host
    ```
    Le serveur de développement React devrait démarrer sur `http://localhost:5173` (ou un autre port si 5173 est déjà utilisé). Notez l'URL affichée dans votre terminal.

## 4. Accès à l'application

Ouvrez votre navigateur web et accédez à l'URL du frontend (par exemple, `http://localhost:5173`).

## 5. Test des fonctionnalités

L'interface utilisateur a été mise à jour pour refléter les nouvelles fonctionnalités. Voici comment les tester :

### 5.1. Attaques basées sur des règles

1.  Dans la section 


### 5.1. Attaques basées sur des règles

1.  Dans la section "Configuration de l'attaque", sélectionnez "Basée sur des règles" comme "Type d'attaque".
2.  Choisissez un "Dictionnaire" (par exemple, `rockyou` si vous l'avez chargé, ou un dictionnaire personnalisé).
3.  Dans le champ "Règles", entrez une ou plusieurs règles séparées par des virgules (ex: `:capitalize, :append_digit:1`). Vous pouvez voir les règles disponibles sous le champ.
4.  Configurez la "Chaîne cible" ou le "Hash cible" selon le type de cible que vous souhaitez attaquer.
5.  Cliquez sur "Démarrer" et observez les tentatives avec les règles appliquées.

### 5.2. Craquage de Hash (GPU)

**Note importante :** Cette fonctionnalité nécessite que Hashcat soit correctement installé et configuré sur votre système, et que votre GPU soit compatible.

1.  Dans la section "Configuration de l'attaque", sélectionnez "Craquage de hash (GPU)" comme "Type d'attaque".
2.  Entrez le "Hash cible" que vous souhaitez craquer (ex: un hash MD5 de "test" est `098f6bcd4621d373cade4e832627b4f6`).
3.  Sélectionnez le "Type de hash" correspondant (MD5, SHA1, SHA256).
4.  Choisissez le "Mode d'attaque GPU" : "Brute Force" ou "Dictionnaire".
    *   **Brute Force** : Configurez le "Jeu de caractères" et les "Longueurs min/max".
    *   **Dictionnaire** : Fournissez le "Chemin du dictionnaire GPU" (ex: `/usr/share/wordlists/rockyou.txt` sur Linux).
5.  Cliquez sur "Démarrer". L'application utilisera Hashcat via le backend pour tenter de craquer le hash. Le statut devrait afficher des informations spécifiques au GPU si l'attaque est lancée avec succès.

### 5.3. Gestion des Dictionnaires

La section "Gestion des Dictionnaires" en bas de l'interface vous permet de :

*   **Charger un dictionnaire commun** : Sélectionnez un dictionnaire prédéfini (rockyou, common_passwords, french_passwords) pour le charger dans le backend.
*   **Créer un dictionnaire personnalisé** : Entrez un nom et une liste de mots (un par ligne) pour créer votre propre dictionnaire.
*   **Générer un dictionnaire personnel** : Fournissez des informations personnelles au format JSON (ex: `{"nom": "Dupont", "prenom": "Jean", "date_naissance": "1990-01-01"}`) pour générer un dictionnaire basé sur ces informations.

### 5.4. Informations GPU

Une nouvelle section "Informations GPU" est présente sur l'interface. Elle vous indiquera si un GPU est détecté, si Hashcat et John the Ripper sont disponibles, et leurs chemins respectifs. Cela vous aidera à diagnostiquer si le support GPU est correctement configuré sur votre système.

## 6. Dépannage

*   **"Port 5000 is in use" ou "Port 5173 is in use"** : Un autre processus utilise déjà ce port. Trouvez et tuez ce processus (utilisez `sudo netstat -tlnp | grep <port>` pour trouver le PID, puis `sudo kill -9 <PID>`).
*   **Erreurs de dépendances Python** : Assurez-vous que votre environnement virtuel est activé et que toutes les dépendances sont installées (`pip install -r requirements.txt`).
*   **Erreurs de dépendances Node.js** : Assurez-vous d'être dans le bon répertoire et que `pnpm install` a été exécuté sans erreur.
*   **Problèmes GPU/Hashcat** : Vérifiez l'installation de Hashcat et de ses dépendances (pilotes GPU). La section "Informations GPU" de l'application peut vous donner des indices.

J'espère que ces instructions vous seront utiles pour explorer et utiliser l'application avec ses nouvelles capacités. N'hésitez pas si vous avez d'autres questions ou si vous rencontrez des problèmes spécifiques lors de l'exécution. Bon test !

