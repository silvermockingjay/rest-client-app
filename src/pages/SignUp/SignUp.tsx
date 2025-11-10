import { useState, useEffect } from 'react';
import {
  Navigate,
  Form,
  useActionData,
  useRouteLoaderData,
  redirect,
  type ActionFunctionArgs,
} from 'react-router-dom';
import { Input, Button, Message } from '@/components';
import { ButtonStyle, ButtonType } from '@/components/Button/types';
import type { AuthErrors } from '@/utils/schema';
import { getSupabaseAuthError } from '@/utils/errorMaps/authErrors';
import { validateInput, type InputName } from '@/utils/validateInput';
import { createClient } from '@/services/supabase/supabaseServer';
import type { User } from '@supabase/supabase-js';
import { useTranslation } from 'react-i18next';

import eyeHide from '@/assets/img/eyeHide.svg';
import eyeShow from '@/assets/img/eyeShow.svg';

import './SignUpStyles.scss';

export async function action({ request }: ActionFunctionArgs) {
  const { supabase, headers } = createClient(request);

  const formData = await request.formData();

  const email = formData.get('email') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: name } },
  });

  if (error) {
    return {
      error: error.code,
    };
  }

  return redirect('/', { headers });
}

interface SignUpData {
  email: string;
  name: string;
  password: string;
}

export default function SignUp() {
  const { t } = useTranslation('authorization');
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    name: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({
    name: [{ id: 0, message: '' }],
    email: [{ id: 0, message: '' }],
    password: [{ id: 0, message: '' }],
    isError: false,
  });
  const user = useRouteLoaderData<User>('root');
  const actionData = useActionData() as { error?: string };
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as InputName;
    setFormData((prev) => ({ ...prev, [key]: value }));
    validateInput({ key, value, setErrors });
  };

  useEffect(() => {
    if (actionData?.error) {
      setIsLoading(false);
    }
  }, [actionData]);

  if (user) return <Navigate to="/" replace />;

  return (
    <div className="signup-page">
      <h2>{t('signUpTitle')}</h2>
      <Form className="signup-page__form" method="post" onSubmit={() => setIsLoading(true)}>
        <Input
          type="text"
          id="email"
          labelText={t('email')}
          name="email"
          value={formData.email}
          onChange={handleChange}
          errors={errors.email}
        />
        <Input
          type="text"
          id="name"
          labelText={t('name')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          errors={errors.name}
        />
        <Input
          type={showPassword ? 'text' : 'password'}
          id="password"
          labelText={t('password')}
          name="password"
          value={formData.password}
          rightIcon={
            <div className="toggler" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? (
                <img src={eyeHide} alt="eye hide" />
              ) : (
                <img src={eyeShow} alt="eye show" />
              )}
            </div>
          }
          onChange={handleChange}
          errors={errors.password}
        />

        <Button
          style={ButtonStyle.Primary}
          type={ButtonType.Submit}
          customClass="signup-page__form-button"
          isDisabled={errors.isError || isLoading}
        >
          {isLoading ? '...' : t('signUp')}
        </Button>
        {actionData && (
          <Message messageType="warning" text={getSupabaseAuthError(actionData.error)}></Message>
        )}
      </Form>
    </div>
  );
}
