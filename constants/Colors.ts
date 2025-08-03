/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

const tintColorLight = '#0a7ea4';      // Blue for light theme
const secondTintColorLight = '#C4E1E6'; // Light blue for light theme
const tintColorDark = '#020d1f';       // Dark blue for dark theme
const secondTintColorDark = '#041d4d'; // Light blue for dark theme

export const Colors = {
  light: {
    text: '#000000',                   // Dark text for light background
    background: '#ffffff',             // White background
    tintfirst: tintColorLight,         // Blue
    secondTint: secondTintColorLight,  // Light blue
    buttonfirstColor: '#1b4ba4ff',       // Blue button
    buttonSecondColor: '#1e69c5ff',      // Light blue button
    cardBackground: 'rgba(10, 126, 164, 0.1)', // Light blue tint
    cardBorder: 'rgba(10, 126, 164, 0.3)',
    inputBackground: 'rgba(10, 126, 164, 0.1)',
    inputBorder: 'rgba(10, 126, 164, 0.3)',
    inputText: '#020d1f',
    inputPlaceholder: 'rgba(2, 13, 31, 0.6)',
    icon: '#0a7ea4',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',                   // Light text for dark background
    background: '#000000',             // Black background
    tintfirst: tintColorDark,          // Dark blue
    secondTint: secondTintColorDark,   // Light blue
    buttonfirstColor: '#195aafff',       // Blue button
    buttonSecondColor: '#14a1baff',      // Light blue button
    cardBackground: 'rgba(255, 255, 255, 0.1)', // White tint
    cardBorder: 'rgba(255, 255, 255, 0.2)',
    inputBackground: 'rgba(255, 255, 255, 0.15)',
    inputBorder: 'rgba(255, 255, 255, 0.3)',
    inputText: '#ffffff',
    inputPlaceholder: 'rgba(255, 255, 255, 0.6)',
    icon: '#C4E1E6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
