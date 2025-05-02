import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/atcoder/:user', async (req, res) => {
  const { user } = req.params;
  const atcoderUrl = `https://atcoder.jp/users/${user}/history/json`;

  try {
    const response = await fetch(atcoderUrl);
    if (!response.ok) throw new Error("AtCoder fetch failed");

    const data = await response.json();
    res.set('Access-Control-Allow-Origin', '*');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch AtCoder data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
