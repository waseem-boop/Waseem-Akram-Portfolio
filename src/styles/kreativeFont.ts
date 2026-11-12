import localFont from "next/font/local";

export const kreativeFont = localFont({
  src: [
    { path: "../../public/fonts/poppins-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/poppins-500.ttf", weight: "500", style: "normal" },
  ],
  display: "swap",
  preload: false,
});
