const exec = require('child_process').exec;

// Enter here the path to your miner executable
var shPath = './mine.sh';

function startScript() {
  var myscript = exec(shPath, function (error, stdout, stderr) {
  		console.log('stdout: ' + stdout);
  		console.log('stderr: ' + stderr);
  		if (error !== null) {
  			console.log('exec error: ' + error);
  		}
  });

  var lastOutputBlockNumber = 0;
  var lastOutputWasBlock = false;

  myscript.stdout.on('data',function(data) {
      data = data.trim();
      console.log(data);

      var blockStrIndex = data.indexOf("Now at block");
      if (blockStrIndex !== -1) {

        var blockNumber = parseInt( data.split(" ").pop() );
        if (lastOutputWasBlock && blockNumber == lastOutputBlockNumber + 1) {
          console.log("----- CONSEQUENT BLOCKS ("+lastOutputBlockNumber+","+blockNumber+")! Kill and restart ...");
          myscript.kill();
          startScript();
        } else {
          lastOutputBlockNumber = blockNumber;
        }

        lastOutputWasBlock = true;

      } else {
        lastOutputBlockNumber = 0;
        lastOutputWasBlock = false;
      }
  });

  myscript.stderr.on('data',function(data) {
      console.log("!ERR! "+data);
  });
}

startScript();
