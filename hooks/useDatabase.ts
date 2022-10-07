import * as SQLite from "expo-sqlite";
import { SQLResultSet } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Tracker, Trackers } from "../types/types";

const DB_NAME = "TIME_TRACKERS_DB";
const TABLE_NAME = "TIME_TRACKERS_TABLE";
const DB_TRACKER_NAME_COL = "TRACKER_NAME";
const DB_FINISH_TIME_COL = "FINISH_TIME";
const DB_DESCRIPTION_COL = "DESCRIPTION";
const DB_REMINDERS_COL = "REMINDERS";

// TODO: clean up the confustion with DbEntry and Tracker types
type DbEntry = Tracker;

// TODO: move SQL queries to a separate file

const parseResultsToObj = (results: SQLResultSet) => {
  const parsedResults: Tracker[] = [];
  results.rows._array.forEach((result) => {
    parsedResults.push({
      name: result[DB_TRACKER_NAME_COL],
      description: result[DB_DESCRIPTION_COL],
      finishTime: { type: "date", value: result[DB_FINISH_TIME_COL] },
      reminders: result[DB_REMINDERS_COL],
    });
  });
  return parsedResults;
};

export const useDatabase = () => {
  const [db] = useState<SQLite.WebSQLDatabase>(SQLite.openDatabase(DB_NAME));

  // On first render add a new table (unless one already exists)
  useEffect((callback?: () => void) => {
    const SQLStatement = `CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (${DB_TRACKER_NAME_COL} TEXT, ${DB_FINISH_TIME_COL} INTEGER, ${DB_DESCRIPTION_COL} TEXT, ${DB_REMINDERS_COL} NULL)`;
    db.transaction((transaction) => {
      transaction.executeSql(
        SQLStatement,
        undefined,
        () => {
          console.log("New table created");
          callback?.();
        },
        (transaction, error) => {
          // TODO: filter errors to throw when something actually goes wrong
          console.warn("Table already exists, not creating a new one");
          console.warn(error);
          callback?.();
          return !!error;
        }
      );
    });
  }, []);

  // Add new entry
  const addEntry = (entry: Tracker, callback?: () => void) => {
    // Extract data from argument
    const { name, finishTime, description, reminders } = entry;
    // TODO: make the statement more readable
    // Define SQL
    const SQLStatement = `INSERT INTO ${TABLE_NAME} (${DB_TRACKER_NAME_COL}, ${DB_FINISH_TIME_COL}${
      description ? `, ${DB_DESCRIPTION_COL}` : ""
    }${reminders ? `, ${DB_REMINDERS_COL}` : ""}) VALUES ('${name}', ${
      finishTime.value
    }${description ? `, '${description}'` : ""}${
      reminders ? `, ${reminders}` : ""
    })`;
    // TODO: handle success and error
    // Execute SQL and call callback function on success
    db.transaction(
      (transaction) => {
        transaction.executeSql(SQLStatement);
      },
      (error) => {
        console.warn(`Add entry ${name}: FAILURE\n${error}`);
        return !!error;
      },
      () => {
        console.log(`Add entry ${name}: SUCCESS`);
        callback?.();
      }
    );
  };

  // Remove entry
  const removeEntry = (name: DbEntry["name"], callback?: () => void) => {
    // Define SQL
    const SQLStatement = `DELETE FROM ${TABLE_NAME} WHERE ${DB_TRACKER_NAME_COL} = '${name}'`;
    // TODO: handle success and error
    // Execute SQL and call callback function on success
    db.transaction(
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

  // Update entry
  const updateEntry = () => {};

  // Add entry
  const getEntry = (
    name: DbEntry["name"],
    callback?: (results: Tracker) => void
  ) => {
    // Define SQL
    const SQLStatement = `SELECT * FROM ${TABLE_NAME} WHERE ${DB_TRACKER_NAME_COL}='${name}'`;
    // Execute SQL and call callback function on success
    db.readTransaction((transaction) => {
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

  // Get all entries
  const getAllEntries = (callback?: (results: Trackers) => void) => {
    // Define SQL
    const SQLStatement = `SELECT * FROM ${TABLE_NAME}`;
    // Execute SQL and call callback function on success
    db.readTransaction((transaction) => {
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
  // Check if entry exists
  const checkIfEntryExists = (
    name: DbEntry["name"],
    callback?: (entryExists: boolean) => void
  ) => {
    // Try to get entry and call callback
    getEntry(name, (result) => callback?.(!!result));
  };

  return {
    addEntry,
    removeEntry,
    updateEntry,
    getAllEntries,
    checkIfEntryExists,
  };
};
