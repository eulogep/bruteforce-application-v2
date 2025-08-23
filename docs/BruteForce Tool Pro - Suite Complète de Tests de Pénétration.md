# BruteForce Tool Pro - Suite Complète de Tests de Pénétration

## 🚀 Vue d'ensemble

BruteForce Tool Pro est une suite complète et avancée d'outils de tests de pénétration conçue pour les professionnels de la cybersécurité, les chercheurs en sécurité et les étudiants. Cette application offre une gamme étendue de techniques d'attaque, allant du brute force traditionnel aux attaques web sophistiquées, en passant par les tests réseau et la stéganographie.

### ⚠️ Avertissement Légal et Éthique

**IMPORTANT :** Cette application est strictement destinée à des fins éducatives et de test de sécurité autorisé. L'utilisation de ces outils contre des systèmes sans autorisation explicite est illégale et contraire à l'éthique. Les utilisateurs sont entièrement responsables de l'utilisation qu'ils font de ces outils et doivent se conformer à toutes les lois locales et internationales applicables.

## 🎯 Fonctionnalités Principales

### 1. Brute Force Basique
- **Attaques par jeu de caractères** : Génération systématique de combinaisons
- **Attaques par dictionnaire** : Utilisation de listes de mots de passe prédéfinies
- **Attaques basées sur des règles** : Application de transformations sur les mots de dictionnaire
- **Attaques hybrides** : Combinaison de dictionnaires et de caractères générés
- **Craquage de hash** : Support MD5, SHA1, SHA256 avec accélération GPU
- **Credential Stuffing** : Test de crédentiels compromis sur différents services

### 2. Attaques Web Avancées
- **Injection SQL** : Détection et exploitation de vulnérabilités d'injection SQL
- **Cross-Site Scripting (XSS)** : Tests de vulnérabilités XSS réfléchies et stockées
- **Cross-Site Request Forgery (CSRF)** : Détection de l'absence de protection CSRF
- **Traversée de répertoires** : Tests d'accès non autorisé aux fichiers système
- **Injection de commandes** : Détection d'exécution de commandes arbitraires
- **Contournement d'upload** : Tests de sécurité des fonctionnalités d'upload
- **Attaques par timing** : Détection de vulnérabilités basées sur le temps de réponse
- **Fuzzing d'API** : Découverte d'endpoints et de vulnérabilités d'API

### 3. Attaques Réseau
- **Découverte de réseau** : Scan ARP et ICMP pour identifier les hôtes actifs
- **Scan de ports** : Identification des services ouverts sur les hôtes cibles
- **Énumération de services** : Identification détaillée des services et versions
- **Énumération de sous-domaines** : Découverte de sous-domaines cachés
- **Brute force de services** : Attaques contre SSH, FTP, SMTP
- **Tests SSL/TLS** : Évaluation de la sécurité des configurations SSL/TLS
- **Attaques SNMP** : Tests de chaînes de communauté SNMP
- **Attaques SMB** : Tests de vulnérabilités et d'énumération SMB

### 4. Attaques Sociales
- **Ingénierie sociale** : Collecte d'informations publiques et génération de mots de passe probables
- **Pulvérisation de mots de passe** : Attaques distribuées avec délais anti-détection
- **Bourrage de crédentiels** : Tests automatisés de crédentiels compromis

### 5. Stéganographie
- **Masquage de données** : Cacher des informations dans des images et fichiers audio
- **Extraction de données** : Récupération d'informations cachées
- **Analyse de médias** : Détection de stéganographie par analyse d'entropie
- **Chiffrement intégré** : Protection des données cachées par mot de passe

## 🛠️ Installation et Configuration

### Prérequis Système

- **Système d'exploitation** : Linux (Ubuntu 20.04+ recommandé), macOS, Windows avec WSL
- **Python** : Version 3.8 ou supérieure
- **Node.js** : Version 16 ou supérieure
- **Mémoire RAM** : 4 GB minimum, 8 GB recommandé
- **Espace disque** : 2 GB d'espace libre minimum

### Installation Automatique

