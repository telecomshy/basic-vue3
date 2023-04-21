/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        myCyan: {
          light: '#f1f6fc',
          DEFAULT: '#e2e8f6'
        }
      },
      fontFamily: {
        elements: ['Helvetica Neue', 'Helvetica', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Arial', 'sans - serif']
      }
    },
  },
  plugins: [],
}

