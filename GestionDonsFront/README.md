# GestionDonsFront

Application frontend pour la gestion des dons.

## Prérequis

- [Docker](https://www.docker.com/) installé sur votre machine.
- Un projet [Supabase](https://supabase.com/) actif.

## Configuration

Avant de lancer l'application, vous devez configurer les variables d'environnement pour connecter l'application à votre propre base de données Supabase.

1.  À la racine du projet `GestionDonsFront`, dupliquez le fichier d'exemple pour créer votre fichier de configuration :
    ```bash
    cp .env.example .env
    ```

2.  Ouvrez le fichier `.env` et remplacez les valeurs par vos propres identifiants Supabase :
    - `VITE_SUPABASE_URL` : L'URL de votre projet Supabase (trouvable dans **Settings > API**).
    - `VITE_SUPABASE_ANON_KEY` : La clé publique `anon` / `public` de votre projet (trouvable dans **Settings > API**).

    > **Important** : Il est impératif d'utiliser vos propres clés API Supabase pour que l'application se connecte à votre base de données et non à celle de démonstration.

## Exécution avec Docker

Suivez ces étapes pour construire et lancer l'application via Docker.

### 1. Construire l'image

Assurez-vous d'être dans le dossier `GestionDonsFront` et que votre fichier `.env` est bien configuré. Lancez ensuite :

```bash
docker build -t gestion-dons-front .
```

*Note : Vite intègre les variables d'environnement (commençant par `VITE_`) directement dans le code compilé lors du build. C'est pourquoi le fichier `.env` doit être présent à cette étape.*

### 2. Lancer le conteneur

Une fois l'image construite, démarrez le conteneur sur le port 8080 (ou un autre port de votre choix) :

```bash
docker run -d -p 8080:80 --name mon-front gestion-dons-front
```

L'application sera accessible à l'adresse **[http://localhost:8080](http://localhost:8080)**.

## Commandes Utiles

- **Arrêter le conteneur** :
  ```bash
  docker stop mon-front
  ```
- **Supprimer le conteneur** :
  ```bash
  docker rm mon-front
  ```
