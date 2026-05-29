window.tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Google Material Design 3 color palette
                primary: '#005db3',              // Primary
                'on-primary': '#ffffff',         // On Primary
                'primary-container': '#d5e3ff',  // Primary Container
                'on-primary-container': '#001c3b', // On Primary Container
                
                secondary: '#535f70',            // Secondary
                'on-secondary': '#ffffff',       // On Secondary
                'secondary-container': '#d7e3f8', // Secondary Container
                'on-secondary-container': '#101c2b', // On Secondary Container
                
                tertiary: '#6b577b',             // Tertiary
                'on-tertiary': '#ffffff',        // On Tertiary
                'tertiary-container': '#f3daff',  // Tertiary Container
                'on-tertiary-container': '#251431', // On Tertiary Container
                
                background: '#fdfcff',           // Background
                'on-background': '#1a1c1e',      // On Background
                
                surface: '#fdfcff',              // Surface
                'on-surface': '#1a1c1e',         // On Surface
                'surface-container': '#f3f4f9',  // M3 Surface Container (light grey/blue tone)
                'surface-variant': '#dfe2eb',    // Surface Variant
                'on-surface-variant': '#43474e',  // On Surface Variant
                
                outline: '#73777f',              // Outline
                'outline-variant': '#c3c6cf',    // Outline Variant
                
                // Compatibility mapping
                dark: '#1a1c1e',
                light: '#f3f4f9',
                'light-bg': '#fdfcff'
            },
            fontFamily: {
                sans: ['Roboto', 'Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            animation: {
                'fade-in-down': 'fadeInDown 0.8s ease-out',
                'fade-in-up': 'fadeInUp 0.8s ease-out 0.2s backwards',
            },
            keyframes: {
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
