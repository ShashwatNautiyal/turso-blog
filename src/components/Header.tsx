import React, { Fragment, useState } from "react";

import { SessionContextValue, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsFillCaretDownFill } from "react-icons/bs";
import { FaGithub, FaSwatchbook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdKey } from "react-icons/io";

import { Dialog, Popover, Transition } from "@headlessui/react";

import Button from "./Button";
import Layout from "./Layout";
import Modal from "./Modal";
import { useRouter } from "next/router";

const Header = () => {
	const [signInModalOpen, setSignInModalOpen] = useState(false);
	const { data, status } = useSession();

	const router = useRouter();

	return (
		<div className="h-16 flex items-center text-black">
			<SignInModal signInModalOpen={signInModalOpen} setSignInModalOpen={setSignInModalOpen} />
			<Layout>
				<div className="flex justify-between items-center">
					<div className="flex text-base font-medium gap-6 items-center">
						<FaSwatchbook onClick={() => router.push("/")} className="h-8 w-8 cursor-pointer" />
						{navLinks.map(({ title, href }) => (
							<Link key={href} href={href} className="hover:text-gray-500">
								{title}
							</Link>
						))}
					</div>
					<div className="flex gap-4">
						{status !== "loading" &&
							(status === "authenticated" ? (
								<ProfilePopover data={data} />
							) : (
								<Button
									onClick={() => setSignInModalOpen(true)}
									className="bg-transparent border border-black text-black"
								>
									Login
								</Button>
							))}
					</div>
				</div>
			</Layout>
		</div>
	);
};

const ProfilePopover = ({ data }: { data: SessionContextValue["data"] }) => {
	if (!data) return null;
	return (
		<Popover className="relative">
			{({ open }) => (
				<>
					<Popover.Button className="flex items-center gap-2 outline-none">
						<div className="relative h-8 w-8">
							<Image
								sizes="100%"
								className="rounded-full object-cover m-0"
								fill
								quality={100}
								alt="profile"
								src={data.user?.image ?? ""}
							/>
						</div>
						<div>
							<div className="font-semibold">{data.user?.name}</div>
						</div>
						<BsFillCaretDownFill
							className={`${
								open ? "rotate-180 transform" : "rotate-0"
							} text-gray-400 transition-transform`}
						/>
					</Popover.Button>

					<Transition
						as={Fragment}
						enter="transition ease-out duration-200"
						enterFrom="opacity-0 translate-y-1"
						enterTo="opacity-100 translate-y-0"
						leave="transition ease-in duration-150"
						leaveFrom="opacity-100 translate-y-0"
						leaveTo="opacity-0 translate-y-1"
					>
						<Popover.Panel className="absolute right-0 mt-3 max-w-xs w-[200px] lg:max-w-3xl z-20 bg-white">
							<div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-2">
								<div className="relative whitespace-nowrap flex gap-8  p-4 flex-col">
									{profileLinks.map((item) =>
										item.href ? (
											<Link
												className="-m-3 flex items-center rounded-lg px-4 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium"
												key={item.name}
												href={item.href}
											>
												{item.name}
											</Link>
										) : (
											<button
												key={item.name}
												onClick={item.onClick as () => void}
												className="-m-3 flex items-center rounded-lg px-4 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50 text-sm font-medium"
											>
												<p className="text-sm text-black">{item.name}</p>
											</button>
										)
									)}
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</>
			)}
		</Popover>
	);
};

const profileLinks = [
	// {
	// 	name: "Your Profile",
	// 	href: "/profile",
	// },
	{
		name: "Create post",
		href: "/edit",
	},
	// {
	// 	name: "Settings",
	// 	href: "/settings",
	// },
	{
		name: "Sign out",
		onClick: () => signOut(),
	},
];

const SignInModal = ({
	signInModalOpen,
	setSignInModalOpen,
}: {
	signInModalOpen: boolean;
	setSignInModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const handleSignIn = async (method: "github" | "google") => {
		await signIn(method, {
			redirect: false,
		});
	};

	return (
		<Modal isOpen={signInModalOpen} closeModal={() => setSignInModalOpen(false)}>
			<Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-fuchsia-100 rounded-full">
						<IoMdKey className="h-6 w-6 text-fuchsia-500" />
					</div>
					<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
						Sign in
					</Dialog.Title>
				</div>
				<div className="mt-2">
					<p className="text-sm text-gray-500">
						Become a member - you&apos;ll enjoy the feed and the Blogs of others.
					</p>
				</div>
				<div className="w-full border-t border-gray-400 my-4" />

				<div className="mt-4 flex flex-col gap-4">
					<Button
						className="flex items-center shadow-sm justify-center gap-2 border-black border hover:text-white hover:bg-black transition-all duration-300"
						onClick={() => handleSignIn("google")}
					>
						<FcGoogle className="h-5 w-5" />
						Login with Google
					</Button>

					<Button
						className="flex items-center shadow-sm justify-center gap-2 border-black border hover:text-white hover:bg-black transition-all duration-300"
						onClick={() => handleSignIn("github")}
					>
						<FaGithub className="h-5 w-5" />
						Login with Github
					</Button>
				</div>
			</Dialog.Panel>
		</Modal>
	);
};

const navLinks = [
	{
		title: "Home",
		href: "/",
	},
];

export default Header;
