/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { HiOutlinePhotograph } from "react-icons/hi";
import { RxPlusCircled } from "react-icons/rx";

import Layout from "./Layout";
import Pill from "./Pill";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/router";

const InfoSection = ({
	coverImage,
	title,
	description,
	tagList,
	isInput = false,
	blogTags,
	user,
	createdAt,
	isLoading,
}: {
	title: {
		value: string;
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	};
	description: {
		value: string;
		onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	};
	blogTags?: {
		value: string[];
		onChange?: React.Dispatch<React.SetStateAction<string[]>>;
	};
	coverImage?: {
		value: File | null;
		onChange?: React.Dispatch<React.SetStateAction<File | null>>;
	};
	isInput?: boolean;
	tagList?: string[];
	createdAt?: string;
	user?: {
		name: string;
		image: string;
	};
	isLoading?: boolean;
}) => {
	const { value: titleValue, onChange: titleOnChange } = title ?? {};
	const { value: descriptionValue, onChange: descriptionOnChange } = description ?? {};
	const { data } = useSession();

	const { value: image, onChange: setImage } = coverImage ?? {};

	const { value: tags, onChange: setTags } = blogTags ?? {};

	const router = useRouter();

	return (
		<div className="prose prose-violet max-w-none bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative h-fit">
			<Layout>
				<div className="pt-6">
					<MdArrowBack
						onClick={() => {
							!isLoading && router.push("/");
						}}
						className={`${
							isLoading ? "opacity-50" : "hover:bg-gray-400/60"
						} h-9 w-9  cursor-pointer rounded-full transition-all`}
					/>
				</div>
				<div className={`${!isInput ? "pb-[6rem]" : "pb-6"} grid grid-cols-3 gap-6 pt-[4rem]`}>
					<div className="col-span-2">
						{isInput ? (
							<div className="flex flex-col gap-6 mb-6">
								<input
									placeholder="Enter your title"
									value={titleValue}
									onChange={titleOnChange}
									className="bg-transparent outline-none text-5xl font-medium placeholder:text-gray-300"
								/>
								<input
									placeholder="Enter your description"
									value={descriptionValue}
									onChange={descriptionOnChange}
									className="bg-transparent outline-none text-lg placeholder:text-gray-300"
								/>
							</div>
						) : (
							<div className="flex flex-col gap-6 mb-6">
								<div className="text-5xl font-medium leading-[3.5rem]">{titleValue}</div>
								<div className="text-lg">{descriptionValue}</div>
							</div>
						)}

						<div>
							<div className="flex items-center gap-4">
								<div className="relative h-14 w-14">
									<Image
										sizes="100%"
										className="rounded-full object-cover m-0"
										fill
										alt={(isInput ? data?.user?.name : user?.name) ?? "Profile Picture"}
										src={(isInput ? data?.user?.image : user?.image) ?? ""}
									/>
								</div>
								<div>
									<div className="font-semibold">{isInput ? data?.user?.name : user?.name}</div>
									<div>
										{isInput ? "Publishing" : "Published"} on{" "}
										{isInput
											? new Date().toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
											  })
											: new Date(createdAt as string).toLocaleDateString("en-US", {
													year: "numeric",
													month: "long",
													day: "numeric",
											  })}
									</div>
								</div>
							</div>
						</div>
					</div>

					{tagList && (
						<div className="flex flex-wrap gap-4 mt-2 items-center h-fit ml-auto">
							{tagList.map((tag, index) => (
								<Pill
									text={{
										value: tag,
									}}
									key={index}
									showClose={false}
								/>
							))}
						</div>
					)}

					{isInput && (
						<div className="h-fit">
							<h2 className="text m-0 text-white mb-4">Add upto 3 tags</h2>
							<div className="flex flex-wrap gap-4 mt-2 items-center">
								{tags &&
									tags.map((tag, index) => (
										<Pill
											placeholder="Tag name"
											isInput
											text={{
												value: tag,
												onChange: (e) => {
													const newTags = [...tags];
													newTags[index] = e.target.value;
													setTags && setTags(newTags);
												},
											}}
											key={index}
											onClose={() => {
												const newTags = [...tags];
												newTags.splice(index, 1);
												setTags && setTags(newTags);
											}}
											showClose={tags.length > 1}
										/>
									))}
								{tags && tags[tags.length - 1]?.length > 0 && tags?.length < 3 && (
									<RxPlusCircled
										onClick={() => setTags && setTags((tags) => [...tags, ""])}
										size={24}
										className="text-white hover:scale-[1.1] cursor-pointer"
									/>
								)}
							</div>
							<div className="my-4">
								{isInput && (
									<ImageUploadBox image={image ?? null} setImage={setImage ?? (() => {})} />
								)}
							</div>
						</div>
					)}
				</div>
			</Layout>
		</div>
	);
};

const ImageUploadBox = ({
	image,
	setImage,
}: {
	image: File | null;
	setImage: (image: File | null) => void;
}) => {
	const [isDropZone, setIsDropZone] = useState(false);

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
			setIsDropZone(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		setIsDropZone(false);
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.dataTransfer.dropEffect = "copy";
		setIsDropZone(true);
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setImage(e.dataTransfer.files[0]);
		}
		e.dataTransfer.clearData();
		setIsDropZone(false);

		e.preventDefault();
		e.stopPropagation();
	};

	return (
		<div
			onDrop={(e) => handleDrop(e)}
			onDragOver={(e) => handleDragOver(e)}
			onDragEnter={(e) => handleDragEnter(e)}
			onDragLeave={(e) => handleDragLeave(e)}
			className="border rounded-lg flex-1 max-w-xs h-[240px] overflow-hidden"
		>
			{isDropZone && (
				<div className="absolute top-0 left-0 right-0 bottom-0 bg-white/40 rounded-md border-dashed border-4 scale-[1.01] z-10"></div>
			)}
			{image ? (
				<div className="relative w-full rounded-md h-full">
					<img
						className="object-cover h-full w-full rounded-md my-0"
						src={URL.createObjectURL(image)}
						alt={image.name}
					/>
					<label className="absolute my-0 bottom-2 flex justify-center w-full" htmlFor="post_image">
						<div className="mt-4  text-white bg-blue-700/70 cursor-pointer rounded-lg py-2.5 px-7 text-sm font-medium leading-5">
							Change
						</div>
					</label>
					<input
						type="file"
						onChange={(e) => setImage(e.target.files && e.target.files[0])}
						className="hidden"
						id="post_image"
					/>
				</div>
			) : (
				<div className="flex flex-col items-center gap-2 h-full justify-center py-4">
					<HiOutlinePhotograph className="h-10 w-10" />
					<p className="text-sm font-medium my-0">Drag and Drop</p>

					<div>
						<label htmlFor="post_image">
							<div className="mt-4 text-white bg-blue-700 cursor-pointer rounded-lg py-2.5 px-7 text-sm font-medium leading-5">
								Choose Image
							</div>
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								setImage(e.target.files && e.target.files[0]);
							}}
							className="hidden"
							id="post_image"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default InfoSection;
