/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
    
    images: { unoptimized: true },
    compiler: {
      removeConsole: true,
    }
  };
  
  export default nextConfig;
  