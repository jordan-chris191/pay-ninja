// app/manifest.ts
export default function manifest() {
  return {
    name: "Pay Ninja",
    short_name: "PayNinja",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      { src: "/launchericon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/launchericon-512x512.png", sizes: "512x512", type: "image/png" }
    ]
  }
}