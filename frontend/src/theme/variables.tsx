export const colorVariables = {
  primary: {
    main: '#031A6F',
  },
  secondary: {
    main: '#ACA7CC',
  },
  background: {
    default: '#E8E8E8',
    paper: '#ffffff',
  },
  error: {
    main: '#E30716',
  },
  warning: {
    main: '#E5A716',
  },
  success: {
    main: '#75B72B',
  },
  text: {
    primary: '#333333',
  },
} as const

export const typoVariables = {
  fontFamily: 'Roboto',
  sizes: {
    h1: 45,
    h2: 35,
    h3: 30,
    h4: 25,
    body1: 20,
    body2: 18,
  },
} as const

export const spacingUnit = 8

export const radiusVariables = {
  small: 6,
  medium: 6,
  large: 67,
} as const
