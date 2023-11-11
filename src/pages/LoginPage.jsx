import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  let { loginUser } = useContext(AuthContext);

  return (
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <div className="card mb-3">
                <div className="card-body">
                  <div className="pb-2 text-center no-select">
                    <img
                      src="assets/logo.png"
                      alt="Profile"
                      className="rounded-circle"
                    />
                    <h5 className="card-title text-center pb-0 fs-4">
                      Complaint System
                    </h5>
                    <p className="text-center small">
                      Enter your email & password to Login
                    </p>
                  </div>

                  <form
                    className="row g-3 needs-validation px-3 pb-3 no-select"
                    noValidate
                    onSubmit={loginUser}
                  >
                    <div className="col-12">
                      <label htmlFor="Email" className="form-label ps-2">
                        Email
                      </label>
                      <div className="input-group has-validation">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          required
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label htmlFor="yourPassword" className="form-label ps-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <button className="btn btn-primary w-100" type="submit">
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
