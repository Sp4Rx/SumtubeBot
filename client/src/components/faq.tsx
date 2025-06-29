export default function FAQ() {
  const faqs = [
    {
      question: "How does SumTube work?",
      answer: "SumTube monitors messages for YouTube links, extracts video transcripts using YouTube's API, and uses advanced AI to generate intelligent summaries with key points and timestamps."
    },
    {
      question: "Is there a rate limit?",
      answer: "Yes, to prevent abuse, there's a rate limit of 10 summaries per channel per hour. This ensures fair usage across all servers."
    },
    {
      question: "What if a video doesn't have captions?",
      answer: "SumTube can only summarize videos with available transcripts/captions. If a video doesn't have captions, the bot will inform you that summarization isn't possible."
    },
    {
      question: "Is my data stored?",
      answer: "No, SumTube doesn't store conversation data or video content. It only processes publicly available video information to generate summaries."
    }
  ];

  return (
    <section className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
