import { ObjectId } from "mongodb";

/** Normaliza req.params.id de Express a ObjectId válido */
export function parseObjectIdParam(id: string | string[]): ObjectId | null {
  const value = Array.isArray(id) ? id[0] : id;
  if (!value || !ObjectId.isValid(value)) {
    return null;
  }
  return new ObjectId(value);
}

/** Obtiene string de un param de ruta Express */
export function parseStringParam(value: string | string[]): string {
  return Array.isArray(value) ? value[0] : value;
}
