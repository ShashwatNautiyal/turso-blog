import React, { useState } from "react";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import dynamic from "next/dynamic";
import { BiDownArrow, BiRightArrow } from "react-icons/bi";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import Button from "@/components/Button";
import Layout from "@/components/Layout";
import { Disclosure, Tab } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = ["Write", "Preview"];

const MDXEmbedProvider = dynamic(() => import("mdx-embed").then((mod) => mod.MDXEmbedProvider), {
	ssr: false,
});

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(" ");
}

const EditorSection = ({
	handlePublish,
	plainMdx,
	setPlainMdx,
	isLoading,
}: {
	handlePublish: () => void;
	plainMdx: string;
	setPlainMdx: (value: string) => void;
	isLoading: boolean;
}) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const [mdxGenerated, setMdxGenerated] =
		useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, string>>>();

	return (
		<Layout>
			<Tab.Group
				selectedIndex={selectedIndex}
				onChange={async (index) => {
					if (index === 1) {
						try {
							const mdx = await serialize(plainMdx, {
								mdxOptions: {
									remarkPlugins: [remarkGfm],
									rehypePlugins: [rehypeHighlight],
									development: process.env.NODE_ENV !== "production",
								},
							});
							setMdxGenerated(mdx);
							setSelectedIndex(1);
						} catch (error: any) {
							const message = error.message
								.replace("[next-mdx-remote] error compiling MDX:\n", "")
								.replace("\n\nMore information: https://mdxjs.com/docs/troubleshooting-mdx", "")
								.split("\n")[0];

							const line = error.message
								.replace("[next-mdx-remote] error compiling MDX:\n", "")
								.replace("\n\nMore information: https://mdxjs.com/docs/troubleshooting-mdx", "")
								.split("\n")
								.find((line: string) => line.startsWith("> "))
								.replace("> ", "At line: ");

							toast.error(`${message}\n\n${line}`);
							setSelectedIndex(0);
						}
					} else {
						setMdxGenerated(undefined);
						setSelectedIndex(0);
					}
				}}
			>
				<div className="flex gap-4 items-center mt-8">
					<Tab.List className="flex w-fit gap-2 border-2 border-gray-200 rounded-xl">
						{tabs.map((tab) => (
							<Tab
								key={tab}
								className={({ selected }) =>
									classNames(
										"rounded-lg py-2.5 px-7 text-sm font-medium leading-5 text-black",
										"focus:outline-none",
										selected ? "bg-black text-white shadow" : "hover:bg-gray-200g"
									)
								}
							>
								{tab}
							</Tab>
						))}
					</Tab.List>
					<Button
						isLoading={isLoading}
						onClick={() => {
							if (mdxGenerated === undefined) {
								toast.error("Please preview your blog before publishing");
								return;
							}
							handlePublish();
						}}
						className="bg-green-500 text-white"
					>
						Publish
					</Button>
				</div>
				<Tab.Panels className="my-8 grid grid-cols-3 gap-10">
					<Tab.Panel className="col-span-2">
						<textarea
							placeholder="Enter your blog content here....."
							onChange={(e) => {
								setPlainMdx(e.target.value);
							}}
							value={plainMdx}
							className="h-[85vh] w-full overflow-scroll whitespace-pre-wrap resize-none outline-none py-6 px-8 md:text-lg text-base border-2 border-gray-200 rounded-lg text-gray-700"
							name="plainMdx"
							id="plainMdx"
						/>
					</Tab.Panel>
					<Tab.Panel className="col-span-2">
						<main className="min-h-[85vh] w-full border-2 rounded-lg border-gray-200 py-6 px-8 prose prose-violet max-w-none lg:prose-lg ">
							{mdxGenerated && (
								<MDXEmbedProvider>
									<MDXRemote {...mdxGenerated} />
								</MDXEmbedProvider>
							)}
						</main>
					</Tab.Panel>

					<div className="prose">
						<h2 className="mb-2">Editor basic</h2>
						<div>
							Use{" "}
							<a
								rel="noreferrer"
								href="https://kabartolo.github.io/chicago-docs-demo/docs/mdx-guide/writing/"
								target="_blank"
							>
								MDX
							</a>
							<span> and </span>
							<a
								rel="noreferrer"
								href="https://www.mdx-embed.com/?path=/docs/components-spotify--usage"
								target="_blank"
							>
								Embeds
							</a>{" "}
							to style your blog.
						</div>

						<Disclosure>
							{({ open }) => (
								<>
									<Disclosure.Button className="h-fit flex gap-2 items-center my-4 text-left">
										{open ? (
											<BiDownArrow className="shrink-0" />
										) : (
											<BiRightArrow className="shrink-0" />
										)}
										Commonly used syntax
									</Disclosure.Button>
									<Disclosure.Panel>
										<table className="m-0">
											<thead>
												<tr>
													<th>MDX Syntax</th>
													<th>HTML Tag</th>
													<th>Output</th>
												</tr>
											</thead>
											<tbody>
												{editorBasics.map((item, index) => (
													<tr key={index}>
														<td>{item.mdxSyntax}</td>
														<td>{item.htmlTag}</td>
														<td>{item.output}</td>
													</tr>
												))}
											</tbody>
										</table>
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>

						<Disclosure>
							{({ open }) => (
								<>
									<Disclosure.Button className="h-fit flex gap-2 items-center my-4 text-left">
										{open ? (
											<BiDownArrow className="shrink-0" />
										) : (
											<BiRightArrow className="shrink-0" />
										)}
										Embed rich content such as Gist, Codepen, etc.
									</Disclosure.Button>
									<Disclosure.Panel>
										<table className="m-0">
											<thead>
												<tr>
													<th>MDX Syntax</th>
													<th>Props</th>
												</tr>
											</thead>
											<tbody>
												{editorEmbeds.map((item, index) => (
													<tr key={index}>
														<td>{item.mdxSyntax}</td>
														<td>{item.props}</td>
													</tr>
												))}
											</tbody>
										</table>
									</Disclosure.Panel>
								</>
							)}
						</Disclosure>
					</div>
				</Tab.Panels>
			</Tab.Group>
		</Layout>
	);
};

const editorEmbeds = [
	{
		mdxSyntax: "<Codepen />",
		props: "codePenId",
	},
	{
		mdxSyntax: "<CodeSandbox />",
		props: "codeSandboxId",
	},
	{
		mdxSyntax: "<Figma />",
		props: "title, url",
	},
	{
		mdxSyntax: "<Flickr />",
		props: "flickrLink",
	},
	{
		mdxSyntax: "<Gist />",
		props: "gistLink",
	},
	{
		mdxSyntax: "<Instagram />",
		props: "instagramId",
	},
	{
		mdxSyntax: "<Replit />",
		props: "repl",
	},
	{
		mdxSyntax: "<Spotify />",
		props: "spotifyLink",
	},
	{
		mdxSyntax: "<Whimsical />",
		props: "diagramId",
	},
	{
		mdxSyntax: "<Wikipedia />",
		props: "wikipediaLink",
	},
	{
		mdxSyntax: "<YouTube />",
		props: "youTubeId, youTubePlaylistId",
	},
];
const editorBasics = [
	{
		mdxSyntax: "#",
		htmlTag: "h1",
		output: <h1 className="m-0">Heading 1</h1>,
	},
	{
		mdxSyntax: "...",
		htmlTag: "...",
		output: <div className="m-0">...</div>,
	},
	{
		mdxSyntax: "#####",
		htmlTag: "h5",
		output: <h5 className="m-0">Heading 5</h5>,
	},
	{
		mdxSyntax: "**bold**",
		htmlTag: "strong",
		output: <strong className="m-0">bold</strong>,
	},
	{
		mdxSyntax: "*italic*",
		htmlTag: "em",
		output: <em className="m-0">italic</em>,
	},
	{
		mdxSyntax: "~~strikethrough~~",
		htmlTag: "del",
		output: <del className="m-0">strikethrough</del>,
	},
	{
		mdxSyntax: "> quote",
		htmlTag: "blockquote",
		output: <blockquote className="m-0">quote</blockquote>,
	},
	{
		mdxSyntax: "```code block```",
		htmlTag: "pre",
		output: <pre className="m-0">code block</pre>,
	},
];

export default EditorSection;
