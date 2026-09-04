import {Typography} from "@mui/material";
import {useLocation} from "react-router";

export function SetPasswordPage() {
    const location = useLocation()
    const emailFromRegistrationPage = (location.state as { email?: string })?.email ?? ''
    return <Typography>{emailFromRegistrationPage}</Typography>
}