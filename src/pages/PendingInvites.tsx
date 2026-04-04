import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
} from "@mui/material";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useSendLogoutMutation } from "../app/slices/authApiSlice";
import { logOut } from "../app/slices/authSlice";
import {
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useGetPendingInvitesQuery,
} from "../app/slices/orgApiSlice";
import { selectUser } from "../app/slices/userSlice";
import { useAppDispatch } from "../app/typedReduxHooks";

export const PendingInvites = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const {
    data: invites = [],
    isLoading,
    refetch,
  } = useGetPendingInvitesQuery();
  const [acceptInvite, { isLoading: accepting }] = useAcceptInviteMutation();
  const [declineInvite, { isLoading: declining }] = useDeclineInviteMutation();
  const [sendLogout] = useSendLogoutMutation();

  const handleAccept = async (inviteID: string) => {
    if (accepting) return;
    try {
      await acceptInvite({ inviteID }).unwrap();

      toast.success("Joined organization", {
        position: "top-right",
      });

      navigate("/dash");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to accept invite");
    }
  };

  const handleDecline = async (inviteID: string) => {
    if (declining) return;
    try {
      await declineInvite({ inviteID }).unwrap();

      const result = await refetch();

      const remainingInvites = result.data || [];

      if (!remainingInvites.length) {
        await sendLogout().unwrap();
        dispatch(logOut());
        window.location.href = "/";
      }

      toast.success("Invite declined", {
        position: "top-right",
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to decline invite");
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Loading invites...</Typography>
      </Box>
    );
  }

  if (!invites.length) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>No pending invites</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9fafb",
      }}
    >
      {invites.map((invite) => {
        const inviterName = `${invite.invitedBy.firstname} ${invite.invitedBy.lastname}`;
        const initials =
          `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`.toUpperCase();

        const expiryHours = Math.max(
          0,
          Math.floor(
            (new Date(invite.expiresAt).getTime() - Date.now()) /
              (1000 * 60 * 60),
          ),
        );

        return (
          <Card
            key={invite.inviteID}
            sx={{
              width: 420,
              p: 3,
              borderRadius: 4,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              textAlign: "center",
            }}
          >
            <CardContent>
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  margin: "0 auto",
                  mb: 2,
                  bgcolor: "#1976d2",
                  fontSize: 28,
                  fontWeight: "bold",
                }}
              >
                {initials}
              </Avatar>

              {/* Title */}
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                You're invited
              </Typography>

              {/* Message */}
              <Typography sx={{ mt: 1, color: "text.secondary" }}>
                <b>{inviterName}</b> invited you to join{" "}
                <b>{invite.organization.organizationName}</b> as{" "}
                <b>{invite.role}</b>
              </Typography>

              {/* Expiry */}
              <Typography sx={{ mt: 2, fontSize: 13, color: "text.secondary" }}>
                Expires in {expiryHours} hours
              </Typography>
            </CardContent>

            {/* Actions */}
            <CardActions
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              <Button
                color="inherit"
                onClick={() => handleDecline(invite.inviteID)}
                disabled={declining}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 600,
                  color: "text.primary",
                  backgroundColor: "rgba(15,23,42,0.06)",
                  "&:hover": { backgroundColor: "rgba(15,23,42,0.10)" },
                }}
              >
                Decline
              </Button>

              <Button
                variant="contained"
                onClick={() => handleAccept(invite.inviteID)}
                disabled={accepting}
                sx={{
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 700,
                  color: "#fff",
                  backgroundImage:
                    "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
                  boxShadow: "0 10px 20px rgba(0,116,235,0.25)",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                  "&:hover": {
                    boxShadow: "0 14px 28px rgba(0,116,235,0.32)",
                    backgroundImage:
                      "linear-gradient(90deg,#0074EB 0%,#005BC4 100%)",
                  },
                  "&.Mui-disabled": { opacity: 0.5, color: "#fff" },
                }}
              >
                Accept
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </Box>
  );
};
