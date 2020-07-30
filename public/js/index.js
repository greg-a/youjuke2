var userName;
var userID;

$(document).ready(function () {

  $(document).on("click", "#sign-out-button", function(event){
    $("#myModal").modal('show')
  })

  //signup process
  var signUpForm = $("form.signup");
  var emailSignup = $("input#email-signup");
  var passwordSignup = $("input#password-signup");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailSignup.val().trim(),
      password: passwordSignup.val().trim()
    };
    console.log(userData)
    if (!userData.email || !userData.password) {
      $("#alert .msg").text("Tip: you can enter a fake email address");
      $("#alert").fadeIn(500);
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailSignup.val("");
    passwordSignup.val("");
  });

  // login process
  var loginForm = $("form.login");
  var emailLogin = $("input#email-signin");
  var passwordLogin = $("input#password-signin");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: emailLogin.val().trim(),
      password: passwordLogin.val().trim()
    };
    console.log(userData)
    if (!userData.email || !userData.password) {
      $("#alert .msg").text("Username and password don't match.");
      $("#alert").fadeIn(500);
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailLogin.val("");
    passwordLogin.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password
    })
      .then(function (data) {
        console.log(data)
        userName = data.email;
        userID = data.id;
        $("#myModal").modal('hide');
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password
    })
      .then(function(data) {
        userName = data.email;
        $("#myModal").modal('hide');
        // If there's an error, log the error
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  function handleLoginErr(err) {
    var errType = err.responseJSON.original.errno;
    if (errType === 1062) {
      $("#alert .msg").text("Email already exists. Please log in.");
      $("#alert").fadeIn(500);
    }
    else {
      $("#alert .msg").text("Either email or password don't match.");
      $("#alert").fadeIn(500);
    }
    // console.log(err.responseJSON.original)
  }

  $("#submit-room").on("click", function (event) {
    var newRoom = {
      name: $("#new-room").val().trim(),
      description: $("#room-desc").val().trim(),
      userID: userID
    };

    $.ajax("/api/room", {
      type: "POST",
      data: newRoom
    }).then(
      function (res) {
        console.log("created room", newRoom);
        // location.reload(res.redirect);
        window.location.href = res.redirect;
      }
    )
  })
});
