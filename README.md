# Backend Spotify Integration

Ce backend en Node.js et Express permet d'intégrer Spotify pour récupérer des informations du profil utilisateur, les morceaux en cours d'écoute et les meilleurs morceaux ou artistes favoris. Il est configuré pour gérer automatiquement l'expiration du token d'authentification Spotify via un processus de rafraîchissement.

### Fonctionnalités

- **Récupération des informations Spotify** : Données en temps réel des morceaux et artistes favoris.
- **Suivi de la musique en cours** : Interroge régulièrement l'API Spotify pour obtenir la piste en cours d'écoute.
- **Gestion des tokens** : Rafraîchissement automatique des tokens d'accès pour maintenir une session valide.

### Lien vers le projet

Pour plus d'informations, visitez [cette page de présentation](https://alexis-delaunay.fr/presentation/music).

### Configuration

Assurez-vous de configurer votre fichier `.env` avec vos informations Spotify :

```plaintext
SPOTIFY_CLIENT_ID=VotreClientID
SPOTIFY_CLIENT_SECRET=VotreClientSecret
SPOTIFY_REFRESH_TOKEN=VotreRefreshToken
SPOTIFY_ACCESS_TOKEN=VotreAccessTokenInitial
PORT=3000
