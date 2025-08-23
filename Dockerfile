# Dockerfile pour le backend Flask

# Utiliser une image Python officielle comme base
FROM python:3.11-slim-buster

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier requirements.txt et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le reste du code source de l'application
COPY . .

# Exposer le port sur lequel l'application Flask s'exécute
EXPOSE 5000

# Commande pour exécuter l'application Flask
CMD ["python", "src/main.py"]


