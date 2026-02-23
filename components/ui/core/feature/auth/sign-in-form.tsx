import { Button } from '@/components/ui/fragments/shadcn-ui/button';
import * as Haptics from 'expo-haptics';
import { Input } from '@/components/ui/fragments/shadcn-ui/input';
import { Label } from '@/components/ui/fragments/shadcn-ui/label';
import { Text } from '@/components/ui/fragments/shadcn-ui/text';
import { Checkbox } from '@/components/ui/fragments/shadcn-ui/checkbox';
import { useSignIn } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import * as React from 'react';
import { Platform, type TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AuthLayout from '../../layout/auth-layout';

export function SignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const passwordInputRef = React.useRef<TextInput>(null);
  const [error, setError] = React.useState<{ email?: string; password?: string }>({});

  async function onSubmit() {
    if (!isLoaded) {
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        setError({ email: '', password: '' });
        await setActive({ session: signInAttempt.createdSessionId });
        return;
      }
      // TODO: Handle other statuses
      console.error(JSON.stringify(signInAttempt, null, 2));
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
  const [state, setState] = React.useState({
    termsChecked: true,
    terms2Checked: true,
    toggleChecked: false,
    toggle2Checked: false,
  });

  function toggleCheckedState(key: keyof typeof state) {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setState((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    };
  }
  const insets = useSafeAreaInsets();
  return (
    <AuthLayout
      onPress={onSubmit}
      title="Selamat Datang!"
      description="Masuk untuk melanjutkan"
      formType="login">
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
      <View className="m-0 mt-2 h-fit w-full flex-row items-center justify-between px-1">
        <View className="flex flex-row items-center gap-3">
          <Checkbox
            id="terms"
            checked={state.termsChecked}
            onCheckedChange={toggleCheckedState('termsChecked')}
          />
          <Label
            onPress={Platform.select({ native: toggleCheckedState('termsChecked') })}
            htmlFor="terms"
            className="text-muted-foreground">
            Ingat Saya
          </Label>
        </View>
        <Link asChild href={`/(auth)/forgot-password?email=${email}`}>
          <Button variant="link" size="sm" className="ml-auto h-fit px-1 py-0 web:h-fit sm:h-4">
            <Text className="text-sm font-normal leading-4">Lupa password?</Text>
          </Button>
        </Link>
      </View>
    </AuthLayout>
  );
}
