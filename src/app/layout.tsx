import React from "react";
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import QueryProvider from "@/components/QueryClient";
import MainContainer from "@/components/MainContainer";

const poppins = Poppins({ weight: '400', subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

interface RootLayoutProps {
	children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {

	return (
		<html lang="en">
			<body className={poppins.className}>
				<QueryProvider>
					<MainContainer>
						{children}
					</MainContainer>
				</QueryProvider>
			</body>
		</html>
	)
}