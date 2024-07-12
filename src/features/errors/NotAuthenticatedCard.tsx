import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginButton } from "../auth/LoginButton";

export const NotAuthenticatedCard = () => {
  return (
    <Card className="m-auto mt-4 max-w-lg">
      <CardHeader>
        <CardTitle>You need to be logged in to view this page</CardTitle>
      </CardHeader>
      <CardFooter>
        <LoginButton />
      </CardFooter>
    </Card>
  );
};
