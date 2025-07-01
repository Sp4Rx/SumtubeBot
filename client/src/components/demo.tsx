import logoPath from "@assets/logo_1751221870398.png";

export default function Demo() {
  return (
    <section className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">See SumTube in Action</h2>

          {/* Demo Chat Interface */}
          <div className="bg-gray-800 rounded-xl p-6 max-w-5xl mx-auto">
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
                    <span className="text-green-400 font-semibold">Developer</span>
                    <span className="text-gray-500 text-sm">Today at 08:05 PM</span>
                  </div>
                  <p className="text-gray-300">Check out this hackathon tutorial: https://youtu.be/hackathon-submission-guide</p>
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
                    <span className="text-gray-500 text-sm">Today at 08:05 PM</span>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-gray-700 rounded-lg p-6 border-l-4 border-youtube">
                    <div className="flex items-center space-x-2 mb-4">
                      <i className="fab fa-youtube text-youtube text-lg"></i>
                      <span className="text-white font-semibold">📺 How To Submit Your Hackathon Build</span>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      Submitting your project to the World's Largest Hackathon on Devpost involves a series of steps to ensure all necessary information is provided for judging and display. The deadline is June 30, 2025, at 5 PM ET.
                    </p>

                    <div className="text-gray-400 text-sm space-y-2">
                      <div><strong className="text-white">Key Timestamps:</strong></div>
                      <div className="space-y-1 ml-4">
                        <div>• <span className="text-youtube font-mono">0:18</span> - Access the hackathon homepage (worldslargesthackathon.devpost.com) and either Edit project or Create project.</div>
                        <div>• <span className="text-youtube font-mono">0:35</span> - Manage Team: Add teammates via email invite or sharing a secret link.</div>
                        <div>• <span className="text-youtube font-mono">0:43</span> - Project Overview (General Info): Enter Project Name, Elevator Pitch (short tagline), and upload a Thumbnail (JPG, PNG, GIF, 5MB max, 3.2 ratio).</div>
                        <div>• <span className="text-youtube font-mono">0:57</span> - Project Details (Public): Write your Project Story using Markdown (including inspiration, what it does, how it was built, challenges, accomplishments, future plans, and sponsor challenge compliance).</div>
                        <div>• <span className="text-youtube font-mono">1:45</span> - Built With: Tag languages, frameworks, platforms (e.g., bolt.new, Gemini, Netlify).</div>
                        <div>• <span className="text-youtube font-mono">1:49</span> - Try it Out Links: Provide public links like demo site, app store listing, or GitHub repo.</div>
                        <div>• <span className="text-youtube font-mono">1:57</span> - Project Media: Upload images and include a Video Demo Link (YouTube, Facebook, Vimeo, or Youku URL; approx. 3 minutes, public).</div>
                        <div>• <span className="text-youtube font-mono">2:13</span> - Additional Info (Judges/Organizers only): Provide project URL, confirm badge display, provide Bolt.new URL, state project start date.</div>
                        <div>• <span className="text-youtube font-mono">3:14</span> - Challenges: Select sponsor challenges and provide relevant IDs/information.</div>
                        <div>• <span className="text-youtube font-mono">3:32</span> - Bonus Prizes: Indicate if submitting for specific bonus prizes like "One-Shot Competition".</div>
                        <div>• <span className="text-youtube font-mono">3:50</span> - Submitter Type, Region, Country: Select Individual, Team, or Organization.</div>
                        <div>• <span className="text-youtube font-mono">4:08</span> - Feedback: Rate experience building with Bolt (0-10) and offer suggestions.</div>
                        <div>• <span className="text-youtube font-mono">4:13</span> - Submit Project: Agree to Official Rules and Devpost Terms of Service.</div>
                        <div>• <span className="text-youtube font-mono">4:16</span> - Verify your project page on Devpost, ensuring video is playable and formatting is correct.</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-600 text-xs text-gray-500">
                      <i className="fas fa-robot mr-1"></i>
                      AI-Powered Video Summary • SumTube • AI-Powered Video Summaries
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-white/80 mb-4">
              <i className="fas fa-magic mr-2"></i>
              Powered by Google Gemini AI for intelligent video analysis
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-400/30">Automatic Detection</span>
              <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-400/30">Timestamp Extraction</span>
              <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-400/30">Context-Aware Summaries</span>
              <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-sm border border-orange-400/30">Multi-Server Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
