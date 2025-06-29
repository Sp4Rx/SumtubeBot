import logoPath from "@assets/logo_1751221870398.png";

export default function Demo() {
  return (
    <section className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">See SumTube in Action</h2>
          
          {/* Demo Chat Interface */}
          <div className="bg-gray-800 rounded-xl p-6 max-w-4xl mx-auto">
            {/* Chat Header */}
            <div className="flex items-center mb-4 pb-4 border-b border-gray-700">
              <div className="w-8 h-8 bg-discord rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-hashtag text-white text-sm"></i>
              </div>
              <span className="text-white font-semibold">general</span>
            </div>
            
            {/* Demo Messages */}
            <div className="space-y-4">
              {/* User Message */}
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-user text-white text-sm"></i>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-green-400 font-semibold">User</span>
                    <span className="text-gray-500 text-sm">Today at 2:30 PM</span>
                  </div>
                  <p className="text-gray-300">Check out this cool tutorial: https://youtu.be/dQw4w9WgXcQ</p>
                </div>
              </div>
              
              {/* Bot Response */}
              <div className="flex items-start space-x-3">
                <img src={logoPath} 
                     alt="SumTube Bot Avatar" 
                     className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-discord font-semibold">SumTube</span>
                    <span className="bg-discord text-white text-xs px-2 py-1 rounded">BOT</span>
                    <span className="text-gray-500 text-sm">Today at 2:30 PM</span>
                  </div>
                  
                  {/* Summary Card */}
                  <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-youtube">
                    <div className="flex items-center space-x-2 mb-3">
                      <i className="fab fa-youtube text-youtube text-lg"></i>
                      <span className="text-white font-semibold">Video Summary</span>
                    </div>
                    
                    <h4 className="text-white font-medium mb-2">Never Gonna Give You Up - Rick Astley</h4>
                    <p className="text-gray-300 text-sm mb-3">
                      🎵 Classic 80s pop music video featuring Rick Astley's iconic dance moves and memorable chorus. The song became an internet phenomenon and cultural meme.
                    </p>
                    
                    <div className="text-gray-400 text-sm space-y-1">
                      <div><strong>Duration:</strong> 3:33</div>
                      <div><strong>Key Moments:</strong></div>
                      <div className="ml-4">
                        • <span className="text-youtube">0:07</span> - Iconic opening dance sequence<br />
                        • <span className="text-youtube">0:43</span> - Main chorus begins<br />
                        • <span className="text-youtube">2:15</span> - Bridge section with background vocals
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
