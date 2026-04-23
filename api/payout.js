import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { state } from "./state.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");

const secret = JSON.parse(process.env.TREASURY_PRIVATE_KEY);
const treasury = Keypair.fromSecretKey(Uint8Array.from(secret));

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { winner } = req.body || {};
    if (!winner) return res.status(400).json({ error: "Missing winner" });

    const winnerPubkey = new PublicKey(winner);

    const totalPot = state.pot;
    const winnerAmount = totalPot * 0.8;

    if (winnerAmount <= 0) {
      return res.status(400).json({ error: "Pot is empty" });
    }

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasury.publicKey,
        toPubkey: winnerPubkey,
        lamports: Math.floor(winnerAmount * 1e9),
      })
    );

    const sig = await connection.sendTransaction(tx, [treasury]);

    // reset pot after payout
    state.pot = 0;
    state.seenTx.clear();

    return res.json({ success: true, sig });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
