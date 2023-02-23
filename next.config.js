/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: [
			"images.unsplash.com",
			"platform-lookaside.fbsbx.com",
			"lh3.googleusercontent.com",
			"avatars.githubusercontent.com",
			"res.cloudinary.com",
		],
	},
};

module.exports = nextConfig;
