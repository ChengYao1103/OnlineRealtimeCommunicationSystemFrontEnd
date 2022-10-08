// @flow
import React, { useState, InputHTMLAttributes } from "react";
import { Input, Label, FormFeedback } from "reactstrap";
import classNames from "classnames";

import { FieldErrors } from "react-hook-form";
import { Link } from "react-router-dom";

interface PasswordInputProps {
  name: string;
  placeholder?: string;
  refCallback?: any;
  errors: any;
  register?: any;
  className?: string;
  withoutLabel?: boolean;
  hidePasswordButton?: boolean;
}

/* Password Input */
const PasswordInput: React.FunctionComponent<PasswordInputProps> = ({
  name,
  placeholder,
  refCallback,
  errors,
  register,
  className,
  hidePasswordButton,
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <>
      <div className="position-relative auth-pass-inputgroup mb-3">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          id={name}
          ref={(r: HTMLInputElement) => {
            if (refCallback) refCallback(r);
          }}
          className={classNames(className, {
            "is-invalid": errors && errors[name],
          })}
          {...(register ? register(name) : {})}
          autoComplete={name}
        />
        {errors && errors[name] ? (
          <FormFeedback type="invalid"> {errors[name]["message"]}</FormFeedback>
        ) : null}
        {!hidePasswordButton && (
          <button
            className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
            type="button"
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            data-password={showPassword ? "true" : "false"}
          >
            <i className="ri-eye-fill align-middle me-3"></i>
          </button>
        )}
      </div>
    </>
  );
};

interface SelectInputProps {
  name: string;
  placeholder?: string;
  refCallback?: any;
  errors: any;
  register?: any;
  className?: string;
  withoutLabel?: boolean;
  options?: any[];
  defaultValue?: any;
}

/* Select Input */
const SelectInput: React.FunctionComponent<SelectInputProps> = ({
  name,
  refCallback,
  errors,
  register,
  className,
  options,
  defaultValue,
}) => {
  return (
    <>
      <div className="position-relative auth-pass-inputgroup mb-3">
        <select
          name={name}
          id={name}
          ref={(r: HTMLInputElement) => {
            if (refCallback) refCallback(r);
          }}
          className={classNames(className, {
            "is-invalid": errors && errors[name],
          })}
          {...(register ? register(name) : {})}
          autoComplete={name}
          defaultValue={defaultValue}
        >
          {options?.map(option => (
            <option value={option.value}>{option.label}</option>
          ))}
        </select>
        {errors && errors[name] ? (
          <FormFeedback type="invalid"> {errors[name]["message"]}</FormFeedback>
        ) : null}
      </div>
    </>
  );
};

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  name: string;
  placeholder?: string;
  register?: any;
  errors?: FieldErrors;
  className?: string;
  labelClassName?: string;
  containerClass?: string;
  refCallback?: any;
  children?: any;
  control?: any;
  withoutLabel?: boolean;
  hidePasswordButton?: boolean;
  options?: any[];
  dafaultValue?: any;
}

const FormInput: React.FunctionComponent<FormInputProps> = ({
  label,
  type,
  name,
  placeholder,
  register,
  errors,
  className,
  labelClassName,
  containerClass,
  refCallback,
  children,
  control,
  withoutLabel,
  hidePasswordButton,
  options,
  defaultValue,
  ...otherProps
}) => {
  return (
    <>
      {type === "hidden" ? (
        <input
          type={type}
          name={name}
          {...(register ? register(name) : {})}
          {...otherProps}
        />
      ) : (
        <>
          {type === "password" ? (
            <>
              {label ? (
                <>
                  {!withoutLabel && (
                    <div className="float-end">
                      <Link to="/auth-recoverpw" className="text-muted">
                        忘記密碼?
                      </Link>
                    </div>
                  )}

                  <Label htmlFor={name} className={labelClassName}>
                    {label}
                  </Label>
                </>
              ) : null}
              <PasswordInput
                name={name}
                placeholder={placeholder}
                refCallback={refCallback}
                errors={errors}
                register={register}
                className={className}
                withoutLabel={withoutLabel}
                hidePasswordButton={hidePasswordButton}
              />
            </>
          ) : (
            <>
              {type === "checkbox" || type === "radio" ? (
                <>
                  <div className="form-check form-check-info font-size-16">
                    <Input
                      className={className}
                      type={type}
                      name={name}
                      id={name}
                      ref={(r: HTMLInputElement) => {
                        if (refCallback) refCallback(r);
                      }}
                      invalid={errors && errors[name] ? true : undefined}
                      {...(register ? register(name) : {})}
                      {...otherProps}
                    />
                    <Label
                      className="form-check-label font-size-14"
                      for="remember-check"
                    >
                      Remember me
                    </Label>
                  </div>
                  {errors && errors[name] ? (
                    <FormFeedback type="invalid">
                      {errors[name]["message"]}
                    </FormFeedback>
                  ) : null}
                </>
              ) : (
                <>
                  {type === "select" ? (
                    <>
                      {label ? (
                        <Label htmlFor={name} className={labelClassName}>
                          {label}
                        </Label>
                      ) : null}
                      <SelectInput
                        name={name}
                        refCallback={refCallback}
                        errors={errors}
                        register={register}
                        className={className}
                        options={options}
                        defaultValue={defaultValue}
                      />
                      {errors && errors[name] ? (
                        <FormFeedback type="invalid">
                          {errors[name]["message"]}
                        </FormFeedback>
                      ) : null}
                    </>
                  ) : (
                    <>
                      {label ? (
                        <Label htmlFor={name} className={labelClassName}>
                          {label}
                        </Label>
                      ) : null}
                      <input
                        type={type}
                        placeholder={placeholder}
                        name={name}
                        id={name}
                        ref={(r: HTMLInputElement) => {
                          if (refCallback) refCallback(r);
                        }}
                        className={classNames(className, {
                          "is-invalid": errors && errors[name],
                        })}
                        {...(register ? register(name) : {})}
                        {...otherProps}
                        autoComplete={name}
                        tag="input"
                      />
                      {errors && errors[name] ? (
                        <FormFeedback type="invalid">
                          {errors[name]["message"]}
                        </FormFeedback>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default FormInput;
