/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @trutravel/domain and @trutravel/db are plain TS workspace packages (not pre-built) — transpile
  // them through Next's own build pipeline rather than requiring each package to ship its own build
  // step (see docs/architecture/platform-architecture.md §2 — modular monolith, npm workspaces).
  transpilePackages: ["@trutravel/domain", "@trutravel/db"],
};

export default nextConfig;
