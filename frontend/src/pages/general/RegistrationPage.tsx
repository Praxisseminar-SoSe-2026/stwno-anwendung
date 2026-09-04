import {type SubmitEventHandler, useState} from "react";
import {Box, Button, FormControl, Paper, TextField} from "@mui/material";
import {useRegistration} from "../../hooks/useRegistration.ts";
import {useNavigate} from "react-router";

export function RegistrationPage() {
    const submitRegistration = useRegistration()
    const navigate = useNavigate()
    const [personNumber, setPersonNumber] = useState('')

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        const result = await submitRegistration({person_number: personNumber})
        if (result) {
            console.log(`${result.email}`)
            navigate('/set-password', {state: {email: result.email}})
        }
    }
    return(
        <Paper>
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <FormControl>
                    <TextField
                        id="personNumber"
                        name="personNumber"
                        placeholder={"Personen-Nummer"}
                        value={personNumber}
                        onChange={(e) => setPersonNumber(e.target.value)}
                        required
                    />
                </FormControl>
                <Button type="submit">Test</Button>
            </Box>
        </Paper>
    )
}