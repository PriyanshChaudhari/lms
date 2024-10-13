"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider,useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

const MyComponent = () => {
    const { theme } = useTheme()
  
    return (
      <div className={`${theme === 'dark' ? 'bg-darkBg' : 'bg-white'} min-h-screen`}>
        {/* Rest of your content */}
      </div>
    )
  }
  
  export default MyComponent