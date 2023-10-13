import pgPromise from "pg-promise";


const pgp = pgPromise();


const dbConfig = {
  connectionString: "postgres://postgres:123456@localhost:5432/postgres",
};


const db = pgp(dbConfig);


export { db };
