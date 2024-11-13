import sqlite3 from 'sqlite3';

// Sets the execution mode to verbose to produce long stack traces.
const sqlite = sqlite3.verbose();

// create a database connection or open an existing one
/**
 * there are three ways to create a database connection
 * 1. ':memeory:' - creates a anonymous database in memory (RAM) that will be destroyed when the process exits
 * 2. '' - create a anonymous database in diskthat will be destroyed when the process exits
 * 3. 'filename' - create a database in disk that will be stored parmenenetly
 * 
 * new sqlite.Database('filename', 'mode', callback);
 */
const DB1 = new sqlite.Database(':memory:', sqlite.OPEN_READWRITE, connection);
const DB2 = new sqlite.Database('', sqlite.OPEN_READWRITE, connection);
const DB3 = new sqlite.Database('./database.db', sqlite.OPEN_READWRITE, connection);

function connection(err) {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log(" databse created | opened existing one successfully");
}

// create a user table in the database for storing user information
let sql = "CREATE TABLE IF NOT EXISTS users ( user_id integer primary key autoincrement, user_name text not null,user_salary float , created_at datatime DEFAULT CURRENT_TIMESTAMP ); ";
/**
 * syntax :  database.run(sql, params, callback);
 * params : array of values to be inserted into the sql statement
 * callback : function to be called when the query is executed
 */
DB3.run(sql, [], (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log("user table created successfully");
})

// store the required data in the database
sql = "create table log(log_id integer primary key autoincrement, log_time datetime DEFAULT CURRENT_TIMESTAMP, log_message text);";
DB1.run(sql, [], (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log("log table created successfully");
})

export { DB1, DB2, DB3 };