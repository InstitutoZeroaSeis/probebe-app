angular.module("proBebe.constants", []).constant("Constants", Object.freeze({
  API_BASE_URL: "http://www.probebe.org.br",
  PUSH_NOTIFICATION: {
    GCM: {
      SENDER_ID: "315459751586"
    }
  },
  SIGN_UP_URL: "http://www.probebe.org.br/users/sign_up"
}));
