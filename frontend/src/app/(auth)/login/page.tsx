import LoginPageClient from "@/components/auth/LoginPageClient";
import { isGoogleOAuthConfigured } from "@/lib/auth-env";

export default function LoginPage() {
  return (
    <LoginPageClient googleOAuthEnabled={isGoogleOAuthConfigured()} />
  );
}
