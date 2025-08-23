# 🚀 Guide de Déploiement - BruteForce Tool

**Développé par MABIALA EULOGE JUNIOR**  
*Étudiant Ingénieur - Spécialisation Cybersécurité*

## 📋 Prérequis

- Compte GitHub avec repository du projet
- Compte Netlify (gratuit)
- Node.js 18+ et pnpm installés localement

## 🔧 Configuration Netlify (Recommandée)

### Étape 1 : Connecter Netlify
1. **Dans Builder.io** : Cliquez sur [Connect to Netlify](#open-mcp-popover)
2. **Authentifiez-vous** avec votre compte Netlify
3. **Autorisez** l'accès aux repositories

### Étape 2 : Configuration Automatique
Le fichier `netlify.toml` est déjà configuré avec :
```toml
[build]
  base = "bruteforce_frontend"
  publish = "bruteforce_frontend/dist"
  command = "pnpm run build"
```

### Étape 3 : Variables d'Environnement
Dans Netlify Dashboard, configurez :
```bash
NODE_VERSION=18
VITE_APP_NAME="BruteForce Tool"
VITE_APP_VERSION="2.0.0"
VITE_APP_AUTHOR="MABIALA EULOGE JUNIOR"
VITE_ENABLE_DEMO_MODE=true
```

## 🌐 Déploiement Manuel (Alternative)

### Option A : Build Local + Upload
```bash
cd bruteforce_frontend
pnpm install
pnpm run build
# Upload le dossier 'dist' vers votre hébergeur
```

### Option B : Vercel
```bash
npm i -g vercel
cd bruteforce_frontend
vercel --prod
```

### Option C : GitHub Pages
```bash
# Ajouter au package.json
"homepage": "https://votre-username.github.io/bruteforce-tool"

# Build et deploy
pnpm run build
npx gh-pages -d dist
```

## 🔒 Configuration de Sécurité

### Headers de Sécurité (netlify.toml)
```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'"
```

### Variables Sensibles
- ✅ Utilisez des variables d'environnement
- ❌ Ne jamais commiter d'API keys
- ✅ Activez HTTPS en production
- ✅ Configurez CORS approprié

## 📊 Optimisations de Performance

### Configuration Vite Optimisée
- **Code splitting** automatique
- **Tree shaking** pour réduire la taille
- **Compression Gzip/Brotli**
- **Cache des assets** statiques

### Métriques Recommandées
- **First Contentful Paint** : < 2s
- **Largest Contentful Paint** : < 4s
- **Time to Interactive** : < 5s
- **Cumulative Layout Shift** : < 0.1

## 🚨 Considérations Légales

### Disclaimer Obligatoire
Assurez-vous que votre déploiement inclut :
- ✅ Avertissement d'usage éducatif uniquement
- ✅ Mention de l'auteur et licence
- ✅ Instructions d'usage éthique
- ✅ Limitations de responsabilité

### Exemple de Page d'Accueil
```html
<!-- Ajouter avant l'application -->
<div class="legal-notice">
  <h3>⚠️ Usage Éducatif Uniquement</h3>
  <p>Développé par MABIALA EULOGE JUNIOR pour l'apprentissage de la cybersécurité</p>
</div>
```

## 🌍 Domaines Personnalisés

### Configuration DNS
```bash
# CNAME record
www.votre-domaine.com -> your-site.netlify.app

# A record (optionnel)
votre-domaine.com -> 75.2.60.5
```

### SSL/TLS
- Netlify fournit automatiquement Let's Encrypt
- Vérifiez HTTPS uniquement en production
- Configurez HSTS si nécessaire

## 📈 Monitoring et Analytics

### Netlify Analytics
- Trafic et performances
- Erreurs 4xx/5xx
- Bande passante utilisée

### Google Analytics (Optionnel)
```javascript
// Dans index.html
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: 'BruteForce Tool - MABIALA EULOGE JUNIOR'
});
```

## 🔄 CI/CD Pipeline

### Déploiement Automatique
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd bruteforce_frontend && pnpm install
      - run: cd bruteforce_frontend && pnpm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=bruteforce_frontend/dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🛠️ Troubleshooting

### Erreurs Communes
| Erreur | Solution |
|--------|----------|
| Build Failed | Vérifier Node.js version (18+) |
| 404 sur refresh | Configurer redirects SPA |
| CSP Violation | Ajuster Content-Security-Policy |
| Import Errors | Vérifier alias de chemin |

### Debug Mode
```bash
# Build avec debug
cd bruteforce_frontend
VITE_DEBUG=true pnpm run build

# Serveur local de test
pnpm run preview
```

## 🎯 Checklist de Déploiement

- [ ] ✅ Repository GitHub configuré
- [ ] ✅ Netlify connecté via Builder.io MCP
- [ ] ✅ Variables d'environnement configurées
- [ ] ✅ Build réussi sans erreurs
- [ ] ✅ Tests fonctionnels en staging
- [ ] ✅ Headers de sécurité appliqués
- [ ] ✅ Disclaimer légal visible
- [ ] ✅ Performance > 90 (Lighthouse)
- [ ] ✅ HTTPS activé
- [ ] ✅ Domaine personnalisé (optionnel)

## 📞 Support

Pour toute question sur le déploiement :
- 📧 Contact : [Votre email]
- 📚 Documentation Netlify : https://docs.netlify.com
- 🛠️ Issues GitHub : Repository du projet

---

**Développé avec ❤️ par MABIALA EULOGE JUNIOR**  
*Dans le cadre d'études en cybersécurité et ingénierie informatique*
