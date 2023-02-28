// deno-lint-ignore-file no-dupe-class-members
import { Sqlite } from "./deps.ts";

export default class Database {
  static db: Sqlite.DB = new Sqlite.DB("database.sqlite");

  public static init() {
    this.databasePopulate();
  }

  static databasePopulate() {
    this.db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT UNIQUE, 
      password TEXT
    )
    `);
  }

  public static selectUser(id: number): any;
  public static selectUser(username: string): any;
  public static selectUser(input: string | number): any {
    let query;

    if (typeof input === "string") {
      query = this.db.query(`
      SELECT * FROM users WHERE username = ?
      `, [input]);
    } else if (typeof input === "number") {
      query = this.db.query(`
      SELECT * FROM users WHERE id = ?
      `, [input]);
    } else {
      throw new Error("Invalid input type");
    }

    const response = query.map((row: any) => {
      return {
        id: row[0],
        username: row[1],
        password: row[2],
      };
    });

    return response;
  }

  public static selectUsers(): any {
    const query = this.db.query(`
    SELECT * FROM users
    `);

    const response = query.map((row: any) => {
      return {
        id: row[0],
        username: row[1],
        password: row[2],
      };
    });

    return response;
  }

  public static insertUser(username: string, password: string) {
    this.db.query(`
    INSERT INTO users (username, password) VALUES (?, ?)
    `, [username, password]);
  }
}