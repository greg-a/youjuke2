$(document).ready(function(){
  $("#myModal").modal('show');

  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
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
      .then(function(data) {
        window.location.replace("/members");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    var errType = err.responseJSON.original.errno;
    if (errType === 1062) {
    $("#alert .msg").text("Email already exists. Please log in.");
    $("#alert").fadeIn(500);
    }
    console.log(err.responseJSON.original.errno)
  }

  $("#submit-room").on("click", function(event) {
    var newRoom = {
      name: $("#new-room").val().trim(),
      description: $("#room-desc").val().trim()
    };

    $.ajax("/api/room", {
      type: "POST",
      data: newRoom
    }).then(
      function(res) {
        console.log("created room", newRoom);
        // location.reload(res.redirect);
        window.location.href = res.redirect;
      }
    )
  })
});

