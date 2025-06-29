export default function Features() {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Summaries",
      description: "Advanced AI analyzes video content to provide intelligent, contextual summaries with key insights and main points."
    },
    {
      icon: "⚡",
      title: "Instant Detection",
      description: "Automatically detects YouTube links in messages and responds with summaries in seconds, no commands needed."
    },
    {
      icon: "🕒",
      title: "Timestamp Support",
      description: "Includes relevant timestamps for key moments, making it easy to jump to important sections of the video."
    },
    {
      icon: "🔒",
      title: "Privacy Focused",
      description: "Only processes public YouTube videos and doesn't store personal data or conversation history."
    },
    {
      icon: "🌐",
      title: "Multi-Server Support",
      description: "Works across multiple Discord servers simultaneously with customizable permissions and settings."
    },
    {
      icon: "📊",
      title: "Smart Analytics",
      description: "Provides content categorization, sentiment analysis, and key topic extraction for better understanding."
    }
  ];

  return (
    <section className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="glass-card rounded-2xl p-8 shadow-xl feature-card">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
