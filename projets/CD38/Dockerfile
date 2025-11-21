# Utiliser une image Python officielle comme base
FROM python:3.11-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier requirements.txt
COPY requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier les fichiers nécessaires de l'application
COPY api.py .
COPY index.html .
COPY docs/ ./docs/
COPY lib/ ./lib/

# Créer le dossier ressources et copier uniquement le fichier nécessaire
RUN mkdir -p ressources
COPY ressources/grid_500.gpkg ./ressources/


# Exposer le port sur lequel FastAPI va tourner
EXPOSE 8000

# Commande pour lancer l'application avec uvicorn
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"]
