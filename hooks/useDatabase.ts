import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { Tracker } from "../contexts/TimeTrackerContext";

const DB_NAME = "TIME_TRACKERS_DB";
const TABLE_NAME = "TIME_TRACKERS_TABLE";
const DB_TRACKER_NAME_COL = "TRACKER_NAME";
const DB_FINISH_TIME_COL = "FINISH_TIME";
const DB_DESCRIPTION_COL = "DESCRIPTION";
const DB_REMINDERS_COL = "REMINDERS";

type DbEntry = Tracker;

// TODO: move SQL queries to a separate file

export const useDatabase = () => {
  const [db, setDb] = useState<SQLite.WebSQLDatabase>();

  useEffect(() => {
    const db = SQLite.openDatabase(DB_NAME);
    const SQLStatement = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${DB_TRACKER_NAME_COL} TEXT, ${DB_FINISH_TIME_COL} INTEGER, ${DB_DESCRIPTION_COL} TEXT, ${DB_REMINDERS_COL} NULL)`;
    db.transaction((transaction) => {
      transaction.executeSql(
        SQLStatement,
        undefined,
        undefined,
        (transaction, error) => {
          console.warn("Table already exists, not creating a new one");
          console.log(error);
          return !!error;
        }
      );
    });
    setDb(db);
  }, []);

  const addEntry = ({ name, payload }: DbEntry) => {
    const { finishTime, description, reminders } = payload;
    // TODO: make the statement more readable
    const SQLStatement = `INSERT INTO ${TABLE_NAME} (${DB_TRACKER_NAME_COL}, ${DB_FINISH_TIME_COL}${
      description ? `, ${DB_DESCRIPTION_COL}` : ""
    }${reminders ? `, ${DB_REMINDERS_COL}` : ""}) VALUES ('${name}', ${
      finishTime.value
    }${description ? `, '${description}'` : ""}${
      reminders ? `, ${reminders}` : ""
    })`;
    // TODO: handle success and error
    db?.transaction(
      (transaction) => {
        transaction.executeSql(SQLStatement);
      },
      (error) => {
        console.warn(`Add entry ${name}: FAILURE\n${error}`);
        return !!error;
      },
      () => console.log(`Add entry ${name}: SUCCESS`)
    );
  };

  const removeEntry = (name: DbEntry["name"]) => {
    const SQLStatement = `DELETE FROM ${TABLE_NAME} WHERE ${DB_TRACKER_NAME_COL} = '${name}'`;
    // TODO: handle success and error
    db?.transaction(
      (transaction) => {
        transaction.executeSql(SQLStatement);
      },
      (error) => {
        console.warn(`Delete entry ${name}: FAILURE\n${error}`);
        return !!error;
      },
      () => console.log(`Delete entry ${name}: SUCCESS`)
    );
  };

  const updateEntry = () => {};

  const getAllEntries = (callback?: (results: SQLite.SQLResultSet) => void) => {
    const SQLStatement = `SELECT * FROM ${TABLE_NAME}`;
    db?.readTransaction((transaction) => {
      transaction.executeSql(
        SQLStatement,
        undefined,
        (transaction, resultSet) => {
          console.log("Select all entries: SUCCESS");
          callback?.(resultSet);
        },
        (transaction, error) => {
          console.warn(`Select all entries: FAILURE\n${error}`);
          return !!error;
        }
      );
    });
  };

  const getEntry = (
    name: DbEntry["name"],
    callback?: (results: SQLite.SQLResultSet) => void
  ) => {
    const SQLStatement = `SELECT * FROM ${TABLE_NAME} WHERE ${DB_TRACKER_NAME_COL}='${name}'`;
    db?.readTransaction((transaction) => {
      transaction.executeSql(
        SQLStatement,
        undefined,
        (transaction, resultSet) => {
          console.log(`Select entry ${name}: SUCCESS`);
          callback?.(resultSet);
        },
        (transaction, error) => {
          console.warn(`Select entry ${name}: FAILURE\n${error}`);
          return !!error;
        }
      );
    });
  };

  const checkIfEntryExists = (
    name: DbEntry["name"],
    callback?: (entryExists: boolean) => void
  ) => {
    let entryExists: boolean = false;
    getEntry(name, (results) => {
      console.log(results);
      entryExists = results.rows.length > 0;
      callback?.(entryExists);
    });
  };

  return {
    addEntry,
    removeEntry,
    updateEntry,
    getAllEntries,
    checkIfEntryExists,
  };
};
