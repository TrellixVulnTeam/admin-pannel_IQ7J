import React, { useEffect, useState } from "react";
import "./style.scss";
import jwtDecode from "jwt-decode";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { Images } from "../../utils/Images";
import { routes } from "../../routes/Index";
import Requests from "../../utils/Requests/Index";

const Login = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [isLogging, setLogging] = useState(false);

  // Handle redirect
  const handleRedirect = (token) => {
    let redirecPath = null;
    const decode = jwtDecode(token);
    const permissions = decode.permissions;

    // Filter permitted routes from given permissions
    if (routes && routes.length) {
      const isAll = permissions.find((item) => item === "all");

      if (isAll) {
        redirecPath = "/dashboard/";
      } else {
        const permittedRoutes = routes.filter(({ name: routeName }) =>
          permissions.some((x) => x === routeName)
        );
        const redirec = permittedRoutes[0];

        if (redirec.path) {
          redirecPath = redirec.path;
        } else {
          redirecPath = redirec.child[0].path;
        }
      }
    }
    return redirecPath;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const path = handleRedirect(token);
      if (path) return history.push(path);
    }
  }, [history]);

  // Submit Form
  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div className="auth">
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-6 d-none d-lg-block p-0">
            <div className="image-container">
              <div className="overlay">
                <div className="flex-center flex-column">
                  {/* <img src={Images.Logo} className="img-fluid" alt="..." /> */}
                  <h2>New Admin panel</h2>
                  <p></p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 py-3 credential-container">
            <div className="flex-center flex-column">
              <div className="card border-0">
                <div className="text-center text-lg-left">
                  <div className="d-lg-none">
                    <h4>New Admin</h4>
                    {/*  <img src={Images.Logo} className="img-fluid" alt="..." /> */}
                  </div>
                  <h3 className="mb-0 mb-lg-4">Login First</h3>
                  <p className="d-lg-none mb-4"></p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* E-mail */}
                  <div className="form-group mb-4">
                    {errors.email && errors.email.message ? (
                      <p className="text-danger">
                        {errors.email && errors.email.message}
                      </p>
                    ) : (
                      <p>E-mail</p>
                    )}

                    <input
                      type="text"
                      name="email"
                      className="form-control shadow-none"
                      placeholder="Enter e-mail"
                      ref={register({
                        required: "E-mail is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group mb-4">
                    {errors.password && errors.password.message ? (
                      <p className="text-danger">
                        {errors.password && errors.password.message}
                      </p>
                    ) : (
                      <p>Password</p>
                    )}

                    <input
                      type="password"
                      name="password"
                      className="form-control shadow-none"
                      placeholder="Enter password"
                      ref={register({
                        required: "Please enter password",
                        minLength: {
                          value: 8,
                          message: "Minimun length 8 character",
                        },
                      })}
                    />
                  </div>

                  <div className="d-flex">
                    <div>
                      <Link to="/reset">Forgot password ?</Link>
                    </div>
                    <div className="ml-auto">
                      <button
                        type="submit"
                        className="btn shadow-none"
                        disabled={isLogging}
                      >
                        {isLogging ? (
                          <span>Logging in...</span>
                        ) : (
                          <span>Login</span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
