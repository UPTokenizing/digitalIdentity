var initializer = {};

initializer.getContainFileJSON = function(fileName){	
	const fs = require('fs');	
	const scSol = fileName;
	const path = require('path');
	const roo = path.resolve('', '', scSol);	
	const source = fs.readFileSync(roo, 'UTF-8');
	const compiledCode = JSON.parse(source);
	return compiledCode;
}

initializer.getContainFile = function(fileName){	
	const fs = require('fs');	
	const scSol = fileName;
	const path = require('path');
	const roo = path.resolve('', '', scSol);
	const source = fs.readFileSync(roo, 'UTF-8');
	return source;
}

initializer.connectToServer = async function () {
	const WebSocket = require('ws');
	 const r = new Promise((resolve, reject) => {
		const ws = new WebSocket(blockchainAddress).on('open', () => {
			console.log('WebSocket connection established.');
			ws.close();
			resolve("alive");
		  }).on('error', (error) => {
			console.error('WebSocket error:', error);
			reject("error");
		  });
	});
	var y= r.then((result)=>{						
			y = {
				Result: "Connected"
			}
			return y;
		}).catch((error) =>{
			y = { Result: "Error"};			
			return y;
		});
	return y;
}

initializer.replacer = function(key, value) {
	if (typeof value === 'bigint') {
	  return {
		type: 'bigint',
		value: value.toString()
	  };
	} else {
	  return value;
	}
  }


module.exports = initializer;