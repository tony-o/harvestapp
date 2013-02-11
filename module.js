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
    request[data == "GET" ? "get" : "post"]({
      url:"https://" + (self.config.domain) + "/" + (url || "account/who_am_i")
      ,headers:{
        "Content-Type":"application/json"
        ,"Accept":"application/json"
        ,"Authorization":"Basic " + (new Buffer((self.config.user || self.config.username)+":"+(self.config.pass || self.config.password))).toString("base64")
      }
    },function(err,res,body){
      if(res && res.statusCode == 401){
        callback("Authentication error.");
      }
      callback(err,body);
    });
  };
  self.timers = {};

  self.timers.daily = function(date,callback,forUser){
    var url;

    date = date ? new Date(date) : new Date();
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
  
  self.people = {cache:{}};
  self.people.id = function(id,callback){
    if(self.people.cache[id]){
      callback(null,self.people.cache[id]);
    }
    self.req("people/" + id,function(e,b){
      self.people.cache[id] = b.user;
      callback(e,b);
    },"GET");
  };
  self.people.all = function(callback){
    self.req("people",function(e,b){
      b = JSON.parse(b);
      for(var u in b){
        self.people.cache[b[u].user.id] = b[u].user;
      }
      callback(e,b);
    },"GET");
  };
};

module.exports = tracker;
