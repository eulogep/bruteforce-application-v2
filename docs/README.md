# BruteForce Tool - Outil de Test de Sécurité

## Description

Cette application est un outil de brute force conçu à des fins éducatives et de test de sécurité autorisé. Elle permet de démontrer les techniques de craquage de mots de passe et de sensibiliser aux bonnes pratiques de sécurité.

⚠️ **AVERTISSEMENT** : Cet outil est destiné uniquement à des fins éducatives et de test de sécurité autorisé. L'utilisation non autorisée contre des systèmes tiers est illégale et contraire à l'éthique.

## Fonctionnalités

- **Attaque de chaîne simple** : Test de mots de passe contre une chaîne de caractères connue
- **Craquage de hash** : Support des algorithmes MD5, SHA1 et SHA256
- **HTTP Basic Auth** : Test d'authentification HTTP basique (fonctionnalité implémentée mais non testée dans cette démo)
- **Interface utilisateur moderne** : Interface web responsive avec React
- **Suivi en temps réel** : Affichage des tentatives, du temps écoulé et de la vitesse d'attaque
- **Configuration flexible** : Choix du jeu de caractères, longueur min/max, type d'attaque

## Architecture

### Backend (Flask)
- **API REST** : Endpoints pour démarrer, arrêter et suivre les attaques
- **Moteur de brute force** : Génération et test de mots de passe
- **Support multi-threading** : Exécution des attaques en arrière-plan
- **Fonctions cibles** : Support de différents types d'authentification

### Frontend (React)
- **Interface moderne** : Design avec Tailwind CSS et shadcn/ui
- **Temps réel** : Mise à jour automatique du statut d'attaque
- **Configuration intuitive** : Formulaires pour paramétrer les attaques
- **Responsive** : Compatible desktop et mobile

## Installation et Utilisation

### Prérequis
- Python 3.11+
- Node.js 20+
- pnpm

### Backend
```bash
cd bruteforce_backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

### Frontend
```bash
cd bruteforce_frontend
pnpm install
pnpm run dev --host
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000

## Exemples d'utilisation

### 1. Attaque de chaîne simple
- Type d'attaque : Chaîne simple
- Jeu de caractères : Minuscules (a-z)
- Longueur : 1-4
- Chaîne cible : "abc"

### 2. Craquage de hash MD5
- Type d'attaque : Craquage de hash
- Type de hash : MD5
- Hash cible : 900150983cd24fb0d6963f7d28e17f72 (hash MD5 de "abc")
- Jeu de caractères : Minuscules (a-z)
- Longueur : 1-4

## Sécurité et Éthique

- ✅ Utilisation autorisée pour l'éducation et les tests de sécurité
- ✅ Tests sur vos propres systèmes
- ✅ Recherche académique et formation
- ❌ Attaques non autorisées sur des systèmes tiers
- ❌ Utilisation malveillante ou illégale

## Limitations

- Longueur maximale des mots de passe : 10 caractères
- Pas de support pour les attaques distribuées
- Interface simplifiée pour des fins éducatives

## Technologies Utilisées

- **Backend** : Python, Flask, SQLAlchemy
- **Frontend** : React, Vite, Tailwind CSS, shadcn/ui
- **Autres** : Lucide Icons, threading pour les attaques asynchrones

## Licence

Ce projet est destiné uniquement à des fins éducatives. Utilisez-le de manière responsable et éthique.

