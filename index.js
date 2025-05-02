import express from 'express';
import fetch from 'node-fetch';


const express = require('express');
const fetch = require('node-fetch');
const app = express();

const PORT = process.env.PORT || 3000;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24時間


// user -> { data, timestamp }
const cache = {};

// 取得対象ユーザー
const users = ['pcsuke', 'azumak', 'makoron_6', 'TamaiKoyomi', 'launchpencil', 'satouhao', 'soom', 'niko0906', 'AORNG', 'kouki0404', 'tomatyu', 'tori101500', 'kazurei', 'rukaa', 'mikiya1203', 'taiseidayoooo', 'tkiyom'];

app.get('/ratings', async (req, res) => {
  const results = await Promise.all(users.map(getUserData));
  const validResults = results.filter(r => r !== null);
  res.json(validResults);
});

async function getUserData(user) {
  const now = Date.now();

  // キャッシュが有効ならそれを返す
  if (cache[user] && now - cache[user].timestamp < CACHE_DURATION_MS) {
    return cache[user].data;
  }

  try {
    const [historyRes, acRes] = await Promise.all([
      fetch(`https://atcoder.jp/users/${user}/history/json`),
      fetch(`https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${user}`)
    ]);

    if (!historyRes.ok || !acRes.ok) throw new Error('fetch failed');

    const history = await historyRes.json();
    const acData = await acRes.json();
    const acCount = acData.count;

    const latest = history.at(-1);
    const newRating = latest?.NewRating ?? null;

    const userData = {
      user,
      latestRating: newRating,
      acCount,
      history
    };

    cache[user] = {
      data: userData,
      timestamp: now
    };

    return userData;

  } catch (err) {
    console.error(`Error fetching data for ${user}:`, err);
    return null; // エラー時は除外
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
