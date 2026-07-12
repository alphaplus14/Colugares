import { MongoClient, Db } from "mongodb";
import dns from "dns";
import dotenv from "dotenv";

dotenv.config();

// En algunos routers Windows, querySrv de Node falla con ECONNREFUSED;
// DNS públicos permiten resolver mongodb+srv correctamente.
if (process.platform === "win32") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const dbName = process.env.MONGODB_DB_NAME ?? "colugares";

declare global {
  // eslint-disable-next-line no-var
  var _backendMongoClient: Promise<MongoClient> | undefined;
}

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI no está definida en las variables de entorno");
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._backendMongoClient) {
      const client = new MongoClient(uri);
      global._backendMongoClient = client.connect();
    }
    return global._backendMongoClient;
  }

  const client = new MongoClient(uri);
  return client.connect();
}

/** Obtiene la instancia de la base de datos (singleton en dev) */
export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(dbName);
}

/** Verifica conectividad con MongoDB Atlas */
export async function pingDb(): Promise<boolean> {
  try {
    const db = await getDb();
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}

/** Conecta explícitamente al iniciar el servidor */
export async function connectDb(): Promise<void> {
  await getDb();
  console.log("=> MongoDB conectado correctamente");
}
