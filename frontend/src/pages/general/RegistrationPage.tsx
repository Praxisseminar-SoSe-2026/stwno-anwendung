import {type SubmitEventHandler, useState} from "react";
import {Box, Button, FormControl, Paper, TextField, Typography} from "@mui/material";
import {useRegistration} from "../../hooks/useRegistration.ts";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";

export function RegistrationPage() {
    const {submitRegistration, error} = useRegistration()
    const navigate = useNavigate()
    const [personNumber, setPersonNumber] = useState('')
    const { t } = useTranslation()

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
        event.preventDefault()
        const result = await submitRegistration({person_number: personNumber})
        if (result) {
            console.log(`${result.email}`)
            navigate('/set-password', {state: {email: result.email}})
        }
    }
    return(
        <Paper
        variant="outlined"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '30%',
        p: 4,
        gap: 2,
      }}>
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                <FormControl>
                    <TextField
                        id="personNumber"
                        name="personNumber"
                        placeholder={t('registration.person_number')}
                        value={personNumber}
                        onChange={(e) => setPersonNumber(e.target.value)}
                        required
                    />
                </FormControl>
                <Button type="submit">{t('registration.next_button')}</Button>
                {error && <Typography color="error">{error}</Typography>}
            </Box>
        </Paper>
    )
}