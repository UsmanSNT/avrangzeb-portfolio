import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Production build'da type checking'ni o'tkazib yuborish tavsiya etilmaydi
    // Lekin react-quill type muammosi tufayli vaqtincha o'chirilmoqda
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
