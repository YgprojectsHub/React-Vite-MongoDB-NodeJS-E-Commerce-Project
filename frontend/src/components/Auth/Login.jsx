import { loginFormSchemas } from "../../yupSchemas/LoginForm";
import { useFormik } from "formik";
import { login } from "../../http-requests/requests";

const Login = () => {

  const submit = (values, action) => login(values, action)

  const { values, errors, handleChange, handleSubmit, isValid, isSubmitting } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginFormSchemas,
    onSubmit: submit
  });
  
  return (
    <div className="account-column">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <span>
              Username or email address <span className="required">*</span>
            </span>
            <input id="email" type="text" value={values.email} placeholder="Kullanıcı adı veya e-mail giriniz." onChange={handleChange} />
          </label>
        {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>
            <span>
              Password <span className="required">*</span>
            </span>
            <input id="password" type="password" value={values.password} placeholder="Şifre giriniz." onChange={handleChange} />
          </label>
        {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <p className="remember">
          <label>
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <button type="submit" disabled={!isValid || isSubmitting} className="btn btn-sm">Login</button>
        </p>
        <a href="#" className="form-link">
          Lost your password?
        </a>
      </form>
    </div>
  );
};

export default Login;
