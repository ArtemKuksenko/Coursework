const minute = 60000;
var now = +new Date();
interval = 'm1'
change = 'bitcoin'
timeEnd = (now+minute*3).toString();
timeStart = (now-minute*60).toString();
base='tron'
console.log('https://api.coincap.io/v2/candles?exchange=binance&interval='+
	    	interval+'&baseId='+base+'&quoteId='+change+
	    	'&start='+timeStart+'&end='+timeEnd)