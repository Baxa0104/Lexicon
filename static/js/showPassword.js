function togglePasswordVisibility() {
    var passwordField = document.getElementById("password");
    var confirmPasswordField = document.getElementById("confirm_password");
    var isChecked = document.getElementById("show-password").checked;
    if (isChecked) {
      passwordField.type = "text";
      confirmPasswordField.type = "text";
    } else {
      passwordField.type = "password";
      confirmPasswordField.type = "password";
    }
  }