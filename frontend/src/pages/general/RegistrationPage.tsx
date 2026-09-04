import {type SubmitEventHandler, useState} from "react";
import {Box, Button, FormControl, Paper, TextField} from "@mui/material";
import {useRegistration} from "../../hooks/useRegistration.ts";

export function RegistrationPage() {
    const submitRegistration = useRegistration()
    const [personNumber, setPersonNumber] = useState('')

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        const result = await submitRegistration({person_number: personNumber})
        if (result) {
            console.log(`${result.email}`)
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