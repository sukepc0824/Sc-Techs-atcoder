import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

const users = ["pcsuke", "azumak", "launchpencil"];

app.get('/ratings', async (req, res) => {
  try {
    const results = await Promise.all(users.map(async (user) => {
      const historyUrl = `https://atcoder.jp/users/${user}/history/json`;
      const acUrl = `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac?user=${user}`;

      try {
        // 並列取得
        const [historyRes, acRes] = await Promise.all([
          fetch(historyUrl),
          fetch(acUrl)
        ]);

        const history = historyRes.ok ? await historyRes.json() : [];
        const acData = acRes.ok ? await acRes.json() : [];

        const latest = history.at(-1);

        return {
          user,
          latestRating: latest?.NewRating ?? null,
          acCount: acData.count,
          history
        };
      } catch (err) {
        return {
          user,
          latestRating: null,
          acCount: null,
          history: [],
          error: true
        };
      }
    }));

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
