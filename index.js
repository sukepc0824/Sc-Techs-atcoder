import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;
const users = ["pcsuke", "azumak", "launchpencil"];

app.get('/ratings', async (req, res) => {
  try {
    const ratingResults = await Promise.all(users.map(async (user) => {
      const url = `https://atcoder.jp/users/${user}/history/json`;
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");

        const history = await response.json();
        const latest = history.at(-1); // 最新のコンテスト
        return {
          user,
          latestRating: latest?.NewRating ?? null,
          history
        };
      } catch (err) {
        return {
          user,
          latestRating: null,
          history: [],
          error: true
        };
      }
    }));

    const sorted = ratingResults.sort((a, b) => {
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
