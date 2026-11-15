"use client";
import { ThemeProvider } from "@/src/providers/ThemeProvider"
import { QueryProvider } from "@/src/providers/QueryProvider"
import { FallingLeaves } from "falling-leaves/react"
import React from "react"	

export default function RootProvider({children}: {children: React.ReactNode}) {
	return (
		<QueryProvider>
			<ThemeProvider defaultTheme="dark" storageKey="main-provider-theme">

				{children}
			</ThemeProvider>
		</QueryProvider>
	)
}