```bash
# Cloner le repository
git clone https://github.com/votre-repo/bruteforce-tool-pro.git
cd bruteforce-tool-pro

# Exécuter le script d'installation
chmod +x install.sh
./install.sh
```

### Installation Manuelle

#### Backend (Flask)

```bash
# Naviguer vers le répertoire backend
cd bruteforce_backend

# Créer un environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# ou
venv\Scripts\activate     # Windows

# Installer les dépendances
pip install -r requirements.txt

# Installer les outils supplémentaires (optionnel)
sudo apt-get update
sudo apt-get install nmap hashcat john
```

#### Frontend (React)

```bash
# Naviguer vers le répertoire frontend
cd bruteforce_frontend

# Installer les dépendances
npm install
# ou
pnpm install
```

### Configuration GPU (Optionnel)

Pour activer l'accélération GPU pour le craquage de hash :

```bash
# Installer les pilotes NVIDIA CUDA (pour cartes NVIDIA)
sudo apt-get install nvidia-cuda-toolkit

# Vérifier l'installation
nvidia-smi
hashcat -I
```

## 🚀 Démarrage de l'Application

### Méthode 1 : Démarrage Manuel

#### Terminal 1 - Backend
```bash
cd bruteforce_backend
source venv/bin/activate
python src/main.py
```

#### Terminal 2 - Frontend
```bash
cd bruteforce_frontend
npm run dev
# ou
pnpm run dev
```

L'application sera accessible à l'adresse : `http://localhost:5173`

### Méthode 2 : Docker (Recommandé pour la production)

```bash
# Construire et démarrer avec Docker Compose
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

## 📖 Guide d'Utilisation Détaillé

### Interface Principale

L'application est organisée en trois onglets principaux :

1. **Brute Force Basique** : Attaques traditionnelles de force brute
2. **Attaques Avancées** : Tests de pénétration web et réseau
3. **Stéganographie** : Outils de masquage et d'analyse de données

### Brute Force Basique

#### Configuration d'une Attaque par Jeu de Caractères

1. **Sélectionner le type d'attaque** : "Par jeu de caractères"
2. **Choisir le jeu de caractères** :
   - Minuscules (a-z)
   - Majuscules (A-Z)
   - Chiffres (0-9)
   - Ponctuation (!@#$)
   - Tous caractères imprimables
   - Personnalisé
3. **Définir la longueur** : Minimum et maximum (recommandé : 1-6 pour les tests)
4. **Configurer la cible** :
   - Chaîne simple : Pour tester un mot de passe connu
   - Hash : MD5, SHA1, SHA256
   - HTTP Basic Auth : URL et nom d'utilisateur

#### Exemple d'Attaque par Dictionnaire

```json
{
  "attack_type": "dictionary",
  "dictionary_name": "rockyou",
  "target_params": {
    "type": "hash_crack",
    "hash": "5d41402abc4b2a76b9719d911017c592",
    "hash_type": "md5"
  }
}
```

#### Gestion des Dictionnaires

L'application inclut plusieurs options pour la gestion des dictionnaires :

**Dictionnaires Prédéfinis :**
- `rockyou.txt` : Liste de 14 millions de mots de passe compromis
- `common_passwords.txt` : 10 000 mots de passe les plus courants
- `french_passwords.txt` : Mots de passe courants en français

**Création de Dictionnaires Personnalisés :**
```
Nom : mon_dictionnaire
Mots :
password123
admin
test
motdepasse
```

**Génération de Dictionnaires Personnels :**
```json
{
  "name": "john_doe_dict",
  "personal_info": {
    "first_name": "John",
    "last_name": "Doe",
    "birth_year": "1990",
    "company": "TechCorp",
    "pet_name": "Fluffy"
  }
}
```

### Attaques Web Avancées

#### Tests d'Injection SQL

1. **Configurer l'URL cible** : `https://example.com/login.php`
2. **Spécifier les paramètres** : `username`, `password`, `id`
3. **Démarrer l'attaque** : L'outil testera automatiquement différents payloads

**Payloads Testés :**
- `' OR '1'='1`
- `' UNION SELECT NULL--`
- `'; DROP TABLE users--`
- Attaques de timing avec `SLEEP()` et `WAITFOR`

