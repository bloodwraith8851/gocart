import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata = {
    title: "GoCart. — Shop Smarter",
    description: "GoCart. is a modern multi-vendor marketplace. Shop the latest electronics, accessories, and more — all in one place.",
    keywords: ["shop", "ecommerce", "gadgets", "electronics", "gocart"],
    openGraph: {
        title: "GoCart. — Shop Smarter",
        description: "Modern multi-vendor marketplace with the best tech products.",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en" className={inter.variable}>
                <head>
                    <meta name="theme-color" content="#000000" />
                </head>
                <body className="antialiased">
                    <StoreProvider>
                        <Toaster
                            position="top-center"
                            toastOptions={{
                                style: {
                                    background: "#1d1d1f",
                                    color: "#ffffff",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    padding: "12px 16px",
                                },
                                success: {
                                    iconTheme: { primary: "#0071e3", secondary: "#fff" },
                                },
                            }}
                        />
                        {children}
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
