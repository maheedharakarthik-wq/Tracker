import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnniversaryJourney from "@/components/AnniversaryJourney";

export const metadata: Metadata = {
  title: "1st Year Anniversary & Projects Journey | VMK Edgemind Solutions",
  description:
    "Celebrating 1 year of engineering bespoke software, scalable web platforms, and full-funnel digital marketing ecosystems since our November 13 inception.",
};

export default function AnniversaryPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans text-slate-800">
      <Navbar />
      <main className="pt-28 md:pt-36">
        <AnniversaryJourney isStandalonePage={true} />
      </main>
      <Footer />
    </div>
  );
}
