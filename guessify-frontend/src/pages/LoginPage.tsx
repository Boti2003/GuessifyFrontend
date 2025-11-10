import { useState } from "preact/hooks";
import { BackButton } from "../components/BackButton";
import { ApplicationMode } from "../enums/application_mode.enum";
import { ApplicationPage } from "../enums/application_page.enum";

export function LoginPage() {
   const [signIn, setSignIn] = useState<boolean>(true);
   return (
      <div>
         <BackButton targetPage={ApplicationPage.MAIN_PAGE} />
         {signIn ? (
            <div>
               <h1 className="mb-4">
                  Sign in here! You don't have an account? Go and{" "}
                  <a
                     className="link link-neutral link-hover"
                     onClick={(e) => setSignIn(false)}
                  >
                     register
                  </a>{" "}
                  now.
               </h1>

               <form
                  className="grid grid-col-1 gap-3"
                  onSubmit={(e) => e.preventDefault()}
               >
                  <label className="" for="email-address" className="label">
                     Email Address
                  </label>
                  <input
                     className="input validator"
                     type="email"
                     required
                     placeholder="mail@site.com"
                     id="email-address"
                  />

                  <label className="" for="password" className="label">
                     Password
                  </label>
                  <input
                     type="password"
                     className="input validator"
                     required
                     placeholder="Password"
                     id="password"
                  />

                  <button className="btn" type="submit">
                     Submit form
                  </button>
               </form>
            </div>
         ) : (
            <div>
               <h1>
                  Register or go back to{" "}
                  <a
                     className="link link-neutral link-hover"
                     onClick={(e) => setSignIn(true)}
                  >
                     login
                  </a>
               </h1>

               <form
                  className="grid grid-col-1"
                  onSubmit={(e) => e.preventDefault()}
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
                  />
                  <div className="validator-hint">
                     Enter valid email address
                  </div>

                  <label for="email-address" className="label">
                     Password
                  </label>
                  <input
                     type="password"
                     className="input validator "
                     required
                     placeholder="Password"
                     minlength="8"
                     pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                     title="Must be at least 8 characters, including number, lowercase letter, uppercase letter"
                  />
                  <p className="validator-hint hidden">
                     Must be at least 8 characters, including
                     <br />
                     At least one number
                     <br />
                     At least one lowercase letter
                     <br />
                     At least one uppercase letter
                  </p>

                  <button className="btn" type="submit">
                     Submit form
                  </button>
               </form>
            </div>
         )}
      </div>
   );
}
