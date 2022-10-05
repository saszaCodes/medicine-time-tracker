import * as SQLite from "expo-sqlite";
import { SQLResultSet } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Tracker, Trackers } from "../contexts/TimeTrackerContext";

const DB_NAME = "TIME_TRACKERS_DB";
const TABLE_NAME = "TIME_TRACKERS_TABLE";
const DB_TRACKER_NAME_COL = "TRACKER_NAME";
const DB_FINISH_TIME_COL = "FINISH_TIME";
const DB_DESCRIPTION_COL = "DESCRIPTION";
const DB_REMINDERS_COL = "REMINDERS";

type DbEntry = Tracker;

// TODO: move SQL queries to a separate file

const parseResultsToObj = (results: SQLResultSet) => {
  const parsedResults: Tracker[] = [];
  results.rows._array.forEach((result) => {
    const name = result[DB_TRACKER_NAME_COL];
    const payload: Tracker["payload"] = {
      description: result[DB_DESCRIPTION_COL],
      finishTime: result[DB_FINISH_TIME_COL],
      reminders: result[DB_REMINDERS_COL],
    };
    parsedResults.push({ name, payload });
  });
  return parsedResults;
};

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
          console.warn(error);
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

  const removeEntry = (name: DbEntry["name"], callback?: () => void) => {
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
      () => {
        console.log(`Delete entry ${name}: SUCCESS`);
        callback?.();
      }
    );
  };

  const updateEntry = () => {};

  const getAllEntries = (callback?: (results: Trackers) => void) => {
    const SQLStatement = `SELECT * FROM ${TABLE_NAME}`;
    db?.readTransaction((transaction) => {
      transaction.executeSql(
        SQLStatement,
        undefined,
        (transaction, resultSet) => {
          console.log("Select all entries: SUCCESS");
          const parsedResults = parseResultsToObj(resultSet);
          callback?.(parsedResults);
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
    callback?: (results: Tracker) => void
  ) => {
    const SQLStatement = `SELECT * FROM ${TABLE_NAME} WHERE ${DB_TRACKER_NAME_COL}='${name}'`;
    db?.readTransaction((transaction) => {
      transaction.executeSql(
        SQLStatement,
        undefined,
        (transaction, resultSet) => {
          console.log(`Select entry ${name}: SUCCESS`);
          const parsedResults = parseResultsToObj(resultSet);
          callback?.(parsedResults[0]);
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
    getEntry(name, (result) => {
      entryExists = !!result;
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
