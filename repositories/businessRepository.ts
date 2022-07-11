import connection  from "../config/database.js";
import { TransactionTypes } from "./cardRepository.js";

export interface Business {
  id: number;
  name: string;
  type: TransactionTypes;
}

export async function findById(id: number) {
  const result = await connection.query<Business, [number]>(
    "SELECT * FROM businesses WHERE id=$1",
    [id]
  );

  return result.rows[0];
};

export async function findByIdAndCardId(id: number, cardId: number){
  const result = await connection.query(`
    SELECT bus.*
    FROM businesses AS bus
    JOIN cards
    ON cards.type = bus.type
    WHERE bus.id = $1 AND cards.id = $2;
  `, [id, cardId]);

  return result.rows[0];
}
