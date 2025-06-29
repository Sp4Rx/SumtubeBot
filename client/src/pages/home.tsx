import Header from "@/components/header";
import Features from "@/components/features";
import Demo from "@/components/demo";
import SetupGuide from "@/components/setup-guide";
import FAQ from "@/components/faq";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="font-inter bg-gray-50 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 gradient-bg -z-10"></div>
      
      {/* Floating Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="floating-shape w-20 h-20 top-1/4 left-1/12" style={{animationDelay: '0s'}}></div>
        <div className="floating-shape w-32 h-32 top-3/5 left-4/5" style={{animationDelay: '2s'}}></div>
        <div className="floating-shape w-16 h-16 top-4/5 left-1/5" style={{animationDelay: '4s'}}></div>
        <div className="floating-shape w-24 h-24 top-1/12 left-3/4" style={{animationDelay: '1s'}}></div>
        <div className="floating-shape w-20 h-20 top-2/5 left-1/12" style={{animationDelay: '3s'}}></div>
      </div>

      {/* GitHub Corner */}
      <a href="https://github.com/Sp4Rx/sumtube" target="_blank" className="fixed top-0 right-0 z-50">
        <img src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png" 
             alt="Fork me on GitHub" 
             className="w-28 h-28 md:w-32 md:h-32" />
      </a>

      {/* Status Badge */}
      <div className="fixed top-4 left-4 z-40 glass-card rounded-full px-4 py-2 shadow-lg max-w-[calc(100vw-8rem)] md:max-w-none">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Bot Online</span>
        </div>
      </div>

      <Header />
      <Features />
      <Demo />
      <SetupGuide />
      <FAQ />
      <Footer />
    </div>
  );
}
