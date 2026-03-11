/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // 军事科技金融主题 - 语义化颜色别名
        'tactical-bg': "hsl(var(--background))",
        'tactical-card': "hsl(var(--card))",
        'tactical-border': "hsl(var(--border))",
        'tech-primary': "hsl(var(--primary))",
        'tech-cyan': "hsl(var(--tech-cyan))",
        'tech-glow': "hsl(var(--tech-cyan) / 0.5)",
        'finance-gold': "hsl(var(--finance-gold))",
        'finance-accent': "hsl(var(--accent))",
        'military-olive': "hsl(var(--military-olive))",
        'tactical-green': "hsl(var(--tactical-green))",
        'alert-red': "hsl(var(--alert-red))",
        'hud-blue': "hsl(var(--hud-blue))",
        'stealth-black': "hsl(var(--stealth-black))",
        // 渐变起点
        'gradient-tactical-start': "hsl(150,18%,10%)",
        'gradient-tactical-end': "hsl(150,20%,6%)",
        'gradient-tech-start': "hsl(175,70%,20%)",
        'gradient-tech-end': "hsl(175,85%,30%)",
        'gradient-finance-start': "hsl(45,70%,15%)",
        'gradient-finance-end': "hsl(45,95%,30%)",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        'tactical': "0.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // 自定义工具类插件
    function({ addUtilities }) {
      const newUtilities = {
        // 战术角标装饰
        '.corner-deco': {
          'position': 'relative',
        },
        '.corner-deco::before, .corner-deco::after': {
          'content': '""',
          'position': 'absolute',
          'width': '8px',
          'height': '8px',
          'border': '2px solid hsl(var(--tech-cyan))',
          'transition': 'all 0.3s ease',
        },
        '.corner-deco::before': {
          'top': '-1px',
          'left': '-1px',
          'border-right': 'none',
          'border-bottom': 'none',
        },
        '.corner-deco::after': {
          'bottom': '-1px',
          'right': '-1px',
          'border-left': 'none',
          'border-top': 'none',
        },
        // Hover 时角标发光
        '.corner-deco:hover::before, .corner-deco:hover::after': {
          'box-shadow': '0 0 8px hsl(var(--tech-cyan) / 0.6)',
          'border-color': 'hsl(var(--tech-cyan))',
        },
        // 战术卡片
        '.bg-tactical-card': {
          'background': 'linear-gradient(145deg, hsl(var(--card)), hsl(var(--background)))',
          'border': '1px solid hsl(var(--border))',
        },
        // 科技发光效果
        '.tech-glow': {
          'box-shadow': '0 0 5px hsl(var(--tech-cyan) / 0.3), 0 0 20px hsl(var(--tech-cyan) / 0.1)',
        },
        // 金融金边框
        '.finance-border': {
          'border': '1px solid hsl(var(--finance-gold) / 0.3)',
          'box-shadow': '0 0 10px hsl(var(--finance-gold) / 0.1)',
        },
      };
      addUtilities(newUtilities);
    }
  ],
}