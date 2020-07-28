var userName;

$(document).ready(function () {

  if (userName === undefined) {
    $("#myModal").modal('show');
  }

  $(".room").on("click", function(event) {
    localStorage.setItem("roomID", $(this).attr("data-room"))
  })

  //signup process
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-signup");
  var passwordInput = $("input#password-signup");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };
    console.log(userData)
    if (!userData.email || !userData.password) {
      $("#alert .msg").text("Tip: you can enter a fake email address ;)");
      $("#alert").fadeIn(500);
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // login process
  var loginForm = $("form.login");
  var emailInput = $("input#email-signin");
  var passwordInput = $("input#password-signin");

  // When the form is submitted, we validate there's an email and password entered
  loginForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }

    // If we have an email and password we run the loginUser function and clear the form
    loginUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
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
    console.log(err.responseJSON.original.errno)
  }

  $("#submit-room").on("click", function (event) {
    var newRoom = {
      name: $("#new-room").val().trim(),
      description: $("#room-desc").val().trim()
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
