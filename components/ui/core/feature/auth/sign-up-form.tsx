import { Button } from '@/components/ui/fragments/shadcn-ui/button';

import { Input } from '@/components/ui/fragments/shadcn-ui/input';
import { Label } from '@/components/ui/fragments/shadcn-ui/label';

import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { useSignUp } from '@clerk/clerk-expo';
import { Link, router } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import AuthLayout from '../../layout/auth-layout';

export function SignUpForm() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: email,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      router.push(`/(auth)/sign-up/verify-email?email=${email}`);
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isEmailMessage =
          err.message.toLowerCase().includes('identifier') ||
          err.message.toLowerCase().includes('email');
        setError(isEmailMessage ? { email: err.message } : { password: err.message });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  return (
    <AuthLayout
      onPress={onSubmit}
      textButton="Daftar"
      formType="register"
      title="Buat Akun Baru"
      description="Mari berkenalan dengan kami!">
      <View className="gap-1.5">
        <Label htmlFor="email" className="sr-only">
          Email
        </Label>
        <Input
          id="email"
          placeholder="email"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          onChangeText={setEmail}
          onSubmitEditing={onEmailSubmitEditing}
          returnKeyType="next"
          submitBehavior="submit"
        />
        {error.email ? (
          <Text className="text-sm font-medium text-destructive">{error.email}</Text>
        ) : null}
      </View>
      <View className="gap-1.5">
        <Label htmlFor="password" className="sr-only">
          Password
        </Label>
        <Input
          placeholder="password"
          ref={passwordInputRef}
          id="password"
          secureTextEntry
          onChangeText={setPassword}
          returnKeyType="send"
          onSubmitEditing={onSubmit}
        />

        {error.password ? (
          <Text className="text-sm font-medium text-destructive">{error.password}</Text>
        ) : null}
      </View>
    </AuthLayout>
  );
}
