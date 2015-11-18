var config = require('./config');
var mongodburl = process.env.MONGODB_URL ;
var collections = ["records"];

var mongojs = require('mongojs');
var ObjectId = mongojs.ObjectId;
var db = mongojs(mongodburl);
var records = db.collection('records');

function insert(id, data, cb)
{
	var json = JSON.parse(data);

	console.log('id',id);
	console.log('json',json);

  if(json.log.entries)
  {
    for(var i=0; i<json.log.entries.length; i++)
    {
  	  delete json.log.entries[i].$$hashKey;
    }
  }

  if(id === null)
  {
  	records.save(json, function(err, saved)
  	{
  		if(err || !saved)
  		{
  			return cb(err,'Internal Server Error');
  		}
      else
  		{
  			return cb(null,JSON.stringify(saved));
  		}
  	});
	}
	else
	{
  	delete json._id;

  	records.update({ _id: ObjectId(id) }, { $set: json }, function(err, updated)
  	{
  		if (err || !updated)
  		{
  			console.log("User not updated!");
  			console.log(err);
  		}
  		else
  		{
  			console.log("User updated!");
  			console.log(updated);
  			return cb(null,JSON.stringify(updated));
  		}
  	});
	}
}

function fetch(id, cb)
{
  if(id === null)
  {
  	records.find(function(err, records)
  	{
  		if (err || !records)
  	   	{
  	   		return cb(err,'Internal Server Error');
  		}
  		else
  		{
  			if (records == '')
  			{
  				return cb(null,JSON.stringify("[]"));
  			}
  			str = '[';
  			str = JSON.stringify(records);
  			str = str.trim();
  			str = str.substring(0,str.length-1);
  			str = str + ']';
  			return cb(null,JSON.stringify(str));
  		}
  	});
  }
	else
	{
  	records.find({ _id: ObjectId(id) }, function(err, record)
  	{
  		if(err || !record)
  		{
  			return cb(err,'Internal Server Error');
  		}
      else
      {
        if (record == '')
        {
          return cb(null,JSON.stringify("[]"));
        }
        return cb(null,JSON.stringify(JSON.stringify(record)));
      }
  	});
  }
}

module.exports.insert = insert;
module.exports.fetch = fetch;
