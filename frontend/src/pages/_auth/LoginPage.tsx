
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useSignInAccount } from '@/lib/queries';
import Button from '@/components/Ui/Button';
import { useUserContext } from '@/context/AuthContext';
import TextField from '@/components/Ui/FormikField';
import { Link } from 'react-router-dom';
import { Black, ILoginUserRequest, White } from '@/types';

const loginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must have at least 6 characters').required('Password is required'),
});

const LoginPage = () => {
  const { mutateAsync: signin } = useSignInAccount();
  const { login } = useUserContext();
  return (
    <div>      
      <a href="/">
        <div className="flex flex-row gap-3 mb-8">
          <img src={`assets/figures/${Black.Queen}.svg`} className="h-20 block dark:hidden" alt="CheckMate Logo" />
          <img src={`assets/figures/${White.Queen}.svg`} className="h-20 hidden dark:block" alt="CheckMate Logo" />
          <span className="self-center text-3xl lg:text-4xl font-semibold whitespace-nowrap">CheckMate</span>
        </div>
      </a>
      <h2 className='text-3xl mb-5'>Login</h2>
      <Formik<ILoginUserRequest>
        initialValues={{ email: '', password: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const user = await signin(values);       
          login(user);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className='flex flex-col gap-5'>
            <div className='flex flex-col gap-1'>
              <label htmlFor="email">Email</label>
              <TextField type="email" name="email" />
              <ErrorMessage name="email" component="div" className='text-red' />
            </div>
            <div className='flex flex-col gap-1'>
              <label htmlFor="password">Password</label>
              <TextField type="password" name="password" />
              <ErrorMessage name="password" component="div" className='text-red' />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              Log in
            </Button>
          </Form>
        )}
      </Formik>
      <div className="mt-6 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
