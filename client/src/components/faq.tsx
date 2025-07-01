export default function FAQ() {
  const faqs = [
    {
      question: "How does SumTube work?",
      answer: "SumTube monitors messages for YouTube links and uses Google's Gemini AI to directly analyze the video content, generating intelligent summaries with key points and timestamps."
    },
    {
      question: "Is there a rate limit?",
      answer: "No, there are no rate limits! The bot processes every YouTube link immediately for maximum responsiveness and user experience."
    },
    {
      question: "What if a video doesn't have captions?",
      answer: "SumTube uses Google's Gemini AI to directly analyze video content, so it can process videos even without captions by analyzing the video's visual and audio content."
    },
    {
      question: "Is my data stored?",
      answer: "No, SumTube doesn't store conversation data or video content. It only processes publicly available video information to generate summaries."
    }
  ];

  return (
    <section className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white/10 border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all duration-300">
                <h4 className="text-lg font-semibold text-white mb-2">{faq.question}</h4>
                <p className="text-white/80">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
