import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDb } from "./config/mongodb";
import placeRoutes from "./places/place.routes";
import healthRoutes from "./routes/health.routes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

async function startServer(): Promise<void> {
  await connectDb();

  const app = express();

  app.use(
    cors({
      origin: frontendUrl,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/health", healthRoutes);
  app.use("/api/places", placeRoutes);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`=> Server activo en el puerto ${port}`);
  });
}

startServer().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  console.error(`Error al iniciar el servidor: ${message}`);
  process.exit(1);
});
