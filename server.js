const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

// Serve i file statici (index.html) direttamente dal server
app.use(express.static(__dirname));

// Endpoint proxy per cercare luoghi e locali
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query mancante' });

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&extratags=1&addressdetails=1`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'VelaWebMapsApp/1.0' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Errore durante la ricerca dei locali' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server Vela Maps attivo sulla porta ${PORT}`));