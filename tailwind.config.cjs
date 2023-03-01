module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'eg-brand': '#77B244',

        'primary-colour': '#fb5607',
        'secondary-colour': '#ff006e',
        'tertiary-colour': '#3a86ff',
        'secondary-contrast-colour': '#ffbe0b',
        'contrast-colour': '#8338ec',
  
        'theme-black': '#121212',
        'theme-grey': '#535353', // TODO:: #574c4f rocio likes this commented grey
      },
      fontFamily: {
        script: ["'Nanum Brush Script', cursive"],
        theme: ["'Chillax-Regular', sans"],
      },
      zIndex: {
        '-1': '-1',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        none: 'none',
        spin: 'spin 1s linear infinite',
        ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        fade: 'fadeIn 2s ease',
        loader: 'loader 0.6s infinite alternate',
      },
      keyframes: {
        loader: {
          from: {
            opacity: 1,
            transform: 'translate3d(0, -1rem, 0)',
          },
          to: {
            opacity: 0.1,
          },
        },
        spin: {
          to: {
            transform: 'rotate(360deg)',
          },
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0',
          },
        },
        pulse: {
          '50%': {
            opacity: '.5',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
          },
          '50%': {
            transform: 'none',
            animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
          },
        },
        fadeIn: {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
}
