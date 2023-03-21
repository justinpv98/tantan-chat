import Model from "./Model";
import pool from "@/db/db";
import format from "pg-format";

export type RelationshipSchema = {
  id?: string;
  type?: 1 | 2 | 3 | 4;
  actor?: string;
  target?: string;
};

export class Relationship extends Model<RelationshipSchema> {
  id?: string;
  type?: 1 | 2 | 3 | 4;
  actor?: string;
  target?: string;

  constructor(config?: RelationshipSchema) {
    super("relationship");
    this.id = config?.id;
    this.type = config?.type;
    this.actor = config?.actor;
    this.target = config?.target;
  }

  async getRelationship(userId: string, targetId: string) {
    const query = format(
      `SELECT relationship.id, relationship.type, 
      (SELECT row_to_json("user")::jsonb-'password'-'email' FROM "user"
       WHERE "user".id = relationship.target) AS target 
       FROM relationship
       WHERE relationship.actor = %L AND relationship.target = %L`,
      userId,
      targetId
    );

    const { rows } = await pool.query(query);
    const data: RelationshipSchema = rows.length ? rows[0] : null;
    return data;
  }


  async getRelationships(userId: string) {
    const query = format(
      `SELECT relationship.id, relationship.type, 
      (SELECT row_to_json("user")::jsonb-'password'-'email'-'created_at' FROM "user"
       WHERE "user".id = relationship.target) AS target 
       FROM relationship
       WHERE relationship.actor = %L`,
      userId
    );

    const { rows } = await pool.query(query);
    const data: RelationshipSchema[] = rows.length ? rows : null;
    return data;
  }

  async createRelationship(userId: string, targetId: string, type: number){
    const query = format(
      `  WITH inserted_relationship as 
      (INSERT INTO relationship (type, actor, target) VALUES (%L, %L, %L) RETURNING *)
      SELECT inserted_relationship.id, inserted_relationship.type, (SELECT row_to_json("user")::jsonb-'password'-'email' FROM "user"
      WHERE "user".id = inserted_relationship.target) target  FROM inserted_relationship`,
      type,
      userId,
      targetId
    );

    const { rows } = await pool.query(query);
    const data: RelationshipSchema = rows.length ? rows[0] : null;
    return data;
  }


}

const RelationshipModel = new Relationship();

export default RelationshipModel;
