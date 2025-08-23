# 🔐 BruteForce Tool - Suite de Test de Sécurité

![Version](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Python](https://img.shields.io/badge/Python-3.12-yellow)
![Security](https://img.shields.io/badge/Security-Testing-red)

> **Projet d'études en Cybersécurité et Tests de Pénétration**  
> Développé par **MABIALA EULOGE JUNIOR** - Étudiant Ingénieur en Informatique

## 📋 Description

BruteForce Tool est une suite complète d'outils de test de sécurité développée dans le cadre d'études approfondies en cybersécurité. Cette application permet d'effectuer des audits de sécurité contrôlés et autorisés pour évaluer la robustesse des mots de passe et des systèmes d'authentification.

### 🎯 Objectifs Pédagogiques

- **Compréhension pratique** des vulnérabilités d'authentification
- **Maîtrise des techniques** de test de pénétration éthique
- **Développement de compétences** en sécurité offensive et défensive
- **Sensibilisation** aux enjeux de cybersécurité moderne

## ⚡ Fonctionnalités

### 🔍 Moteurs d'Attaque Avancés
- **Attaques par force brute** avec optimisations algorithmiques
- **Attaques par dictionnaire** avec règles personnalisables
- **Attaques hybrides** combinant plusieurs techniques
- **Credential Stuffing** pour tester les fuites de données
- **Support GPU** avec Hashcat et John the Ripper

### 🛠️ Gestion des Mots de Passe
- **Craquage de hash** (MD5, SHA1, SHA256)
- **Tests d'authentification HTTP**
- **Génération de dictionnaires personnalisés**
- **Analyse de robustesse** en temps réel

### 📊 Interface & Monitoring
- **Interface React moderne** avec composants UI professionnels
- **Surveillance en temps réel** des performances
- **Métriques détaillées** (vitesse, progression, ETA)
- **Visualisation graphique** des résultats

## 🚀 Installation

### Prérequis
```bash
# Versions recommandées
Node.js >= 18.0.0
Python >= 3.8
pnpm >= 8.0.0
```

### Configuration Frontend
```bash
cd bruteforce_frontend
pnpm install
pnpm run dev
```

### Configuration Backend
```bash
cd bruteforce_backend
pip install -r requirements.txt
python src/main.py
```

## 🔧 Architecture Technique

### Stack Technologique
- **Frontend**: React 19, Vite, TailwindCSS, Radix UI
- **Backend**: Python Flask, SQLAlchemy
- **Sécurité**: Hashcat, John the Ripper, OpenSSL
- **Base de données**: SQLite (développement), PostgreSQL (production)

### Patterns Architecturaux
- **Architecture MVC** avec séparation des responsabilités
- **API RESTful** pour communication frontend/backend
- **Pattern Observer** pour monitoring temps réel
- **Factory Pattern** pour les moteurs d'attaque

## 📚 Cas d'Usage Pédagogiques

### 1. Audit de Politique de Mots de Passe
```bash
# Test de robustesse d'une politique d'entreprise
./bruteforce_tool --type charset --min-length 8 --charset complex
```

### 2. Simulation d'Attaque APT
```bash
# Test avec dictionnaires personnalisés basés sur l'OSINT
./bruteforce_tool --type dictionary --dict custom_target.txt
```

### 3. Évaluation Post-Breach
```bash
# Test de credential stuffing après une fuite de données
./bruteforce_tool --type credential-stuffing --leaked-db breach.txt
```

## 🛡️ Considérations Éthiques et Légales

### ⚠️ Usage Autorisé Uniquement
Ce projet a été développé exclusivement pour :
- **Formation académique** en cybersécurité
- **Tests autorisés** sur systèmes propres
- **Recherche éthique** en sécurité informatique
- **Démonstrations pédagogiques** contrôlées

### 📜 Responsabilités
- ✅ Obtenir l'autorisation écrite avant tout test
- ✅ Respecter la législation locale en vigueur
- ✅ Documenter et limiter la portée des tests
- ❌ Interdiction formelle d'usage malveillant

## 📈 Métriques de Performance

| Méthode | Vitesse Moyenne | Optimisation GPU |
|---------|----------------|------------------|
| Charset | 10K-50K/sec | ❌ |
| Dictionary | 100K-500K/sec | ✅ |
| Hybrid | 50K-200K/sec | ✅ |
| GPU Hash | 1M-10M/sec | ✅ |

## 🎓 Compétences Développées

### Techniques
- **Cryptographie appliquée** et analyse de hash
- **Programmation système** et optimisation
- **Architecture logicielle** et patterns de conception
- **APIs RESTful** et communication client-serveur

### Sécurité
- **Techniques d'attaque** et vecteurs de compromission
- **Méthodologies de test** de pénétration
- **Analyse de vulnérabilités** d'authentification
- **Sécurité défensive** et contre-mesures

## 🔮 Évolutions Prévues

- [ ] **Intégration SIEM** pour monitoring avancé
- [ ] **Module de social engineering** pour tests complets
- [ ] **Support multi-threading** optimisé
- [ ] **Interface web responsive** pour déploiement cloud
- [ ] **Intégration CI/CD** pour tests automatisés

## 👨‍💻 À Propos de l'Auteur

**MABIALA EULOGE JUNIOR**  
*Étudiant Ingénieur en Informatique - Spécialisation Cybersécurité*

Passionné par la sécurité informatique et les challenges techniques, je développe mes compétences en sécurité offensive et défensive à travers des projets pratiques comme celui-ci. Mon objectif est d'intégrer une équipe de cybersécurité pour contribuer à la protection des infrastructures critiques.

### 🎯 Objectifs Professionnels
- **Analyst SOC** ou **Pentester Junior**
- **Red Team** ou **Blue Team** Specialist
- **Security Consultant** en entreprise
- **Recherche & Développement** en cybersécurité

## 📞 Contact & Collaboration

- 📧 **Email professionnel**: [Votre email]
- 🌐 **Portfolio**: [Votre site web]
- 💼 **LinkedIn**: [Votre profil]
- 🐙 **GitHub**: [Votre profil GitHub]

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

**⚖️ Disclaimer**: L'auteur décline toute responsabilité quant à l'utilisation malveillante de cet outil. L'utilisateur assume l'entière responsabilité de s'assurer que son utilisation respecte les lois en vigueur.

---

*"La cybersécurité n'est pas un produit, mais un processus"* - Bruce Schneier
