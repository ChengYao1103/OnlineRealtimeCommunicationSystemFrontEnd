import React from "react";
import { Alert, Row, Col, Form, Button, UncontrolledTooltip } from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";

// router
import { Link, Redirect } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// hooks
import { useProfile } from "../../hooks";

//actions
import { registerUser } from "../../redux/actions";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";
import { ErrorMessages, ErrorMessagesKey } from "../../repository/Enum";

interface RegisterProps {}
const Register = (props: RegisterProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  const { registrationError, regLoading, isUserRegistered } = useAppSelector(
    state => ({
      registrationError: state.Auth.registrationError,
      regLoading: state.Auth.loading,
      isUserRegistered: state.Auth.isUserRegistered,
    })
  );

  const resolver = yupResolver(
    yup.object().shape({
      email: yup
        .string()
        .email(ErrorMessages["email format wrong"])
        .required(ErrorMessages["required"]),
      name: yup.string().required(ErrorMessages["required"]),
      password: yup.string().required(ErrorMessages["required"]),
    })
  );

  const defaultValues: any = {
    email: "a@b.c",
    name: "123",
    password: "123",
  };

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmitForm = (values: object) => {
    dispatch(registerUser(values));
  };

  const { userProfile, loading } = useProfile();

  if (userProfile && !loading) {
    return <Redirect to={{ pathname: "/dashboard" }} />;
  }

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader title="註冊帳號" />

            {isUserRegistered && (
              <Alert color="success">註冊成功！請至登入頁面登入</Alert>
            )}

            {registrationError && (
              <Alert color="danger">
                {ErrorMessages[registrationError as ErrorMessagesKey]}
              </Alert>
            )}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {regLoading && <Loader />}
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
                  label="使用者名稱"
                  type="text"
                  name="name"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter Your Name"
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
                  withoutLabel={true}
                  labelClassName="form-label"
                  className="form-control pe-5"
                  placeholder="Enter Password"
                />
              </div>

              <div className="mb-4">
                {/*<p className="mb-0">
                  By registering you agree to the{" "}
                  <Link to="#" className="text-primary">
                    Terms of Use
                  </Link>
            </p>*/}
              </div>

              <div className="text-center mb-3">
                <Button
                  color="primary"
                  className="w-100 waves-effect waves-light"
                  type="submit"
                >
                  註冊
                </Button>
              </div>
              <div className="mt-4 text-center">
                <div className="signin-other-title">
                  <h5 className="font-size-14 mb-4 title">使用以下方式註冊</h5>
                </div>
                <Row className="">
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="facebook"
                      >
                        <i className="mdi mdi-facebook text-indigo"></i>
                      </button>
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
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="google"
                      >
                        <i className="mdi mdi-google text-danger"></i>
                      </button>
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
                已經有帳號了嗎?{" "}
                <Link
                  to="/auth-login"
                  className="fw-medium text-decoration-underline"
                >
                  登入
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Register;
