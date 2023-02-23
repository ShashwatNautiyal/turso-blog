import React from "react";

import { GetStaticPaths, GetStaticPropsContext, InferGetServerSidePropsType } from "next";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import dynamic from "next/dynamic";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import GithubSlugger from "github-slugger";

import InfoSection from "@/components/InfoSection";
import Layout from "@/components/Layout";
import { Blog } from "@/index";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { serializeData } from "../api/user";
import { connect } from "@libsql/client";

const MDXEmbedProvider = dynamic(() => import("mdx-embed").then((mod) => mod.MDXEmbedProvider), {
	ssr: false,
});

const BlogPage = ({
	mdxSource,
	headings,
	...rest
}: InferGetServerSidePropsType<typeof getStaticProps>) => {
	const { created_at, description, name, tags, title, profileImage } = rest;

	return (
		<>
			<InfoSection
				tagList={tags}
				title={{ value: title }}
				description={{ value: description }}
				createdAt={created_at}
				user={{
					name,
					image: profileImage,
				}}
			/>
			<Layout>
				<article className="mt-8 prose prose-violet max-w-none lg:prose-lg grid grid-cols-3 gap-10 prose-img:border">
					<main className="col-span-2">
						<MDXEmbedProvider>
							<MDXRemote {...mdxSource} />
						</MDXEmbedProvider>
					</main>
					<aside className="flex col-span-1 flex-col gap-2 h-fit sticky top-0 max-w-xs">
						<h3>Table of contents</h3>
						{headings?.map((heading: any) => (
							<a href={heading.href} key={heading.href}>
								{heading.text}
							</a>
						))}
						<div className="h-[0.8px] bg-gray-300 my-2" />
						<div className="flex flex-col">
							<input
								className="border-black border px-2 py-1"
								placeholder="Enter your email"
								type="email"
								name="email"
								id="email"
							/>
							<button className="bg-black text-white px-2 py-1 ">Subscirbe</button>
						</div>
					</aside>
				</article>
			</Layout>
		</>
	);
};

export const getStaticPaths: GetStaticPaths = async () => {
	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};

	const db = connect(config);

	const blogs = await db.execute(
		`select * from users INNER JOIN blogs where users.id=blogs.user_id`
	);
	const _result = serializeData(blogs);

	const result = _result?.map((blog: any) => {
		return {
			...blog,
			tags: blog.tags.split(","),
		};
	}) as Blog[];

	const paths = result.map((blog) => ({
		params: {
			blogTitle: `${blog.title.split(" ").join("-")}-${blog.id}`,
		},
	}));

	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
	// MDX text - can be from a local file, database, anywhere

	const id = (params?.blogTitle as string).split("-").pop();

	const slugger = new GithubSlugger();

	const config = {
		url: process.env.NEXT_PUBLIC_DB_URL as string,
	};

	const db = connect(config);

	const blog = await db.execute(
		`
            select * from users INNER JOIN blogs where users.id=blogs.user_id AND blogs.id=?
        `,
		[id as string]
	);

	const _result = serializeData(blog);

	const result = _result?.map((blog: any) => {
		return {
			...blog,
			tags: blog.tags.split(","),
		};
	});

	const blogData = result[0];

	const { content: _content, ...rest } = blogData;

	const [heading, ...restContent] = _content.split("\n");

	const _heading = [heading, "", `![${blogData.title}](${blogData.image})`, ""];

	const content = [..._heading, ...restContent].join("\n");

	const mdxSource = await serialize(content, {
		mdxOptions: {
			remarkPlugins: [remarkGfm],
			rehypePlugins: [rehypeHighlight, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]],
			development: process.env.NODE_ENV !== "production",
		},
	});

	const headings = content
		.match(/(#+)\s(.*)/g)
		?.map((heading) => heading.replace(/(#+)\s(.*)/, "$2"));

	const formatedHeadings = headings?.map((heading) => ({
		href: `#${slugger.slug(heading)}`,
		text: heading,
	}));

	return {
		props: {
			mdxSource,
			showHeader: false,
			asPath: `blog/${blogData.title.split(" ").join("-")}-${blogData.id}`,
			headings: formatedHeadings,
			...rest,
		},
	};
};

export default BlogPage;
