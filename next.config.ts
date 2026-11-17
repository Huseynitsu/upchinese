import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "onnxruntime-node", "@huggingface/transformers"],
  outputFileTracingIncludes: {
    "/api/dictionary/**": ["./data/cedict.min.json"],
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      "onnxruntime-node$": false,
    }
    return config
  },
}

export default nextConfig
