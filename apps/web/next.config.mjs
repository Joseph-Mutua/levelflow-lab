/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@levelflow/mock-data",
    "@levelflow/workflow-engine",
    "@levelflow/ui"
  ]
};

export default nextConfig;
