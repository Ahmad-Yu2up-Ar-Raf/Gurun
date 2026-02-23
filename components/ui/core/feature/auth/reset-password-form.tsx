import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/fragments/shadcn-ui/card';
import { Input } from '@/components/ui/fragments/shadcn-ui/input';
import { Label } from '@/components/ui/fragments/shadcn-ui/label';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { useSignIn } from '@clerk/clerk-expo';
import { router } from 'expo-router';
import * as React from 'react';
import { TextInput, View } from 'react-native';
import AuthLayout from '../../layout/auth-layout';

export function ResetPasswordForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [password, setPassword] = React.useState('');
  const [code, setCode] = React.useState('');
  const codeInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState({ code: '', password: '' });

  async function onSubmit() {
    if (!isLoaded) {
      return;
    }
    try {
      const result = await signIn?.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });

      if (result.status === 'complete') {
        // Set the active session to
        // the newly created session (user is now signed in)
        setActive({ session: result.createdSessionId });
        return;
      }
      // TODO: Handle other statuses
    } catch (err) {
      // See https://go.clerk.com/mRUDrIe for more info on error handling
      if (err instanceof Error) {
        const isPasswordMessage = err.message.toLowerCase().includes('password');
        setError({ code: '', password: isPasswordMessage ? err.message : '' });
        return;
      }
      console.error(JSON.stringify(err, null, 2));
    }
  }

  function onPasswordSubmitEditing() {
    codeInputRef.current?.focus();
  }

  return (
    <AuthLayout
      onPress={onSubmit}
      textButton="Reset"
      signInGoogleButton={false}
      title="Reset your password"
      className="mb-4"
      description="Enter your new password to reset it">
      <View className="gap-1.5">
        <View className="flex-row items-center">
          <Label htmlFor="password" className="sr-only">
            New password
          </Label>
        </View>
        <Input
          id="password"
          secureTextEntry
          placeholder="New password"
          onChangeText={setPassword}
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={onPasswordSubmitEditing}
        />
        {error.password ? (
          <Text className="text-sm font-medium text-destructive">{error.password}</Text>
        ) : null}
      </View>
      <View className="gap-1.5">
        <Label htmlFor="code" className="sr-only">
          Verification code
        </Label>
        <Input
          placeholder="Verify Code"
          id="code"
          autoCapitalize="none"
          onChangeText={setCode}
          returnKeyType="send"
          keyboardType="numeric"
          autoComplete="sms-otp"
          textContentType="oneTimeCode"
          onSubmitEditing={onSubmit}
        />
        {error.code ? (
          <Text className="text-sm font-medium text-destructive">{error.code}</Text>
        ) : null}
      </View>
    </AuthLayout>
  );
}