#### Tests XSS (Cross-Site Scripting)

L'outil teste automatiquement différents vecteurs XSS :
- Scripts JavaScript classiques
- Événements HTML (onerror, onload)
- Contournements de filtres
- Encodage et obfuscation

#### Fuzzing d'API

Pour tester la sécurité d'une API :

1. **URL de base** : `https://api.example.com`
2. **Endpoints testés automatiquement** :
   - `/api/v1/users`
   - `/api/v1/admin`
   - `/admin`
   - `/config`
   - `/debug`

### Attaques Réseau

#### Découverte de Réseau

```
Réseau à scanner : 192.168.1.0/24
```

L'outil effectuera :
- Scan ARP pour découvrir les hôtes actifs
- Scan ICMP pour vérifier la connectivité
- Scan de ports sur les hôtes découverts

#### Brute Force SSH

Configuration typique :
```
Hôte : 192.168.1.100
Port : 22
Utilisateurs : root, admin, user
Mots de passe : password, 123456, admin
```

**Fonctionnalités de Sécurité :**
- Délais entre les tentatives pour éviter la détection
- Support de la rotation d'IP source
- Gestion des timeouts et erreurs de connexion

### Stéganographie

#### Masquer des Données dans une Image

1. **Sélectionner le type de média** : Image (PNG, JPG)
2. **Chemin du média source** : `/chemin/vers/image.png`
3. **Données secrètes** : Votre message à cacher
4. **Chemin de sortie** : `/chemin/vers/output.png`
5. **Chiffrement optionnel** : Mot de passe pour sécuriser les données

#### Extraction de Données

1. **Média avec données cachées** : `/chemin/vers/media_avec_donnees.png`
2. **Mot de passe** : Si les données sont chiffrées
3. **Extraction** : Les données apparaîtront dans la zone de texte

#### Analyse de Stéganographie

L'outil analyse l'entropie des bits de poids faible pour détecter :
- Présence probable de données cachées
- Motifs suspects dans les canaux RGB
- Marqueurs de fin de stéganographie LSB

## 🔧 Configuration Avancée

### Variables d'Environnement

```bash
# Backend
export FLASK_ENV=development
export FLASK_DEBUG=1
export DATABASE_URL=sqlite:///app.db

# Frontend
export REACT_APP_API_URL=http://localhost:5000
export REACT_APP_ENV=development
```

### Configuration GPU

Pour optimiser les performances GPU :

```python
# Configuration Hashcat
GPU_WORKLOAD_PROFILE = 3  # High performance
GPU_KERNEL_ACCEL = 32
GPU_KERNEL_LOOPS = 1024
```

### Paramètres de Sécurité

```python
# Limitations de taux
RATE_LIMIT_REQUESTS = 100
RATE_LIMIT_WINDOW = 60  # secondes

# Timeouts
HTTP_TIMEOUT = 10
SSH_TIMEOUT = 5
FTP_TIMEOUT = 5
```

## 📊 Monitoring et Logs

### Logs d'Application

Les logs sont stockés dans :
- Backend : `bruteforce_backend/logs/`
- Frontend : Console du navigateur

### Métriques de Performance

L'application fournit des métriques en temps réel :
- Tentatives par seconde
- Temps de réponse moyen
- Taux de réussite
- Utilisation des ressources

### Alertes de Sécurité

Le système génère des alertes pour :
- Tentatives de connexion suspectes
- Utilisation excessive de ressources
- Détection de contre-mesures

## 🛡️ Sécurité et Bonnes Pratiques

### Utilisation Éthique

1. **Autorisation préalable** : Toujours obtenir une autorisation écrite
2. **Scope défini** : Limiter les tests aux systèmes autorisés
3. **Documentation** : Enregistrer toutes les activités de test
4. **Rapport responsable** : Signaler les vulnérabilités de manière responsable

### Protection des Données

- Chiffrement des données sensibles
- Stockage sécurisé des résultats
- Suppression automatique des logs anciens
- Anonymisation des données de test

