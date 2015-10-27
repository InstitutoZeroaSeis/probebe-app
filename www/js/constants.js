(function() {
  var API_BASE_URL = "http://www.probebe.org.br/api";
  // var API_BASE_URL = "http://192.168.0.106:3000/api";
  angular.module("proBebe.constants", []).constant("Constants", Object.freeze({
    API_BASE_URL: API_BASE_URL,
    CHILDREN_URL: API_BASE_URL + "/children",
    CREDENTIALS_URL: API_BASE_URL + "/credentials",
    DONATED_MESSAGES_URL: API_BASE_URL + "/donated_messages",
    DEVICE_REGISTRATION_URL: API_BASE_URL + "/device_registrations/:platform_code",
    MESSAGE_URL: API_BASE_URL + "/messages/:id",
    PUSH_NOTIFICATION: {
      GCM: {
        SENDER_ID: "315459751586"
      }
    },
    PROFILE_MAX_RECIPIENT_CHILDREN: API_BASE_URL + '/profiles/max_recipient_children',
    SIGN_UP_URL: API_BASE_URL + "/users",
    PROFILE_URL: API_BASE_URL + "/profiles",
    PROFILE_TYPE_DONOR: 'donor',
    PROFILE_TYPE_POSSIBLE_DONOR: 'possible_donor'
  }));
}());
