var harvester = require("./module");
var harvest = new harvester({
  domain:""
  ,user:""
  ,pass:""
});
harvest.timers.daily(null,function(e,body){
  console.log(body);
});
