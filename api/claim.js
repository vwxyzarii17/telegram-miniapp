let users = global.users || {};
global.users = users;

const REWARD_AMOUNT = 10;
const COOLDOWN_SECONDS = 5;

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { telegram_id } = req.body;

  if (!telegram_id) {
    return res.status(400).json({ error: "telegram_id required" });
  }

  if (!users[telegram_id]) {
    users[telegram_id] = { balance: 0, last_claim: 0 };
  }

  const now = Date.now();
  const diff = (now - users[telegram_id].last_claim) / 1000;

  if (diff < COOLDOWN_SECONDS) {
    return res.status(429).json({
      error: "Cooldown",
      wait: Math.ceil(COOLDOWN_SECONDS - diff)
    });
  }

  users[telegram_id].balance += REWARD_AMOUNT;
  users[telegram_id].last_claim = now;

  return res.status(200).json({
    success: true,
    reward: REWARD_AMOUNT,
    balance: users[telegram_id].balance
  });
}
