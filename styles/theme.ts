const spacing = {
  s: "8px",
  m: "12px",
  mplus: "16px",
  l: "20px",
  xl: "24px",
  xxl: "30px",
  xxxl: "40px",
} as const;

const colors = {
  primary: "#B2CFE9",
  secondary: "#7895B2",
  background: "#E6E6E6",
  backgroundSecondary: "#DCDCDC",
  boxShadow: "#000000",
  text: "#434343",
} as const;

const fontFamily = "Roboto";
const fonts = {
  regular: `400 12px ${fontFamily}`,
  bold: `600 12px ${fontFamily}`,
  heading1: `400 24px ${fontFamily}`,
  subheading1: `400 18px ${fontFamily}`,
  subheading2: `400 15px ${fontFamily}`,
} as const;

const borderRadi = {
  regular: "25px",
} as const;

export const theme = { spacing, colors, fonts, borderRadi };
