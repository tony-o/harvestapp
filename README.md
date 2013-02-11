#HarvestApp API

Example:
--------
```javascript
var harvester = require("./module");

var harvest = new harvester({
  domain:"test.harvestapp.com"
  ,user:"user"
  ,pass:"pass"
});

/* Grab today's time entries */
harvest.timers.daily(null,function(e,body){
  console.log(body);
});

/* Grab yesterday's time entries */
var date = new Date();
date.setDate(date.getDate() - 1);
harvest.timers.daily(date,function(e,body){
  console.log(body);
});

/* Grab time entry by ID (#2) */
harvest.timers.dailyById(2,function(e,body){
  console.log(body);
});

/* Toggle a timer */
harvest.timers.toggle(2,function(e,body){ });

/* Toggle a timer */
harvest.timers.create({
  /* data for the timer */
},function(e,body){ });


/* Toggle a timer */
harvest.timers.delete(2,function(e,body){ });

/* Update a timer */
harvest.timers.update(2,{
  /* data for the timer */
},function(e,body){ });
```
