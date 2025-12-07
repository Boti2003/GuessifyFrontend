import { useState } from "preact/hooks";

import { ApplicationPage } from "../enums/application_page.enum";
import { RegisterStatus } from "../enums/register_status.enum";
import { authService } from "../services/AuthService";

import { LoginStatus } from "../enums/login_status.enum";
import { applicationStateService } from "../services/ApplicationStateService";

export function LoginPage() {
   const [signIn, setSignIn] = useState<boolean>(true);
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [confirmPassword, setConfirmPassword] = useState<string>("");
   const [username, setUsername] = useState<string>("");

   const [authError, setAuthError] = useState<LoginStatus | RegisterStatus>(
      null
   );
   const [passwordMismatch, setPasswordMismatch] = useState<boolean>(false);

   const handleLogin = (e: any) => {
      e.preventDefault();
      authService.login(email, password).then((status: LoginStatus) => {
         if (status === LoginStatus.SUCCESSFUL) {
            applicationStateService.setApplicationPage(
               ApplicationPage.MAIN_PAGE
            );
            setAuthError(null);
         } else if (status === LoginStatus.AUTHENTICATION_FAILED) {
            setAuthError(status);
         }
      });
   };

   const handleRegister = (e: any) => {
      e.preventDefault();
      if (password !== confirmPassword) {
         setPasswordMismatch(true);
         return;
      } else {
         setPasswordMismatch(false);
         authService.registerUser(email, username, password).then((status) => {
            if (status === RegisterStatus.SUCCESSFUL) {
               applicationStateService.setApplicationPage(
                  ApplicationPage.MAIN_PAGE
               );
               setAuthError(null);
            } else if (status === RegisterStatus.WRONG_CREDENTIALS) {
               setAuthError(status);
            }
         });
      }
   };

   const handleLoginRegisterChange = (toSignIn: boolean) => {
      resetStates();
      setSignIn(toSignIn);
   };

   const resetStates = () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setAuthError(null);
      setPasswordMismatch(false);
   };

   return (
      <div className="bg-base-200 p-8 rounded-xl mt-25 mb-10">
         {signIn ? (
            <div>
               <h1 className="mb-4">
                  Sign in here! You don't have an account? Go and{" "}
                  <a
                     className="link link-neutral link-hover"
                     onClick={(e) => handleLoginRegisterChange(false)}
                  >
                     register
                  </a>{" "}
                  now.
               </h1>

               <form
                  className="grid grid-col-1 gap-3"
                  onSubmit={(e) => handleLogin(e)}
               >
                  <label className="label" for="email-address">
                     Email Address
                  </label>
                  <input
                     className="input validator"
                     type="email"
                     required
                     placeholder="mail@site.com"
                     id="email-address"
                     value={email}
                     onInput={(e) => setEmail(e.currentTarget.value)}
                  />

                  <label className="label" for="password">
                     Password
                  </label>
                  <input
                     type="password"
                     className="input validator"
                     required
                     placeholder="Password"
                     id="password"
                     value={password}
                     onInput={(e) => setPassword(e.currentTarget.value)}
                  />
                  {authError === LoginStatus.AUTHENTICATION_FAILED && (
                     <p className="text-error">
                        E-mail or password incorrect. Please try again.
                     </p>
                  )}

                  <button className="btn" type="submit">
                     {signIn ? "Login" : "Register"}
                  </button>
               </form>
            </div>
         ) : (
            <div>
               <h1 className="mb-4">
                  Register or go back to{" "}
                  <a
                     className="link link-neutral link-hover"
                     onClick={(e) => handleLoginRegisterChange(true)}
                  >
                     login
                  </a>
                  !
               </h1>

               <form
                  className="grid grid-col-1 gap-3"
                  onSubmit={(e) => handleRegister(e)}
               >
                  <label for="email-address" className="label">
                     Email Address
                  </label>
                  <input
                     className="input validator"
                     type="email"
                     required
                     placeholder="mail@site.com"
                     id="email-address"
                     value={email}
                     onInput={(e) => setEmail(e.currentTarget.value)}
                  />
                  <div className="validator-hint hidden">
                     Enter valid email address
                  </div>

                  <label for="username" className="label">
                     Username
                  </label>
                  <input
                     className="input validator"
                     type="text"
                     required
                     placeholder="Your username"
                     id="username"
                     value={username}
                     onInput={(e) => setUsername(e.currentTarget.value)}
                  />

                  <label for="password" className="label">
                     Password
                  </label>
                  <input
                     type="password"
                     className="input validator "
                     required
                     placeholder="Password"
                     minlength="8"
                     id="password"
                     pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$"
                     title="Must be at least 8 characters, including number, lowercase letter, uppercase letter"
                     value={password}
                     onInput={(e) => setPassword(e.currentTarget.value)}
                  />
                  <p className="validator-hint hidden">
                     Must be at least 8 characters, including
                     <br />
                     At least one number
                     <br />
                     At least one lowercase letter
                     <br />
                     At least one uppercase letter
                     <br />
                     At least one special character
                  </p>

                  <label for="confirm-password" className="label">
                     Confirm Password
                  </label>
                  <input
                     type="password"
                     className="input validator "
                     required
                     placeholder="Password"
                     minlength="8"
                     id="confirm-password"
                     pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$"
                     title="Must be at least 8 characters, including number, lowercase letter, uppercase letter, special character"
                     value={confirmPassword}
                     onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                  />

                  {authError === RegisterStatus.WRONG_CREDENTIALS && (
                     <p className="text-error">
                        Registration failed, please check your data and try
                        again.
                     </p>
                  )}

                  {passwordMismatch && (
                     <p className="text-error">Passwords do not match!</p>
                  )}

                  <button className="btn" type="submit">
                     {signIn ? "Login" : "Register"}
                  </button>
               </form>
            </div>
         )}
      </div>
   );
}
