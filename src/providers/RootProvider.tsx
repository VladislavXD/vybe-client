"use client";
import { ThemeProvider } from "@/src/providers/ThemeProvider"
import { FallingLeaves } from "falling-leaves/react"
import React from "react"	


export default function RootProvider({children}: {children: React.ReactNode}) {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="main-provider-theme">
			<FallingLeaves
				fullScreen
				shapes={["maple"]}
				count={55}
				size={35}
				wind={1.2}
			/> 
			{children}
		</ThemeProvider>
	)
}


