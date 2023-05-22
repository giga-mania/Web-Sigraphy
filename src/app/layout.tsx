import "./globals.css"
import Providers from "@/components/Providers";
import {ReactNode} from "react";

export const metadata = {
    title: 'Next Chat Messenger',
    description: 'RealTime Chat Messenger Application with in memory-cache to communicate instantly and efficiently',
}

export default function RootLayout({children}: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
