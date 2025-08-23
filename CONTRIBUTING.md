# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **BruteForce Tool** ! Ce projet étant développé dans un cadre éducatif et de recherche en cybersécurité, nous accueillons les contributions constructives.

## 📋 Types de Contributions Acceptées

### ✅ Contributions Encouragées
- **Corrections de bugs** et améliorations de stabilité
- **Optimisations de performance** des algorithmes
- **Nouvelles fonctionnalités de sécurité** éthiques
- **Amélioration de la documentation** technique
- **Tests unitaires** et validation
- **Rapports de vulnérabilités** responsables

### ❌ Contributions Non Acceptées
- Fonctionnalités facilitant l'usage malveillant
- Contournement des mesures de sécurité éthique
- Code non documenté ou de mauvaise qualité
- Modifications non autorisées des disclaimers légaux

## 🔧 Processus de Contribution

### 1. Fork & Clone
```bash
git clone https://github.com/[votre-username]/bruteforce-tool.git
cd bruteforce-tool
```

### 2. Créer une Branche
```bash
git checkout -b feature/amelioration-description
```

### 3. Standards de Code

#### Frontend (React)
- Utiliser les hooks React modernes
- Suivre les conventions ESLint
- Composants fonctionnels privilégiés
- TypeScript pour les nouveaux modules

#### Backend (Python)
- Respect de PEP 8
- Documentation docstring complète
- Tests unitaires obligatoires
- Gestion d'erreurs robuste

### 4. Tests & Validation
```bash
# Frontend
cd bruteforce_frontend
pnpm run test
pnpm run lint

# Backend
cd bruteforce_backend
python -m pytest tests/
python -m flake8 src/
```

### 5. Pull Request
- Titre descriptif et concis
- Description détaillée des changements
- Référence aux issues liées
- Screenshots si changements UI

## 🛡️ Considérations Éthiques

### Code de Conduite
- Respecter l'usage éducatif du projet
- Documenter les implications sécuritaires
- Signaler les vulnérabilités de manière responsable
- Maintenir la philosophie "security by design"

### Responsabilité des Contributeurs
En contribuant, vous acceptez que :
- Vos contributions respectent les lois en vigueur
- Le code soumis ne facilitera pas d'activités malveillantes
- La documentation inclura les avertissements appropriés

## 📚 Resources pour Contributeurs

### Documentation Technique
- [Architecture du Système](docs/architecture.md)
- [Guide d'Installation](docs/Guide%20d'Installation%20-%20BruteForce%20Tool.md)
- [Spécifications API](docs/api-documentation.md)

### Standards de Sécurité
- OWASP Testing Guide
- NIST Cybersecurity Framework
- Ethical Hacking Guidelines

## 🎓 Contributions Académiques

Ce projet étant développé dans un cadre académique, nous encourageons particulièrement :

- **Étudiants en cybersécurité** souhaitant contribuer
- **Projets d'études** utilisant cette base
- **Recherches académiques** en sécurité informatique
- **Mémoires et thèses** sur les tests de pénétration

## 📞 Contact & Support

Pour toute question concernant les contributions :

- **Issues GitHub** : Pour bugs et features requests
- **Discussions** : Pour questions générales
- **Email** : [Contact direct avec l'auteur]

---

**Développé par MABIALA EULOGE JUNIOR**  
*Étudiant Ingénieur - Spécialisation Cybersécurité*

> *"La sécurité est un processus collaboratif, pas un état statique"*
