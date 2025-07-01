export default function SetupGuide() {
  return (
    <section id="setup" className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Setup Instructions</h2>

          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-start space-x-4 mb-8">
              <div className="flex-shrink-0 w-10 h-10 bg-discord text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-3">Add Bot to Your Server</h4>
                <p className="text-white/80 mb-4">
                  Click the "Add to Discord" button above and select your server. Make sure you have "Manage Server" permissions.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30 font-mono text-sm">
                  <span className="text-gray-400"># Required Permissions:</span><br />
                  <span className="text-white">• Send Messages<br />
                    • Read Message History<br />
                    • Use Slash Commands<br />
                    • Embed Links</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-4 mb-8">
              <div className="flex-shrink-0 w-10 h-10 bg-discord text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-3">Configure Channels</h4>
                <p className="text-white/80 mb-4">
                  SumTube automatically works in all channels where it has permissions. Use slash commands to configure settings.
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600/30 font-mono text-sm">
                  <span className="text-blue-400">/sumtube</span> <span className="text-yellow-400">settings</span> <span className="text-white">- Configure bot behavior</span><br />
                  <span className="text-blue-400">/sumtube</span> <span className="text-yellow-400">toggle</span> <span className="text-white">- Enable/disable in channel</span><br />
                  <span className="text-blue-400">/sumtube</span> <span className="text-yellow-400">help</span> <span className="text-white">- Show available commands</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start space-x-4 mb-8">
              <div className="flex-shrink-0 w-10 h-10 bg-discord text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-white mb-3">Start Using</h4>
                <p className="text-white/80 mb-4">
                  Simply share YouTube links in your channels and SumTube will automatically provide summaries!
                </p>
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-green-300">
                    <i className="fas fa-check-circle"></i>
                    <span className="font-semibold">That's it! No additional configuration needed.</span>
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
