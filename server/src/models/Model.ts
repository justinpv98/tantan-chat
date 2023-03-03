import pool from "@/db/db";
import format from "pg-format";

import { merge, flattenObject } from "@/utils/objectUtils";

/*
I accidentally created my own simple query builder when trying to abstract and simplify my queries.
It's not intended for complex queries.

New models are created by extending this base Model class and adding properties to constructor
for insertion. 

NOTE: Object.entries should be O(n) for most objects since Node utilizes V8.
TODO: Test extensively.
*/

/*
/ Types
*/
type Options = {
  select?: string[];
  as?: { [key: string]: string };
  where?: WhereClause;
  set?: object;
  limit?: number | false;
  offset?: number | false;
  orderBy?: OrderByColumn[];
  returning?: string[] | false;
};

type Primitive = string | number | boolean;
type ArrayOfPrimitives = string[] | number[];

type Operators = {
  et?: Primitive;
  net?: Primitive;
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  like?: string;
  notLike?: string;
  in: ArrayOfPrimitives;
  notIn: ArrayOfPrimitives;
  between?: ArrayOfPrimitives;
  notBetween?: ArrayOfPrimitives;
};

type Expression = {
  [key: string]: string | string[] | number | boolean | Operators;
};

type WhereClause =
  | {
      [key: string]: any;
      and?: Expression[];
      or?: undefined;
      not?: object[];
    }
  | false;

type OrderByColumn = {
  [key: string]: "ASC" | "DESC";
};

/*
/ Defaults
*/

const operators = {
  et: "=",
  net: "!=",
  gt: ">",
  lt: "<",
  gte: ">=",
  lte: "<=",
  like: "LIKE",
  notLike: "NOT LIKE",
  in: "IN",
  notIn: "NOT IN",
  between: "BETWEEN",
  notBetween: "NOT BETWEEN",
};

const defaultOptions: Options = {
  select: [],
  as: {},
  set: [],
  where: false,
  limit: false,
  offset: false,
  orderBy: [],
  returning: [],
};

class Model<T> {
  modelName: string;
  
  constructor(modelName: string) {
    this.modelName = modelName;
  }

  async save(config?: Options) {
    const { as, returning } = this.#assignDefaults(config);

    let insertColumns: string | string[] = [];
    let insertValues = [];

    for (const [column, value] of Object.entries(this)) {
      if (column !== "modelName" && value) {
        insertColumns.push('"' + column + '"');
        insertValues.push(value);
      }
    }

    const insertPlaceholders = this.#createPlaceholders(insertValues);
    insertColumns = insertColumns.join(", ");

    const insertStatement = `INSERT INTO "${this.modelName}" (${insertColumns}) VALUES (${insertPlaceholders}) `;
    let returningClause: string = this.#composeReturningClause(returning, as);


    /* Query Construction */
    const unformattedQuery = [insertStatement, returningClause];
    const query = this.#constructQuery(unformattedQuery, ...insertValues);

    const { rows } = await pool.query(query);
    const data: T = rows.length ? rows[0] : null;

    Object.assign(this, data);
  }

  async findById(id: string | number, config?: Options | undefined) {
    const { select, as } = this.#assignDefaults(config);

    const selectStatement = this.#composeSelectStatement(select, as);

    const whereClause = `WHERE id = %L`;

    const unformattedQuery = [selectStatement, whereClause];

    const query = this.#constructQuery(unformattedQuery, id);

    const { rows } = await pool.query(query);
    const data: T = rows.length ? rows[0] : null;
    return data;
  }

  async findAll(config: Options) {
    const { select, as, where, orderBy, limit, offset } =
      this.#assignDefaults(config);

    const selectStatement = this.#composeSelectStatement(select, as);
    const [whereClause, whereValues] = this.#composeWhereClause(where);
    const orderByClause = this.#composeOrderByClause(orderBy);
    const limitClause = limit ? `LIMIT ${limit} ` : "";
    const offsetClause = offset ? `OFFSET ${offset}` : "";

    const unformattedQuery = [
      selectStatement,
      whereClause as string,
      orderByClause,
      limitClause,
      offsetClause,
    ];
    const query = this.#constructQuery(unformattedQuery, ...whereValues);


    const { rows } = await pool.query(query);
    const data: T[] = rows.length ? rows : null;
    return data;
    
  }

