import { getAuthSession } from "@/lib/auth";
import { LoggedInButton } from "./LoggedInButton";
import { LoginButton } from "./LoginButton";
export type AuthButtonProps = {};

export const AuthButton = async (props: AuthButtonProps) => {
  const session = await getAuthSession();
  console.log(1, "session", session);
  const user = session?.user;

  if (!user) {
    return <LoginButton />;
  }

  return <LoggedInButton user={user} />;
};
