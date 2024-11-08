import { useFormik } from "formik";
import { registerFormSchemas } from "../../yupSchemas/RegisterForm";
import { register } from "../../http-requests/requests";

const Register = () => {

  const submit = (values, action) => register(values, action)

  const { values, errors, handleChange, handleSubmit, isValid, isSubmitting } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: registerFormSchemas,
    onSubmit: submit
  });

  return (
    <div className="account-column">
    <h2>Register</h2>
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <span>
            Username <span className="required">*</span>
          </span>
          <input id="username" placeholder="kullanıcı adı giriniz." value={values.username} type="text" onChange={handleChange} />
        </label>
        {errors.username && <p className="error">{errors.username}</p>}
      </div>
      <div>
        <label>
          <span>
            Email address <span className="required">*</span>
          </span>
          <input id="email" placeholder="email giriniz." value={values.email} type="email" onChange={handleChange} />
        </label>
        {errors.email && <p className="error">{errors.email}</p>}
      </div>
      <div>
        <label>
          <span>
            Password <span className="required">*</span>
          </span>
          <input id="password" placeholder="şifre giriniz." value={values._password} type="password" onChange={handleChange} />
          {errors.password && <p className="error">{errors.password}</p>}
        </label>
      </div>
      <div className="privacy-policy-text remember">
        <p>
          Your personal data will be used to support your experience
          throughout this website, to manage access to your account,
          and for other purposes described in our{" "}
          <a href="#">privacy policy.</a>
        </p>
        <button type="submit" disabled={!isValid || isSubmitting} className="btn btn-sm">Register</button>
      </div>
    </form>
  </div>
  )
}

export default Register