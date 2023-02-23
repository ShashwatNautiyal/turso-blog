import React from "react";

import Image from "next/image";
import Link from "next/link";
import { BsDot } from "react-icons/bs";

import { Blog } from "@/index";

import Pill from "../Pill";
import GithubSlugger from "github-slugger";

const HeroSection = (props: Omit<Blog, "content" | "email" | "user_id">) => {
	const { title, description, created_at, image, tags, name, id } = props;
	const slugger = new GithubSlugger();
	return (
		<div>
			<div className={`text-center flex flex-col gap-6 h-[30vh] justify-center`}>
				<div className="font-medium text-base">The blog</div>
				<div className="flex justify-center font-semibold md:text-6xl sm:text-5xl text-3xl">
					Writings from our team
				</div>
				<div className="">The latest industry news, technologies, and resources</div>
			</div>

			<Link href={`/blog/${slugger.slug(title)}-${id}`}>
				<div className="w-full h-[65vh] relative">
					<Image
						sizes="100%"
						style={{
							objectFit: "cover",
							objectPosition: "center center",
						}}
						fill
						alt={title}
						src={image}
					/>
					<div className="absolute bottom-0 left-0 md:p-6 text-white flex flex-col gap-3 backdrop-filter backdrop-brightness-50 backdrop-blur-md m-2 rounded-lg">
						<div className="flex items-center text-sm font-semibold">
							{name}
							<BsDot />
							{new Date(created_at).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</div>

						<div className="text-3xl font-medium">{title}</div>

						<div>{description}</div>

						<div className="flex gap-2 mt-2">
							{tags?.map((tag, index) => {
								return <Pill key={index} text={{ value: tag }} />;
							})}
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default HeroSection;
