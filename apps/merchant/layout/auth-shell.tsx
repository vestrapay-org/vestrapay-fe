import { AuthPageLayout, type AuthPageLayoutProps } from "./auth-page-layout";

export { AuthPageLayout, type AuthPageLayoutProps } from "./auth-page-layout";

/** @deprecated Prefer importing `AuthPageLayout` from `./auth-page-layout`. */
export function AuthShell(props: AuthPageLayoutProps) {
  return <AuthPageLayout {...props} />;
}
