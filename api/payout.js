import { Connection, Keypair, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const connection = new Connection("https://api.mainnet-beta.solana.com");

const secret = JSON.parse(process.env.TREASURY_PRIVATE_KEY);
const treasury = Keypair.fromSecretKey(Uint8Array.from(secret));

let pot = 0;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { winner } = req.body;

    const winnerPubkey = new PublicKey(winner);
    const amount = pot * 0.8;

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: treasury.publicKey,
        toPubkey: winnerPubkey,
        lamports: amount * 1e9,
      })
    );

    const sig = await connection.sendTransaction(tx, [treasury]);

    pot = 0;

    res.json({ sig });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
