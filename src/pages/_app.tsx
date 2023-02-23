import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Header from "@/components/Header";
import { Outfit } from "@next/font/google";

const outfit = Outfit({
	subsets: ["latin"],
});

export default function App({
	Component,
	pageProps: { session, showHeader = true, ...pageProps },
}: AppProps) {
	return (
		<SessionProvider session={session}>
			<div className={`${outfit.className} tracking-wide`}>
				{showHeader && <Header />}
				<Component {...pageProps} />
			</div>
		</SessionProvider>
	);
}
