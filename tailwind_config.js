window.tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#0f172a', // Deep Slate Blue
                secondary: '#3b82f6', // Vibrant Blue
                accent: '#10b981', // Emerald
                dark: '#1e293b', // Slate 800
                light: '#f1f5f9', // Slate 100
                'light-bg': '#f8fafc', // Slate 50
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
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
