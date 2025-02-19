import { getCurrentUser } from "@/src/lib/session";
import { getUserSubscription } from "@/src/lib/subscription";
import { User } from "next-auth";
import ProfileClient from "./profile-client";

const ProfilePage = async () => {
  const user = (await getCurrentUser()) as User;
  const subscription = (await getUserSubscription(user.id)) as {
    isPro: boolean;
  };

  return <ProfileClient user={user} subscription={subscription} />;
};

export default ProfilePage;
