/**
 * Created by hanwencheng on 1/12/16.
 */
var validate = require('mongoose-validator');

//TODO this validator does not function
var stringValidator = {
  validator : function(value){
    return typeof value == "string" && value.length >= 6
  },
  message : ' {VALUE} should be at least 6 character '
}

var emailValidator = validate({
  validator: 'isEmail',
  message : "email format not qualified"
})

var phoneValidator = [
  validate({
    validator : 'isLength',
    arguments: [11, 16],
    message : "should use normal germany phone number, 11 to 15 digits"
  }),
  validate({
    validator : 'isNumeric',
    message : "phone number should only contain numbers"
  })
]

module.exports = function(Schema, collectionName){
  var ObjectId = Schema.ObjectId;
  return new Schema({
    city :  { type : String, required : true, index: true/*, validate : stringValidator*/},
    type : {type : Boolean, required : false}, //TODO has changed
    priceType : {type : Boolean, required : true},
    price : Schema.Types.Mixed,
    /** price : {type: Number, required : true},**/
    startDate : {type : Date, required : false}, //TODO has changed
    title : {type : String, required : true},
    owner : {type : ObjectId, required : true},
    username : {type : String, required : true},

    fakeName : {type : String, required : false},
    contactName : {type : String, required: false},

    location : {type : String, required : false},
    lat : { type : Number, required : false /*, validate : stringValidator*/},
    lng : { type : Number , required : false},
    size : Schema.Types.Mixed,
    /** size : { type :Number , required : false},**/
    //roomNumber : {type :Number, required : false},
    caution : { type : Number , required: false},
    endDate : { type : Date, required : false},
    description : { type : String, required : false},
    email : { type : String, required : false, validate : emailValidator},
    phone : { type : String, required : false, validate : phoneValidator},
    wechat : {type : String, required : false},
    note : { type : String, required : false},
    //maximumPerson : { type : Number, required : false} ,
    images : {type : Array, required : false},

  }, { strict : true, collection : collectionName, timestamps: true});
}
