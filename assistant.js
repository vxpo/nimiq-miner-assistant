const spawn = require('child_process').spawn;

// Enter here the path to your miner executable
var shPath = './mine.sh';

function startScript() {
  var myscript = spawn(shPath);

  var lastOutputBlockNumber = 0;
  var lastOutputWasBlock = false;

  myscript.stdout.on('data',function(data) {
      var dataStr = data.toString();
      dataStr = dataStr.trim();
      console.log(dataStr);

      var blockStrIndex = dataStr.toString().indexOf("Now at block");
      if (blockStrIndex !== -1) {

        var blockNumber = parseInt( dataStr.split(" ").pop() );
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
      console.log("!ERR! "+data.toString());
  });
}

startScript();
