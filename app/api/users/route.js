import { ethers } from "ethers";
import UsuariosABI from "./UsuariosABI.json";

const contratoAddress = "0x7614299A9777caBd4A1db0EA9203CE6Ac7c4Da74";


const provider = new ethers.providers.JsonRpcProvider(
  "https://eth-goerli.g.alchemy.com/v2/WEpAhYLYIHE32IEIzEPu3"
);


const contrato = new ethers.Contract(contratoAddress, UsuariosABI, provider);

export async function POST(request) {
  try {
    const { wallet, signerPrivateKey } = await request.json();

    if (!wallet || !ethers.utils.isAddress(wallet)) {
      return Response.json({ error: "Wallet inválida" }, { status: 400 });
    }
    if (!signerPrivateKey) {
      return Response.json({ error: "Clave privada del signer requerida" }, { status: 400 });
    }

    const signer = new ethers.Wallet(signerPrivateKey, provider);
    const contratoConSigner = contrato.connect(signer);

    const tx = await contratoConSigner.registrar();
    await tx.wait();

    return Response.json({
      ok: true,
      wallet,
      message: "Wallet registrada en blockchain",
      txHash: tx.hash
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {

    const wallets = await contrato.obtenerUsuarios();
    return Response.json({
      ok: true,
      total: wallets.length,
      wallets
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

