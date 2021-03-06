import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Joi from "joi-browser";
import passwordSchema from "../validation/password.validation";
import ErrorPopupComponent from "../components/ErrorPopupComponent";
import "../style/resetPassword.css";

const ResetPasswordPage = (props) => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [resetPWErr, setResetPWErr] = useState("");
  const [trigger, setTrigger] = useState(false);
  const params = useParams();

  useEffect(() => {}, []);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    const validatedValue = Joi.validate(
      {
        password,
        repeatPassword,
      },
      passwordSchema,
      { abortEarly: false }
    );

    const { error } = validatedValue;
    if (error) {
      setResetPWErr(
        "Passwords do not match or are not up to website standards"
      );
      setTrigger(true);
    } else {
      const link = `/users/passwordrecovery/${params.usermail}/${params.token}`;
      axios
        .post(link, { password })
        .then((res) => {
          setResetPWErr("Password changed successfully, Login page will now open.");
        })
        .catch((err) => {
          console.log("error : ", err);
          setResetPWErr("Server error, please try again.");
          setTrigger(true);
        });
    }
  };

  console.log(params);

  return (
    <div className="password-reset-page">
      <div className="password-reset-box">
        <div className="password-reset-header">
          <h3>Reset Password</h3>
        </div>

        <form onSubmit={handleOnSubmit} className="password-reset-form">
          <div className="password-reset-item">
            <label htmlFor="password" className="">
              Enter new password :
            </label>
            <input
              type="password"
              className=""
              id="password"
              placeholder="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
          </div>
          <div className="password-reset-item">
            <label htmlFor="repeatPassword" className="">
              Confirm password :
            </label>
            <input
              type="password"
              className=""
              id="repeatPassword"
              placeholder="confirm password"
              value={repeatPassword}
              onChange={(event) => {
                setRepeatPassword(event.target.value);
              }}
            />
          </div>
          <div className="password-reset-btn-container">
            <button type="submit" className="password-reset-btn">
              Set Password
            </button>
          </div>
        </form>
      </div>
      <ErrorPopupComponent trigger={trigger} setTrigger={setTrigger}>
        {resetPWErr}
      </ErrorPopupComponent>
    </div>
  );
};

export default ResetPasswordPage;
