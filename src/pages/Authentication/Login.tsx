import React, { useEffect, useState } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Label,
  Button,
  UncontrolledTooltip,
} from "reactstrap";

//Social Media Imports
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

// router
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// config
import config from "../../config";

// hooks
import { useProfile, useRedux } from "../../hooks/index";

//actions
import { loginUser, socialLogin } from "../../redux/actions";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";
import { ErrorMessages, ErrorMessagesKey } from "../../repository/Enum";

interface LocationTypes {
  from?: Location;
}
interface LoginProps {}
const Login = (props: LoginProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const { isUserLogin, error, loginLoading, isUserLogout } = useAppSelector(
    state => ({
      isUserLogin: state.Auth.isUserLogin,
      error: state.Auth.error,
      loginLoading: state.Auth.loading,
      isUserLogout: state.Auth.isUserLogout,
    })
  );

  const history: any = useHistory();
  const location = useLocation<LocationTypes>();
  const [redirectUrl, setRedirectUrl] = useState("/");
  useEffect(() => {
    const url =
      location.state && location.state.from
        ? location.state.from.pathname
        : "/";
    setRedirectUrl(url);
  }, [location]);
  useEffect(() => {
    if (isUserLogin && !loginLoading && !isUserLogout) {
      history.push(redirectUrl);
    }
  }, [isUserLogin, history, loginLoading, isUserLogout, redirectUrl]);

  const resolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(ErrorMessages["required"]),
      password: yup.string().required(ErrorMessages["required"]),
    })
  );

  const defaultValues: any = {
    email: "",
    password: "",
  };

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmitForm = (values: object) => {
    dispatch(loginUser(values));
  };

  const { userProfile, loading } = useProfile();

  if (userProfile && !loading) {
    return <Redirect to={{ pathname: redirectUrl }} />;
  }

  const signIn = (res: any, type: "google" | "facebook") => {
    if (type === "google" && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, type));
    } else if (type === "facebook" && res) {
      const postData = {
        name: res.name,
        token: res.accessToken,
      };
      dispatch(socialLogin(postData, type));
    }
  };

  //handleFacebookLoginResponse
  const facebookResponse = (response: object) => {
    signIn(response, "facebook");
  };

  //handleGoogleLoginResponse
  const googleResponse = (response: object) => {
    signIn(response, "google");
  };

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader title="歡迎使用！" subtitle="登入以繼續" />

            {error && (
              <Alert color="danger">
                {ErrorMessages[error as ErrorMessagesKey]}
              </Alert>
            )}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {loginLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="Email"
                  type="text"
                  name="email"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter Email"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <FormInput
                  label="密碼"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  className="form-control pe-5"
                  placeholder="Enter Password"
                />
              </div>

              <div className="form-check form-check-info font-size-16">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember-check"
                />
                <Label
                  className="form-check-label font-size-14"
                  htmlFor="remember-check"
                >
                  記住我
                </Label>
              </div>

              <div className="text-center mt-4">
                <Button color="primary" className="w-100" type="submit">
                  登入
                </Button>
              </div>

              <div className="mt-4 text-center">
                <div className="signin-other-title">
                  <h5 className="font-size-14 mb-4 title">使用以下方式登入</h5>
                </div>
                <Row className="">
                  <div className="col-4">
                    <div>
                      <FacebookLogin
                        appId={config.FACEBOOK.APP_ID}
                        autoLoad={false}
                        callback={facebookResponse}
                        render={(renderProps: any) => (
                          <button
                            type="button"
                            className="btn btn-light w-100"
                            id="facebook"
                            onClick={renderProps.onClick}
                          >
                            <i className="mdi mdi-facebook text-indigo"></i>
                          </button>
                        )}
                      />
                    </div>
                    <UncontrolledTooltip placement="top" target="facebook">
                      Facebook
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="twitter"
                      >
                        <i className="mdi mdi-twitter text-info"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="twitter">
                      Twitter
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <GoogleLogin
                        clientId={
                          config.GOOGLE.CLIENT_ID ? config.GOOGLE.CLIENT_ID : ""
                        }
                        render={renderProps => (
                          <button
                            type="button"
                            className="btn btn-light w-100"
                            id="google"
                            onClick={renderProps.onClick}
                          >
                            <i className="mdi mdi-google text-danger"></i>
                          </button>
                        )}
                        onSuccess={googleResponse}
                        onFailure={() => {}}
                      />
                    </div>
                    <UncontrolledTooltip placement="top" target="google">
                      Google
                    </UncontrolledTooltip>
                  </div>
                </Row>
              </div>
            </Form>

            <div className="mt-5 text-center text-muted">
              <p>
                沒有帳號嗎?{" "}
                <Link
                  to="/auth-register"
                  className="fw-medium text-decoration-underline"
                >
                  {" "}
                  註冊
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Login;
