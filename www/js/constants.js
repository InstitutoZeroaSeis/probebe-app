(function() {
  var API_BASE_URL = "http://localhost:3000/api";
  angular.module("proBebe.constants", []).constant("Constants", Object.freeze({
    API_BASE_URL: API_BASE_URL,
    CHILDREN_URL: API_BASE_URL + "/children",
    CREDENTIALS_URL: API_BASE_URL + "/credentials",
    DEVICE_REGISTRATION_URL: API_BASE_URL + "/device_registrations",
    MESSAGE_URL: API_BASE_URL + "/messages/:id",
    PUSH_NOTIFICATION: {
      GCM: {
        SENDER_ID: "315459751586"
      }
    },
    SIGN_UP_URL: "http://www.probebe.org.br/users/sign_up"
  }));
}());
