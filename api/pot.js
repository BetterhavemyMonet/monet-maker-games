import { state } from "./state.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.json({ pot: state.pot });
  }

  if (req.method === "POST") {
    const { amount, tx } = req.body || {};

    if (!tx || typeof amount !== "number") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    if (state.seenTx.has(tx)) {
      return res.json({ pot: state.pot });
    }

    state.seenTx.add(tx);
    state.pot += amount;

    return res.json({ pot: state.pot });
  }

  if (req.method === "DELETE") {
    state.pot = 0;
    state.seenTx.clear();
    return res.json({ pot: state.pot });
  }

  return res.status(405).end();
}
