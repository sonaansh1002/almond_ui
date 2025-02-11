import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     baseUrl: "https://trapi.vouch.club"  //testing

//   }
// };

// export default nextConfig;

// Dynamic BaseUrl Based on production or testing //

const nextConfig: NextConfig = {
  env: {

    baseUrl: process.env.NODE_ENV === "production"
      ? "https://trapi.vouch.club"
      : "https://trapi.vouch.club",

    baseUrl_OrderTracking: process.env.NODE_ENV === "production"
      ? 'https://ordertracking.almonds.ai/api'
      : 'https://ordertracking.almonds.ai/api'
    ,
  },
};

export default nextConfig;

