import { Agenda } from "@/components/Agenda";
import { Details } from "@/components/Details";
import { Dresscode } from "@/components/Dresscode";
import { Gallery } from "@/components/Gallery";
import { GuestProvider } from "@/components/GuestContext";
import { Hero } from "@/components/Hero";
import { UnlockProvider } from "@/components/LockContext";
import { Rsvp } from "@/components/Rsvp";
import { ThankYou } from "@/components/ThankYou";

export default function Page() {
  return (
    <main>
      {/* ?to=<slug> quyết định tên khách và kiểu thiệp cho cả trang */}
      <GuestProvider>
        <Hero />

        {/* Ghép xong hai mảnh ảnh trong <Gallery /> thì <Details /> mới mở khoá */}
        <UnlockProvider>
          <Gallery />
          <Details />
        </UnlockProvider>

        <Agenda />
        <Dresscode />
        <Rsvp />
        <ThankYou />
      </GuestProvider>
    </main>
  );
}
