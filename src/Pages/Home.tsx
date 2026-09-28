import { useEffect, useState } from "react";
import { getMe, type CurrentUser } from "../API/User/getMe";
import { useAppSelector } from "../Hooks/hooks";
function Home() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const auth = useAppSelector((state) => state.auth);

  console.log("HOME AUTH:", auth);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();

        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          setError("Failed to fetch user information");
        }
      } catch (error) {
        console.error("Failed to fetch current user:", error);
        setError("Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading user...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>User information not available.</div>;
  }

  return (
    <div>
      <h1>Welcome to The Market</h1>

      <div>
        <h2>User Information</h2>

        <p>
          <strong>Username:</strong> {user.username}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>
    </div>
  );
}

export default Home;