### Contre-mesures de Détection

L'outil inclut des fonctionnalités pour éviter la détection :
- Rotation d'User-Agent
- Délais aléatoires entre les requêtes
- Distribution des attaques dans le temps
- Support de proxies et VPN

## 🔍 Dépannage

### Problèmes Courants

#### Erreur "Port déjà utilisé"
```bash
# Identifier le processus
lsof -i :5000
lsof -i :5173

# Tuer le processus
kill -9 <PID>
```

#### Erreurs de dépendances Python
```bash
# Réinstaller les dépendances
pip install --upgrade -r requirements.txt

# Vérifier la version Python
python --version
```

#### Problèmes GPU
```bash
# Vérifier les pilotes NVIDIA
nvidia-smi

# Tester Hashcat
hashcat -I

# Vérifier CUDA
nvcc --version
```

### Logs de Debug

Activer les logs détaillés :
```bash
export FLASK_DEBUG=1
export LOG_LEVEL=DEBUG
```

## 📈 Performance et Optimisation

### Optimisation Backend

- Utilisation de threads pour les attaques parallèles
- Pool de connexions pour les requêtes HTTP
- Cache en mémoire pour les dictionnaires
- Optimisation des requêtes de base de données

### Optimisation Frontend

- Lazy loading des composants
- Mise en cache des résultats
- Optimisation des re-renders React
- Compression des assets

### Optimisation GPU

- Utilisation optimale de la mémoire GPU
- Tuning des paramètres Hashcat
- Gestion intelligente des workloads
- Monitoring de la température GPU

## 🔄 Mises à Jour et Maintenance

### Mise à Jour de l'Application

```bash
# Sauvegarder la configuration
cp config.json config.json.backup

# Mettre à jour le code
git pull origin main

# Mettre à jour les dépendances
pip install -r requirements.txt
npm install

# Redémarrer l'application
./restart.sh
```

### Maintenance des Dictionnaires

- Mise à jour automatique des dictionnaires
- Nettoyage des doublons
- Optimisation de la taille des fichiers
- Validation de l'intégrité des données

## 🤝 Contribution et Support

### Contribuer au Projet

1. Fork le repository
2. Créer une branche feature
3. Implémenter les changements
4. Ajouter des tests
5. Soumettre une pull request

### Signaler des Bugs

Utiliser le système d'issues GitHub avec :
- Description détaillée du problème
- Étapes pour reproduire
- Logs d'erreur
- Configuration système

### Support Communautaire

- Documentation Wiki
- Forum de discussion
- Chat Discord
- Sessions de formation

## 📚 Ressources Supplémentaires

### Documentation Technique

- [API Reference](docs/api.md)
- [Architecture Guide](docs/architecture.md)
- [Security Guidelines](docs/security.md)
- [Performance Tuning](docs/performance.md)

### Formations et Certifications

- OSCP (Offensive Security Certified Professional)
- CEH (Certified Ethical Hacker)
- CISSP (Certified Information Systems Security Professional)
- SANS GPEN (GIAC Penetration Tester)

### Outils Complémentaires

- **Nmap** : Découverte de réseau et scan de ports
- **Burp Suite** : Proxy et scanner web
- **Metasploit** : Framework d'exploitation
- **Wireshark** : Analyse de trafic réseau

## 📄 Licence et Conditions d'Utilisation

Ce logiciel est distribué sous licence MIT avec les conditions suivantes :

- Utilisation libre pour l'éducation et la recherche
- Interdiction d'utilisation malveillante
- Aucune garantie de fonctionnement
- Responsabilité de l'utilisateur pour la conformité légale

## 🏆 Remerciements

Développé par l'équipe Manus AI avec le soutien de la communauté cybersécurité.

Remerciements spéciaux aux projets open source :
- Hashcat pour l'accélération GPU
- John the Ripper pour le craquage de mots de passe
- Scapy pour la manipulation de paquets réseau
- React et Flask pour les frameworks web

---

**Version :** 2.0.0  
**Dernière mise à jour :** Décembre 2024  
**Auteur :** Manus AI Team  
**Contact :** security@manus.ai

