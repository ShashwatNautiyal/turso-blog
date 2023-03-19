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

	const url = `${process.env.NEXT_PUBLIC_SEO_LINK}/${asPath}`;
	return (
		<SessionProvider session={session}>
			<ArticleJsonLd
				type="BlogPosting"
				url={url}
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
				canonical={url}
				openGraph={{
					locale: "en_IE",
					url: process.env.NEXT_PUBLIC_SEO_LINK,
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
					site: `${process.env.NEXT_PUBLIC_SEO_LINK}`,
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
