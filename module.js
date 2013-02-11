var request = require("request");

if(!Date.prototype.getDayOfYear){
  Date.prototype.getDayOfYear = function(){
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this - onejan) / 86400000);
  };
}

var fuse = function(uid){ return (uid ? "?of_user="+uid : ""); };

var tracker = function(config){
  var self = this;
  self.config = config;
  self.req = function(url,callback,data){
    request.post({
      url:"https://" + (self.config.domain) + /" + (url || "account/who_am_i")
      ,headers:{
        "Content-Type":"application/json"
        ,"Accept":"application/json"
        ,"Authorization":"Basic " + (new Buffer((self.config.user || self.config.username)+":"+(self.config.pass || self.config.password))).toString("base64")
      }
    },function(err,res,body){
      if(res.statusCode == 401){
        callback("Authentication error.");
      }
      callback(null,body);
    });
  };
  self.timers = {};

  self.timers.daily = function(date,callback,forUser){
    var url;

    date = date || new Date();
    url = "daily/" + date.getDayOfYear() + "/" + date.getFullYear() + fuse(forUser);
    self.req(url,callback);
  };
  self.timers.dailyById = function(id,callback,forUser){
    self.req("daily/show/" + id + fuse(forUser), callback);
  };
  self.timers.toggle = function(id,callback,forUser){
    self.req("daily/timer/" + id + fuse(forUser),callback);
  }
  self.timers.create = function(data,callback,forUser){
    self.req("daily/add" + fuse(forUser),callback,data);
  }
  self.timers.delete = function(id,callback,forUser){
    self.req("daily/delete/" + id + fuse(forUser),callback);
  }
  self.timers.update = function(id,data,callback,forUser){
    self.req("daily/update/" + id + fuse(forUser),callback,data);
  }
};

module.exports = tracker;
