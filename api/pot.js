let pot = 0;
let seenTx = new Set();

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.json({ pot });
  }

  if (req.method === "POST") {
    const { amount, tx } = req.body;

    if (seenTx.has(tx)) {
      return res.json({ pot });
    }

    seenTx.add(tx);
    pot += amount;

    return res.json({ pot });
  }

  if (req.method === "DELETE") {
    pot = 0;
    seenTx.clear();
    return res.json({ pot });
  }
}
