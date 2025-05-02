import express from 'express';
import fetch from 'node-fetch';

const app = express();

const users = ['pcsuke', 'azumak', 'makoron_6', 'TamaiKoyomi', 'launchpencil', 'satouhao', 'soom', 'niko0906', 'AORNG', 'kouki0404', 'tomatyu', 'tori101500', 'kazurei', 'rukaa', 'mikiya1203', 'taiseidayoooo', 'tkiyom'];

const PORT = process.env.PORT || 3000;

app.get('/ratings', async (req, res) => {
  const results = [];

  for (const user of users) {
    const data = await getUserData(user);
    if (data !== null) {
      results.push(data);
    }
  }
  res.json(results);
});

async function getUserData(user) {
  try {
    const historyRes = await fetch(`https://atcoder.jp/users/${user}/history/json`);
    if (!historyRes.ok) throw new Error(`History fetch failed for ${user}`);
    const history = await historyRes.json();

    // 履歴が空ならスキップ
    if (!Array.isArray(history) || history.length === 0) return null;

    const acRes = await fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${user}`);
    if (!acRes.ok) throw new Error(`AC fetch failed for ${user}`);
    const acData = await acRes.json();
    const acCount = acData.count;

    const latest = history.at(-1);
    const newRating = latest?.NewRating ?? null;

    return {
      user,
      latestRating: newRating,
      acCount,
      history
    };

  } catch (err) {
    console.error(`Error for user ${user}:`, err);
    return null;
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
