angular.module("proBebe.services")
.factory('errorHandler', function() {

  var message;
  var keyValue;
  function Handler() {}

  Handler._itContainsKey = function(response){
    return response.data == undefined
  };

  Handler._messageByKey = function(response){
    var errors = response.data.errors;
    for(var key in errors){
      var attribute = this._defineAttribute(key);
      keyValue = attribute;
      message += attribute+": "+ errors[key]+" <br>";
    }
  };

  Handler._defineAttribute = function(key){
    switch(key) {
      case "password":
        return "senha";
        break;
      case "cell_phone":
        return "Nº celular";
        break;
      case "children.birth_date":
        return "Data de nasc.";
        break;
      default:
        return key;
    }
  };

  Handler.message = function(response){
    message = "";
    if(this._itContainsKey(response)){
      message = "Impossível comunicar com o servidor. Favor verificar sua conexão com a internet";
    }else{
      this._messageByKey(response);
    }
    return message;
  };

  Handler.key = function(){
    return keyValue;
  };

  return Handler;

});
