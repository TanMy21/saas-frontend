import { Button, Typography } from "@mui/material";
import DashBoardHeader from "../components/DashBoardHeader";
import { useGetMeQuery } from "../app/slices/userApiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { data: profile, isLoading, isError, error } = useGetMeQuery();

  useEffect(() => {
    if (isError) {
      if (Array.isArray((error as any).data.error)) {
        (error as any).data.error.forEach((el: any) =>
          toast.error(el.message, {
            position: "top-right",
          })
        );
      } else {
        toast.error((error as any).data.message, {
          position: "top-right",
        });
      }
    }
  }, [isError]);

  if (isLoading) return <p>Logging Out...</p>;

  if (isError) return <p>Error: </p>;
  console.log(profile);
  const { firstname, lastname, email, organization, verified, isAdmin } =
    profile;
  return (
    <>
      <DashBoardHeader />
      <Typography variant="h1" component="h2">
        Profile Page
      </Typography>
      <Typography variant="h5" component="h2">
        {firstname} {lastname}
      </Typography>
      <Typography variant="h5" component="h2">
        {email}
      </Typography>
      <Typography variant="h5" component="h2">
        {organization}
      </Typography>
      <Typography variant="h5" component="h2">
        {verified ? "Verified" : "Not Verified "}
      </Typography>
      <Typography variant="h5" component="h2">
        {isAdmin ? "Admin" : "Not Admin "}
      </Typography>
      <Link to="/dash" style={{ textDecoration: "none", color: "white" }}>
        <Button
          style={{ backgroundColor: "#0068FF" }}
          variant="contained"
          size="large"
        >
          Back
        </Button>
      </Link>
    </>
  );
};

export default Profile;
