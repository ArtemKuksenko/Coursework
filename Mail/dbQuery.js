module.exports  = class DB {	
	constructor(table){
		// A = require('./dbQuery.js'); a = new A('users'); a.insert('rrrr') 
		this.table = table;
		const mariadb = require('mariadb');
		this.pool = mariadb.createPool(
	    	require('./dbconnection.js').obj
	    );
		console.log('DB connection created');
	}

	insert(value){
		let pool = this.pool; 
		let table = this.table;
		return new Promise(async function(resolve, reject){
		  let conn;
		  try {
			conn = await pool.getConnection();
			let query = "INSERT IGNORE INTO " + table +
				" value ('" + value + "')";
			
			const res = await conn.query(query, [1, "mariadb"]);
			console.log(query);

			resolve(res);

		  } catch (err) {
			reject(err);
		  } finally {
			if (conn) return conn.end();
		  }
		});
	}

	delete(value){
		let pool = this.pool; 
		let table = this.table;
		return new Promise(async function(resolve, reject){
		  let conn;
		  try {
			conn = await pool.getConnection();
			let query = "DELETE FROM " + table +
				" WHERE email = " + "'" + value + "'";
			
			console.log(query); 
			const res = await conn.query(query, [1, "mariadb"]);

			resolve(res);

		  } catch (err) {
			reject(err);
		  } finally {
			if (conn) return conn.end();
		  }
		});
	}
}