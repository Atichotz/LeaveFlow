/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Sans Thai', 'sans-serif'],
      },
      colors: {
        sidebar: {
          DEFAULT: '#1E3A5F',
          hover:   '#243f6a',
          active:  '#2d4f7f',
          dark:    '#0F2744',
        },
        primary: {
          DEFAULT: '#3B82F6',
          hover:   '#2563EB',
          light:   '#EFF6FF',
        },
        status: {
          approved:    '#10B981',
          approvedBg:  '#ECFDF5',
          pending:     '#F59E0B',
          pendingBg:   '#FFFBEB',
          rejected:    '#EF4444',
          rejectedBg:  '#FEF2F2',
        },
      },
    },
  },
  plugins: [],
};
