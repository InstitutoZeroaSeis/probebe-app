angular.module("proBebe.services")
.factory('errorHandler', function() {

  var message;
  function Handler() {}

  Handler._itContainsKey = function(response){
    return response.data == undefined
  }

  Handler._messageByKey = function(response){
    var errors = response.data.errors;
    for(key in errors){
      var attribute = this._defineAttribute(key) ;
      message += attribute+": "+ errors[key]+" ";
    }
  }

  Handler._defineAttribute = function(key){
    switch(key) {
      case "password":
        return "senha";
        break;
      case "cell_phone":
        return "Nº celular";
        break;
      default:
        return key;
    }
  }

  Handler.message = function(response){
    message = "";
    if(this._itContainsKey(response)){
      message = "Ocorreu um erro no cadastro";
    }else{
      this._messageByKey(response);
    }
    return message;
  }

  return Handler;

});
