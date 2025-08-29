import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const db = getDatabase(app);

// Count tokens
function countTokens(str) {
  return Math.ceil(str.length / 4);
}

// Get user balance
async function getBalance(userId) {
  const snapshot = await get(ref(db, `users/${userId}`));
  if (!snapshot.exists()) {
    await set(ref(db, `users/${userId}`), { tokens: 1000 });
    return 1000;
  }
  return snapshot.val().tokens;
}

// Chat simulation
async function chat(userId, message) {
  const snapshot = await get(ref(db, `users/${userId}`));
  let tokens = snapshot.exists() ? snapshot.val().tokens : 1000;

  const costUser = countTokens(message);
  if (tokens < costUser) throw new Error("Not enough tokens");

  const reply = `Echo: ${message}`; // replace with real AI later
  const costBot = countTokens(reply);
  const totalCost = costUser + costBot;

  if (tokens < totalCost) throw new Error("Not enough tokens for response");

  tokens -= totalCost;
  await set(ref(db, `users/${userId}`), { tokens });

  return { reply, tokens };
}

// Add tokens (e.g., after watching ad)
async function addTokens(userId, amount) {
  const snapshot = await get(ref(db, `users/${userId}`));
  let tokens = snapshot.exists() ? snapshot.val().tokens : 1000;

  tokens += amount;
  await set(ref(db, `users/${userId}`), { tokens });

  return tokens;
}
