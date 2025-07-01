import Header from "@/components/header";
import Features from "@/components/features";
import Demo from "@/components/demo";
import SetupGuide from "@/components/setup-guide";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="font-inter overflow-x-hidden relative min-h-screen">
      {/* GitHub Corner */}
      <a href="https://github.com/Sp4Rx/sumtubebot" target="_blank" className="fixed top-0 right-0 z-50">
        <img src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png"
          alt="Fork me on GitHub"
          className="w-28 h-28 md:w-32 md:h-32" />
      </a>

      {/* Status Badges */}
      <div className="fixed top-4 left-4 z-40 flex flex-col gap-2">
        {/* Bot Online Status */}
        <div className="glass-card rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-2">
            {/* Better Stack Uptime Badge */}
            <a
              href="https://sumtubebot.betteruptime.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform duration-200"
            >
              <img
                src="https://uptime.betterstack.com/status-badges/v3/monitor/20bnv.svg"
                alt="Better Stack Uptime"
                className="h-6 rounded shadow-lg"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Header />
        <Features />
        <Demo />
        <SetupGuide />
        <FAQ />
        <Footer />
      </div>
    </div>
  );
}
