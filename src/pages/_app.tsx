import "@/styles/globals.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

import Header from "@/components/Header";
import { Outfit } from "@next/font/google";
import { ArticleJsonLd, DefaultSeo } from "next-seo";

const outfit = Outfit({
	subsets: ["latin"],
});

export default function App({
	Component,
	pageProps: { session, showHeader = true, ...pageProps },
}: AppProps) {
	const { title, description, asPath, image, created_at, tags, name } = pageProps;
	return (
		<SessionProvider session={session}>
			<ArticleJsonLd
				type="BlogPosting"
				url={`https://turso-blog.vercel.app/${asPath}`}
				title={title ?? "Turso Blog"}
				images={[image]}
				datePublished={created_at}
				dateModified={created_at}
				authorName={name}
				description={description ?? "The latest industry news, technologies, and resources"}
			/>
			<DefaultSeo
				title={title ?? "Turso Blog"}
				description={description ?? "The latest industry news, technologies, and resources"}
				canonical={`https://turso-blog.vercel.app/${asPath}`}
				openGraph={{
					locale: "en_IE",
					url: "https://turso-blog.vercel.app/",
					siteName: "Turso Blog",
					type: "article",
					article: {
						publishedTime: created_at,
						section: title,
						tags: tags ? [...tags] : [],
					},
					images: [
						{
							url: image ?? "/og-image.png",
							width: 800,
							height: 600,
							alt: "Og Image Alt",
						},
					],
				}}
				twitter={{
					handle: "@shashwatnauti",
					site: "@https://turso-blog.vercel.app/",
					cardType: "summary_large_image",
				}}
				robotsProps={{
					nosnippet: true,
					notranslate: true,
					noimageindex: true,
					noarchive: true,
					maxSnippet: -1,
					maxImagePreview: "none",
					maxVideoPreview: -1,
				}}
			/>
			<div className={`${outfit.className} tracking-wide`}>
				{showHeader && <Header />}
				<Component {...pageProps} />
			</div>
		</SessionProvider>
	);
}
