// let parserToDB = require('./moduleParser.js');
let parserToMariadb = require('./moduleParser.js');

const minute = 60000;
// parserToMariadb(1514764800000,1546300800000,minute * 60 *24 *6,"tron","m15","tron_m15_2018y");
//(timeStart, timeEnd, step, base, interval, tableName)



parserToMariadb(1514764800000,1546300800000,minute * 60 *24,"ripple","m5","ripple_m5_2018y");
//create table ripple_m5_2018y (id INT, open FLOAT(18,16), high FLOAT(18,16), low FLOAT(18,16),close FLOAT(18,16), period BIGINT, data DATETIME)

//zil - zilliqa
//XRP - ripple