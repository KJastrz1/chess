import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCreateUserAccount } from '@/lib/queries';
import Button from '@/components/Ui/Button';
import { useUserContext } from '@/context/AuthContext';
import TextField from '@/components/Ui/FormikField';
import { Link } from 'react-router-dom';


const loginValidationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must have at least 6 characters').required('Password is required'),
    passwordConfirm: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

const RegisterPage = () => {
    const { mutateAsync: register } = useCreateUserAccount();
    const { login } = useUserContext();

    return (
        <div>
            <h2 className='text-3xl mb-5'>Register</h2>
            <Formik
                initialValues={{ username: '', email: '', password: '', passwordConfirm: '' }}
                validationSchema={loginValidationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    setSubmitting(true);
                    const user = await register(values);
                    login(user);
                    setSubmitting(false);
                }}
            >
                {({ isSubmitting }) => (
                    <Form className='flex flex-col gap-5'>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="username">Username</label>
                            <TextField type="text" name="username" />
                            <ErrorMessage name="username" component="div" className='text-red' />
                        </div>
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
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="passwordConfirm">Confirm Password</label>
                            <TextField type="password" name="passwordConfirm" />
                            <ErrorMessage name="passwordConfirm" component="div" className='text-red' />
                        </div>
                        <Button type="submit" disabled={isSubmitting}>
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
            <div className="mt-6 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Log in
                </Link>
            </div>
        </div>
    );
}

export default RegisterPage;
