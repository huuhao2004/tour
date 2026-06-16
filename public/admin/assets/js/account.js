// Login form
const loginForm = document.querySelector("#login-form");
if (loginForm) {
  const validator = new JustValidate("#login-form");
  validator
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      const password = event.target.password.value;
      const rememberPassword = event.target.rememberPassword.checked;
      
      const dataFinal = {
        email,
        password
      }
      const fetchApi = async () => {
        const response = await fetch("/admin/account/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataFinal)
        });
        const result = await response.json(); // chuyen data tu json sang js
        if (result.code == "error") {
          alert(result.message);
        }
        else if (result.code == "success") {
          window.location.href = "/admin/dashboard"
        }
      }
      fetchApi();
    });
}
// End login form

// Register form
const registerForm = document.querySelector("#register-form");
if (registerForm) {
  const validator = new JustValidate("#register-form");
  validator
    .addField("#fullName", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập họ và tên của bạn!",
      },
      {
        rule: "minLength",
        value: 5,
        errorMessage: "Họ tên phải có ít nhất 5 kí tự!",
      },
      {
        rule: "maxLength",
        value: 50,
        errorMessage: "Họ tên phải có tối đâ 50 kí tự!",
      },
    ])
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 kí tự",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in hoa",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in thường",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ số",
      },
      {
        validator: (value) => /[@$?!%*]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 kí tự đặc biệt",
      },
    ])
    .addField("#agree", [
      {
        rule: "required",
        errorMessage: "Bạn phải đồng ý với các điều khoản và điều kiện!",
      },
    ])
    .onSuccess((event) => {
      const fullName = event.target.fullName.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      const agree = event.target.agree.checked;

      if (agree) {
        const dataFinal = {
          fullName,
          email,
          password,
        };
        const fetchApi = async () => {
          const response = await fetch(`/${pathAdmin}/account/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataFinal),
          });
          const result = await response.json();
          if (result.code == "error") {
            alert(result.message);
          } else {
            window.location.href = `/${pathAdmin}/account/register-initial`;
          }
        };
        fetchApi();
      }
    });
}
// End register form

// Forgot Password Form
const forgotPasswordForm = document.querySelector("#forgot-password-form");
if (forgotPasswordForm) {
  const validation = new JustValidate("#forgot-password-form");

  validation
    .addField("#email", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập email của bạn!",
      },
      {
        rule: "email",
        errorMessage: "Email không đúng định dạng!",
      },
    ])
    .onSuccess((event) => {
      const email = event.target.email.value;
      console.log(email);
    });
}
// End Forgot Password Form

// Otp Password Form
const otpPasswordForm = document.querySelector("#otp-password-form");
if (otpPasswordForm) {
  const validation = new JustValidate("#otp-password-form");

  validation
    .addField("#otp", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mã otp của bạn!",
      },
    ])
    .onSuccess((event) => {
      const otp = event.target.otp.value;
    });
}
// End otp Password Form

// Reset password form
const resetPasswordForm = document.querySelector("#reset-password-form");
if (resetPasswordForm) {
  const validation = new JustValidate("#reset-password-form");

  validation
    .addField("#password", [
      {
        rule: "required",
        errorMessage: "Vui lòng nhập mật khẩu!",
      },
      {
        validator: (value) => value.length >= 8,
        errorMessage: "Mật khẩu phải chứa ít nhất 8 kí tự",
      },
      {
        validator: (value) => /[A-Z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in hoa",
      },
      {
        validator: (value) => /[a-z]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ cái in thường",
      },
      {
        validator: (value) => /\d/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 chữ số",
      },
      {
        validator: (value) => /[@$?!%*]/.test(value),
        errorMessage: "Mật khẩu phải chứa ít 1 kí tự đặc biệt",
      },
    ])
    .addField("#confirm-password", [
      {
        rule: "required",
        errorMessage: "Vui lòng xác nhận mật khẩu!",
      },
      {
        validator: (value, fields) => {
          const password = fields["#password"].elem.value;
          return value === password;
        },
        errorMessage: "Mật khẩu xác nhận không khớp!",
      },
    ])
    .onSuccess((event) => {
      const password = event.target.password.value;
      console.log(password);
    });
}
// End reset password form
