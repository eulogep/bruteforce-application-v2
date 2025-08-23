# Guide d'Installation - BruteForce Tool

## Prérequis Système

- **Python 3.11 ou supérieur**
- **Node.js 20 ou supérieur**
- **pnpm** (gestionnaire de paquets Node.js)

## Installation Étape par Étape

### 1. Extraction du Package
```bash
tar -xzf bruteforce_tool.tar.gz
cd bruteforce_app/
```

### 2. Configuration du Backend (Flask)
```bash
cd bruteforce_backend/

# Activation de l'environnement virtuel
source venv/bin/activate

# Installation des dépendances (si nécessaire)
pip install -r requirements.txt
```

### 3. Configuration du Frontend (React)
```bash
cd ../bruteforce_frontend/

# Installation des dépendances
pnpm install
```

## Lancement de l'Application

### Terminal 1 - Backend Flask
```bash
cd bruteforce_backend/
source venv/bin/activate
python src/main.py
```
Le backend sera accessible sur : http://localhost:5000

### Terminal 2 - Frontend React
```bash
cd bruteforce_frontend/
pnpm run dev --host
```
Le frontend sera accessible sur : http://localhost:5173

## Accès à l'Application

Ouvrez votre navigateur et accédez à : **http://localhost:5173**

## Vérification de l'Installation

1. L'interface utilisateur doit s'afficher avec le titre "BruteForce Tool"
2. Vous devez voir un avertissement de sécurité en jaune
3. Les formulaires de configuration doivent être fonctionnels
4. Testez avec une attaque simple :
   - Type d'attaque : Chaîne simple
   - Chaîne cible : "abc"
   - Cliquez sur "Démarrer"

## Dépannage

### Erreur "Module not found"
```bash
cd bruteforce_backend/
source venv/bin/activate
pip install -r requirements.txt
```

### Port déjà utilisé
- Modifiez le port dans `src/main.py` (backend) ou `vite.config.js` (frontend)

### Erreur de connexion au serveur
- Vérifiez que le backend Flask est démarré
- Vérifiez que le proxy est configuré dans `vite.config.js`

## Sécurité

⚠️ **IMPORTANT** : Cet outil est destiné uniquement à des fins éducatives et de test de sécurité autorisé. Ne l'utilisez jamais contre des systèmes sans autorisation explicite.

## Support

Pour toute question ou problème, consultez le fichier README.md pour plus de détails sur l'utilisation et les fonctionnalités.

