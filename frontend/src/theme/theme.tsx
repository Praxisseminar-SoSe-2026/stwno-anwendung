import { createTheme } from '@mui/material/styles'
import {
  colorVariables,
  typoVariables,
  spacingUnit,
  radiusVariables,
} from './variables'

export const theme = createTheme({
  palette: {
    primary: colorVariables.primary,
    secondary: colorVariables.secondary,
    background: colorVariables.background,
    text: colorVariables.text,
    error: colorVariables.error,
    warning: colorVariables.warning,
    success: colorVariables.success,
  },
  typography: {
    fontFamily: typoVariables.fontFamily,
    h1: { fontSize: typoVariables.sizes.h1 },
    h2: { fontSize: typoVariables.sizes.h2 },
    h3: { fontSize: typoVariables.sizes.h3 },
    h4: { fontSize: typoVariables.sizes.h4 },
    body1: { fontSize: typoVariables.sizes.body1 },
    body2: { fontSize: typoVariables.sizes.body2 },
  },
  spacing: spacingUnit,
  shape: {
    borderRadius: radiusVariables.medium,
  },
  components: {
    // made with docs [https://mui.com/material-ui/api/text-field/#theme-default-props, https://mui.com/material-ui/api/form-helper-text/#classes, https://mui.com/material-ui/customization/theme-components/#theme-style-overrides]
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: typoVariables.sizes.body1,
        },
      },
    },
  },
})
