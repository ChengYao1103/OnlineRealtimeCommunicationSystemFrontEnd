import React, { useState } from "react";
import { Alert, Row, Col, Form } from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";

// router
import { Link } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// // hooks
// import { useProfile } from "../../hooks";

//actions
import { userChangePassword } from "../../redux/actions";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";

//images
import avatar1 from "../../assets/images/users/avatar-1.jpg";

//user information
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { AuthLoginState } from "../../redux/auth/login/types";
import { userModel } from "../../redux/profile/types";

interface ChangePasswordProps {}

interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = (prop: ChangePasswordProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux(); //set user information
  const [isLoad, setIsLoad] = useState(false);
  const LoginState: AuthLoginState = useSelector(
    (state: RootState) => state.Login
  );
  const [user, setUser] = useState({} as userModel);

  if (!isLoad && LoginState.response) {
    setIsLoad(true);
    setUser(LoginState.response.user);
  }

  const { changepasswordError, passwordChanged, changePassLoading } =
    useAppSelector(state => ({
      passwordChanged: state.ForgetPassword.passwordChanged,
      changepasswordError: state.ForgetPassword.changepasswordError,
      changePassLoading: state.ForgetPassword.loading,
    }));

  const resolver = yupResolver(
    yup.object().shape({
      oldPassword: yup.string().required("Please Enter Old Password."),
      newPassword: yup.string().required("Please Enter New Password."),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords don't match")
        .required("This value is required."),
    })
  );

  const defaultValues: any = {};

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmitForm = (values: ChangePasswordFormProps) => {
    dispatch(userChangePassword(values));
  };

  // const { userProfile, loading } = useProfile();

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader title="Change Password" />
            <div className="user-thumb text-center mb-4">
              <img
                src={avatar1}
                className="rounded-circle img-thumbnail avatar-lg"
                alt="thumbnail"
              />
              <h5 className="font-size-15 mt-3">{user.name}</h5>
            </div>
            {changepasswordError && changepasswordError ? (
              <Alert color="danger">{changepasswordError}</Alert>
            ) : null}
            {passwordChanged ? (
              <Alert color="success">Your Password is changed</Alert>
            ) : null}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {changePassLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="Old Password"
                  type="password"
                  name="oldPassword"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter Old Password"
                  className="form-control"
                  withoutLabel={true}
                  hidePasswordButton={true}
                />
              </div>
              <div className="mb-3">
                <FormInput
                  label="New Password"
                  type="password"
                  name="newPassword"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter New Password"
                  className="form-control"
                  withoutLabel={true}
                  hidePasswordButton={false}
                />
              </div>
              <div className="mb-3">
                <FormInput
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter New Password Again"
                  className="form-control"
                  withoutLabel={true}
                  hidePasswordButton={true}
                />
              </div>

              <div className="text-center mt-4">
                <div className="row">
                  <div className="col-6">
                    <button className="btn btn-primary w-100" type="submit">
                      Save
                    </button>
                  </div>
                  <div className="col-6">
                    <Link to="/dashboard" className="text-dark">
                      <button className="btn btn-light w-100" type="reset">
                        Cancel
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default ChangePassword;
