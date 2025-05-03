
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom colors for BidTacToe
				cyber: {
					dark: '#0F111A',
					darker: '#080A12',
					purple: '#9b87f5',
					'light-purple': '#b8aff7',
					blue: '#1EAEDB',
					'light-blue': '#40c8f5',
					green: '#36F097',
					red: '#FF4B4B',
					gray: '#2A2D3A'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px 0 rgba(155, 135, 245, 0.5)',
					},
					'50%': {
						boxShadow: '0 0 15px 5px rgba(155, 135, 245, 0.7)',
					},
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)',
					},
					'50%': {
						transform: 'translateY(-10px)',
					},
				},
				'number-change': {
					'0%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
					'50%': {
						transform: 'translateY(-20px)',
						opacity: '0',
					},
					'51%': {
						transform: 'translateY(20px)',
						opacity: '0',
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1',
					},
				},
				'shake': {
					'0%': { transform: 'translate(0, 0)' },
					'10%': { transform: 'translate(-5px, -2px)' },
					'20%': { transform: 'translate(5px, 2px)' },
					'30%': { transform: 'translate(-5px, -2px)' },
					'40%': { transform: 'translate(5px, 2px)' },
					'50%': { transform: 'translate(-5px, -2px)' },
					'60%': { transform: 'translate(5px, 2px)' },
					'70%': { transform: 'translate(-5px, -2px)' },
					'80%': { transform: 'translate(5px, 2px)' },
					'90%': { transform: 'translate(-5px, -2px)' },
					'100%': { transform: 'translate(0, 0)' },
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite',
				'float': 'float 3s ease-in-out infinite',
				'number-change': 'number-change 0.5s ease-in-out',
				'shake': 'shake 1s ease-in-out',
			},
			backgroundImage: {
				'cyber-gradient': 'linear-gradient(135deg, #0F111A 0%, #1A1F2C 100%)',
				'purple-glow': 'radial-gradient(circle, rgba(155, 135, 245, 0.15) 0%, rgba(155, 135, 245, 0) 70%)',
				'blue-glow': 'radial-gradient(circle, rgba(30, 174, 219, 0.15) 0%, rgba(30, 174, 219, 0) 70%)',
				'button-gradient': 'linear-gradient(90deg, #9b87f5 0%, #40c8f5 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
