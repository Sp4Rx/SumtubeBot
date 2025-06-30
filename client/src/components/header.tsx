import logoPath from "@assets/logo_1751221870398.png";

export default function Header() {
  return (
    <header className="relative z-10 pt-20 pb-16">
      <div className="container mx-auto px-6 text-center">
        {/* Logo */}
        <div className="mb-8">
          <img src={logoPath} 
               alt="SumTube Logo" 
               className="w-32 h-32 mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300" />
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
          📺 SumTube
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
          AI-powered Discord bot that automatically detects YouTube links and provides intelligent video summaries with timestamps
        </p>
        
        {/* Main CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={`https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_APPLICATION_ID}&permissions=2147551232&scope=bot%20applications.commands`} 
             target="_blank"
             className="bg-discord hover:bg-discord-dark text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-3 animate-pulse-glow">
            <i className="fab fa-discord text-2xl"></i>
            <span>Add to Discord</span>
          </a>
          
          <a href="#setup" 
             className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-3 backdrop-blur-sm">
            <i className="fas fa-cog"></i>
            <span>Setup Guide</span>
          </a>
        </div>
      </div>
    </header>
  );
}
