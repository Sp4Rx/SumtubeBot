import logoPath from "@assets/logo_1751221870398.png";

export default function Footer() {
  return (
    <footer className="relative z-10 py-12 mt-16">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 shadow-xl text-center">
          <div className="flex justify-center mb-6">
            <img src={logoPath}
              alt="SumTube Logo"
              className="w-16 h-16" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to enhance your Discord experience?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of Discord servers already using SumTube to stay informed and save time with AI-powered video summaries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <a href={`https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_APPLICATION_ID || 'YOUR_BOT_CLIENT_ID'}&permissions=2147551232&scope=bot%20applications.commands`}
              target="_blank"
              className="bg-discord hover:bg-discord-dark text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-2">
              <i className="fab fa-discord"></i>
              <span>Add to Discord</span>
            </a>

            <a href="https://github.com/sp4rx/sumtubebot"
              target="_blank"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-2">
              <i className="fab fa-github"></i>
              <span>View Source</span>
            </a>

            <a href="#setup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center space-x-2">
              <i className="fas fa-cog"></i>
              <span>Setup Guide</span>
            </a>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-500 text-sm">
              Made with ❤️ for the Discord community •
              <a href="mailto:support@sumtube-bot.com" className="text-discord hover:underline">Support</a> •
              <a href="#" className="text-discord hover:underline">Privacy Policy</a> •
              <a href="#" className="text-discord hover:underline">Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
