import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const users = ['pcsuke', 'azumak', 'makoron_6', 'TamaiKoyomi', 'launchpencil', 'satouhao', 'soom', 'niko0906', 'AORNG', 'kouki0404', 'tomatyu', 'tori101500', 'kazurei', 'rukaa', 'mikiya1203', 'taiseidayoooo', 'tkiyom'];

app.get('/ratings', async (req, res) => {
  try {
    const results = [];

    for (const user of users) {
      const historyUrl = `https://atcoder.jp/users/${user}/history/json`;
      const acUrl = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${user}`;

      try {
        const historyRes = await fetch(historyUrl);
        const acRes = await fetch(acUrl);

        const history = historyRes.ok ? await historyRes.json() : [];
        const acData = acRes.ok ? await acRes.json() : [];

        const latest = history.at(-1);

        results.push({
          user,
          latestRating: latest?.NewRating ?? null,
          acCount: acData.count,
          history
        });
      } catch (err) {
        results.push({
          user,
          latestRating: null,
          acCount: null,
          history: [],
          error: true
        });
      }
    }

    const sorted = results.sort((a, b) => {
      if (a.latestRating === null) return 1;
      if (b.latestRating === null) return -1;
      return b.latestRating - a.latestRating;
    });

    res.set('Access-Control-Allow-Origin', '*');
    res.json(sorted);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
