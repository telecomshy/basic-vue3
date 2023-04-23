/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin"

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        "element-fonts": ['Helvetica Neue', 'Helvetica', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Arial', 'sans - serif']
      }
    },
  },
  plugins: [
    plugin(function ({ matchComponents }) {
      const ruleObj = {
        "display": "flex",
        "justify-content": "center",
        "align-items": "center"
      }

      matchComponents({
        "justify-align-center": value => {
          if (value === "col") {
            ruleObj["flex-direction"] = "column"
          } else {
            ruleObj["flex-direction"] = value
          }
          return ruleObj
        }
      })
    }),
  ],
}

