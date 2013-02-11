var harvester = require("./module");
var harvest = new harvester({
  domain:"bestxperts.harvestapp.com"
  ,user:"tony.odell@bestxperts.com"
  ,pass:"Gr33nleaf"
});
var d = new Date();
harvest.timers.daily(d,function(e,body){
  harvest.people.all(function(e,body){
    console.log("cached folks");
    console.log(harvest.people.id("212323",function(e,u){
      console.log("USER");
      console.log(u);
    }));
  });
});
