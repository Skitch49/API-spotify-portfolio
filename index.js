const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

let accessToken = process.env.SPOTIFY_ACCESS_TOKEN;
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
const cors = require('cors');

const allowedOrigins = [
    'https://api-spotify-portfolio.up.railway.app',
    'https://alexis-delaunay.fr'
  ];
  
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Origine non autorisée par CORS'));
      }
    },
    credentials: true
  }));

// Fonction pour rafraîchir le token Spotify
async function refreshSpotifyToken() {
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      },
      headers: {
        Authorization: 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    accessToken = response.data.access_token;
    console.log('Token Spotify actualisé');
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token', error);
  }
}

// Middleware pour s'assurer que le token est valide
async function ensureValidToken(req, res, next) {
  if (!accessToken) await refreshSpotifyToken();
  next();
}

// Route pour obtenir les meilleurs morceaux ou artistes
app.get('/api/spotify/top', ensureValidToken, async (req, res) => {
  const { time_range = 'medium_term', limit = 20, type = 'tracks' } = req.query;

  try {
    const response = await axios.get(`https://api.spotify.com/v1/me/top/${type}`, {
      params: { time_range, limit },
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      await refreshSpotifyToken();
      res.status(401).send('Token expiré, veuillez réessayer');
    } else {
      console.error(`Erreur lors de la récupération des meilleurs ${type}:`, error);
      res.status(500).send('Erreur serveur');
    }
  }
});

app.get('/api/spotify/current-track', ensureValidToken, async (req, res) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      // Si aucune piste n'est en cours de lecture, renvoie un objet vide
      if (response.status === 204) {
        return res.json(null);
      }
      
      res.json(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        await refreshSpotifyToken();
        res.status(401).send('Token expiré, veuillez réessayer');
      } else {
        console.error('Erreur lors de la récupération du morceau en cours de lecture:', error);
        res.status(500).send('Erreur serveur');
      }
    }
  });
// Rafraîchissement du token toutes les heures
setInterval(refreshSpotifyToken, 3600 * 1000);

app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
  refreshSpotifyToken();
});
