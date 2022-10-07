import React from "react";
import { Alert, Row, Col, Form } from "reactstrap";

// hooks
import { useProfile, useRedux } from "../../hooks/index";

// router
import { useHistory } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

//actions
import {
  userChangePassword,
  clearChangePasswordState,
} from "../../redux/actions";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";

//images
import avatarPlaceHolder from "../../assets/images/users/profile-placeholder.png";
import { ErrorMessages } from "../../repository/Enum";

interface ChangePasswordProps {}

interface ChangePasswordFormProps {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = (prop: ChangePasswordProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();
  const { userProfile } = useProfile();

  const { changepasswordError, passwordChanged, changePassLoading } =
    useAppSelector(state => ({
      passwordChanged: state.Auth.passwordChanged,
      changepasswordError: state.Auth.changepasswordError,
      changePassLoading: state.Auth.loading,
    }));

  const resolver = yupResolver(
    yup.object().shape({
      oldPassword: yup.string().required(ErrorMessages["required"]),
      newPassword: yup.string().required(ErrorMessages["required"]),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "與新密碼不相符")
        .required(ErrorMessages["required"]),
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

  let history = useHistory();

  const goBack = () => {
    dispatch(clearChangePasswordState());
    history.goBack();
  };

  if (passwordChanged) {
    setTimeout(() => goBack(), 1000);
  }

  // const { userProfile, loading } = useProfile();

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader title="變更密碼" />
            <div className="user-thumb text-center mb-4">
              <img
                src={userProfile.photo ? userProfile.photo : avatarPlaceHolder}
                className="rounded-circle img-thumbnail avatar-lg"
                alt="thumbnail"
              />
              <h5 className="font-size-15 mt-3">{userProfile.name}</h5>
            </div>
            {changepasswordError && !passwordChanged && (
              <Alert color="danger">舊密碼錯誤</Alert>
            )}
            {passwordChanged && <Alert color="success">密碼變更成功</Alert>}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {changePassLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="舊密碼"
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
                  label="新密碼"
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
                  label="確認新密碼"
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
                      變更密碼
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn btn-light w-100"
                      type="reset"
                      onClick={() => {
                        goBack();
                      }}
                    >
                      返回
                    </button>
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
