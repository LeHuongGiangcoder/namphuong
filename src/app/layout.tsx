import type { Metadata, Viewport } from "next";
import { Dancing_Script, Fraunces, Inter } from "next/font/google";
import { couple, dateLabel } from "@/data/wedding";
import "./globals.css";

/*
  Fraunces cho tiêu đề — serif retro, có trục SOFT/WONK để chữ mềm và hơi
  "lệch" đúng tinh thần playful, và quan trọng nhất là có bộ dấu tiếng Việt.
  (PP Editorial New trong /public/font không hỗ trợ tiếng Việt.)
*/
const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
});

/*
  Dancing Script cho những dòng viết tay dán lên tờ lịch — một trong số ít
  script font của Google có đủ dấu tiếng Việt.
*/
const dancing = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const title = `${couple.groom} & ${couple.bride} — ${dateLabel.day}.${dateLabel.month}.${dateLabel.year}`;
const description = `Thiệp cưới của ${couple.groomFull} và ${couple.brideFull}. ${dateLabel.weekday}, ngày ${dateLabel.day}.${dateLabel.month}.${dateLabel.year}.`;

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/components/40.png",
  },
  openGraph: { 
    title, 
    description, 
    type: "website", 
    locale: "vi_VN",
    images: [
      {
        url: "/art/og.jpg",
        width: 1200,
        height: 630,
        alt: "Quốc Anh và Diệp Khanh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/art/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f8f2e5",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${fraunces.variable} ${inter.variable} ${dancing.variable}`}>
      <body>{children}</body>
    </html>
  );
}