  async updateById(id: string | number, config?: Options) {
    const { set } = this.#assignDefaults(config);

    const updateStatement = `UPDATE "${this.modelName}" `;
    const [setClause, setValues] = this.#composeSetClause(set) as [
      string,
      any[]
    ];
    const whereClause = "WHERE id = %L";

    const unformattedQuery = [updateStatement, setClause, whereClause];

    const query = this.#constructQuery(unformattedQuery, ...setValues, id);

    const { rows } = await pool.query(query);
    const data: T = rows.length ? rows : null;
    return data;
  }

  async updateAll(config: Options) {
    const { set, where } = this.#assignDefaults(config);

    const updateStatement = `UPDATE "${this.modelName}"  `;
    const [setClause, setValues] = this.#composeSetClause(set) as [
      string,
      any[]
    ];
    const [whereClause, whereValues] = this.#composeWhereClause(where);

    const unformattedQuery = [updateStatement, setClause, whereClause];

    const query = this.#constructQuery(
      unformattedQuery,
      ...setValues,
      ...whereValues
    );

    const { rows } = await pool.query(query);
    const data: T[] = rows.length ? rows : null;
    return data;
  }

  async deleteById(id: string | number, config?: Options) {
    const { returning, as } = this.#assignDefaults(config);

    const deleteStatement = `DELETE FROM "${this.modelName}" `;
    const whereClause = `WHERE id = %L `;
    let returningClause = "";

    if (returning) {
      returningClause = this.#composeReturningClause(returning, as);
    }

    const unformattedQuery = [deleteStatement, whereClause, returningClause];

    const query = this.#constructQuery(unformattedQuery, id);


    const { rows } = await pool.query(query);
    const data: T | number = rows.length ? rows[0] : null;
    return data;
  }

  async deleteAll(config: Options) {
    const { where, returning, as } = this.#assignDefaults(config);

    const deleteStatement = `DELETE FROM "${this.modelName}" `;
    const [whereClause, whereValues] = this.#composeWhereClause(where);
    let returningClause = "";

    if (returning) {
      returningClause = this.#composeReturningClause(returning, as);
    }

    const unformattedQuery = [deleteStatement, whereClause, returningClause];

    const query = this.#constructQuery(unformattedQuery, ...whereValues);

    const { rows } = await pool.query(query);
    const data: T | number = rows.length ? rows : null;
    return data;
  }

  /*
  / Utilities
 */

  // Assigns defaults to config object
  #assignDefaults(config: Options | undefined) {
    return merge(defaultOptions, config) as Options;
  }

  // Constructs a formatted query statement from clauses and arguments
  #constructQuery(clauses: string[], ...args: any[]) {
    let unformattedQuery = "";
    clauses.forEach((clause) => (unformattedQuery += clause));

    const query = format(unformattedQuery, ...args);
    return query;
  }

  // Creates placeholders from the number of columns
  #createPlaceholders(columns: any[]) {
    return Array(columns.length).fill("%L");
  }

  #composeOrderByClause(columns: OrderByColumn[]) {
    if (columns.length === 0) return "";

    let statement = "ORDER BY ";

    columns.forEach((columnEntry) => {
      for (const [column, direction] of Object.entries(columnEntry)) {
        const isLastEntry = columns[columns.length - 1][column];
        if (isLastEntry) {
          statement += column + " " + direction + " ";
        } else {
          statement += column + " " + direction + ", ";
        }
      }
    });

    return statement;
  }

  #composeSelectStatement(select: string[], as: object) {
    let selectColumns: string;

    if (!select || select.length === 0) {
      return `SELECT * FROM "${this.modelName}" `;
    }
    if (select.length === 1) {
      return `SELECT ${select[0]} FROM "${this.modelName}" `;
    }

    const aliasedColumns = select.map((column) =>
      as[column] ? `${column} AS ${as[column]}` : column
    );
    selectColumns = this.#formatColumns(aliasedColumns);

    return `SELECT ${selectColumns} FROM "${this.modelName}" `;
  }

  #composeSetClause(set: object) {
    let statement = "SET ";

    const entries = Object.entries(set);
    if (entries.length === 0) return ["", []];

    let values = [];

    for (const [column, value] of entries) {
      values.push(value);
      statement += column + " = %L";

      if (column == entries[entries.length - 1][0]) {
        statement += " ";
      } else {
        statement += ", ";
      }
    }

    return [statement, values];
  }

  #composeReturningClause(returning: string[] | false, as: object) {
    let returnColumns: string;

    if (returning) {
      const aliasedColumns = returning.map((column) =>
        as[column] ? `${column} AS ${as[column]}` : column
      );
      returnColumns = this.#formatColumns(aliasedColumns);
    }
    const returnStatement = returning ? `RETURNING ${returnColumns}` : "";

    return returnStatement;
  }

  #composeWhereClause(where: WhereClause) {
    if (!where) return ["", []] as [string, any[]];

    const flatWhere = flattenObject(where);
    const keys = Object.keys(flatWhere);

    let andStatementsArray: string[][] = [];
    let andValues = [];
    let orStatementsArray: string[][] = [];
    let orValues = [];
    let notStatementsArray: string[][] = [];
    let notValues = [];
    let individualStatementsArray: string[][] = [];
    let individualValues = [];

    // Assigns each key to the appropriate logical statement array
    keys.forEach((key) => {
      let value: string;
      let stuff: string[];
      switch (true) {
        case key.includes("and."):
          value = flatWhere[key];
          stuff = key
            .split(".")
            .filter(
              (part) => part !== "and" && isNaN(part as unknown as number)
            );
          andValues.push(value);
          andStatementsArray.push(stuff);
          break;
        case key.includes("or."):
          value = flatWhere[key];
          stuff = key
            .split(".")
            .filter(
              (part) => part !== "or" && isNaN(part as unknown as number)
            );

          orValues.push(value);
          orStatementsArray.push(stuff);
          break;
        case key.includes("not."):
          value = flatWhere[key];
          stuff = key
            .split(".")
            .filter(
              (part) => part !== "not" && isNaN(part as unknown as number)
            );

          notValues.push(value);
          notStatementsArray.push(stuff);
          break;
        default:
          value = flatWhere[key];
          stuff = key.split(".");

          individualValues.push(value);
          individualStatementsArray.push(stuff);
          return;
      }
    });

    let andStatements = this.#formatLogicalExpressions(
      andStatementsArray,
      "AND"
    );
    let orStatements = this.#formatLogicalExpressions(orStatementsArray, "OR");
    let notStatements = this.#formatLogicalExpressions(
      notStatementsArray,
      "AND"
    );
    let individualStatements = this.#formatLogicalExpressions(
      individualStatementsArray,
      "AND"
    );

    // Properly groups logical statements with parentheses if they exist
    let statementsArray = [andStatements, orStatements]
      .filter((statement) => statement.length > 0)
      .map((statement) => "(" + statement + ")");

    if (notStatements.length > 0) {
      notStatements = "NOT (" + notStatements + ")";
      statementsArray.push(notStatements);
    }

    let statementsWithOperator = statementsArray.join(" AND ");
    let finalStatement: string;

    if (!individualStatements) {
      finalStatement = statementsWithOperator;
    } else if (!statementsWithOperator) {
      finalStatement = individualStatements;
    } else {
      finalStatement = [individualStatements, statementsWithOperator].join(
        " AND "
      );
    }

    // Joins values into one array so they're in the correct order.
    const values = [].concat(individualValues, andValues, orValues, notValues);

    const clause = `WHERE ${finalStatement} `;

    return [clause, values] as [string, any[]];
  }

  #formatLogicalExpressions(
    expressions: string[][],
    logicalOperator: "AND" | "OR"
  ) {
    if (expressions.length === 0) return "";
    const formatted = expressions.map((array, index) => {
      if (array.length === 1) {
        return index < array.length - 1
          ? `"${array[0]}" = %L AND`
          : `"${array[0]}" = %L`;
      } else {
        const operator = array[1];
        return `"${array[0]}" ${operators[operator]} %L`;
      }
    });

    return formatted.join(" " + logicalOperator + " ") as string;
  }

  #formatColumns(columns: string[]) {
    return columns.length ? columns.join(", ") : "*";
  }
}

export default Model;
