import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mic,
  FileText,
  Share2,
  Users,
  Star,
  Zap,
  ChevronRight,
  Youtube,
  FileAudio,
  MessageSquare,
  FileQuestion,
  File,
} from "lucide-react";
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-[#11ff88] text-2xl font-bold">NoteWave</h1>
          {/* You can add navigation items here if needed */}
        </div>
      </header>
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden animate-fade-in">
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,255,136,0.1),rgba(0,0,0,0))] animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.9),transparent,rgba(0,0,0,0.9))]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-block mt-4 mb-4 px-4 py-1 rounded-full bg-[#11ff88]/10 text-[#11ff88] text-sm animate-bounce">
            AI-Powered Meeting & Content Assistant
          </div>
          <h1 className="text-6xl font-bold mb-6 animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white via-[#11ff88] to-white">
            Transform Your Meetings and Content into
            <span className="block text-[#11ff88]">
              Actionable Intelligence
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in-up delay-300">
            Advanced AI technology that transcribes meetings, summarizes videos
            and PDFs, and extracts insights from your content in real-time
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth">
              <Button className="bg-[#11ff88] hover:bg-[#11ff88]/90 text-black px-8 py-6 text-lg rounded-lg animate-fade-in-up delay-500">
                Start Meeting
              </Button>
            </Link>
            <Link to="/youtube">
              <Button className="bg-[#11ff88] hover:bg-[#11ff88]/90 text-black px-8 py-6 text-lg rounded-lg animate-fade-in-up delay-500">
                Chat with YT video
              </Button>
            </Link>
            <Link to="/pdf">
              <Button className="bg-[#11ff88] hover:bg-[#11ff88]/90 text-black px-8 py-6 text-lg rounded-lg animate-fade-in-up delay-500">
                Chat with PDF
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black/50 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#11ff88]/10 text-[#11ff88] text-sm">
              Features
            </div>
            <h2 className="text-4xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Advanced Meeting & Content Intelligence
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to enhance your meetings, content
              understanding, and boost productivity
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-black/40 border border-white/10 hover:border-[#11ff88]/50 transition-colors hover:scale-105 transform duration-300"
              >
                <CardContent className="p-6">
                  <div className="text-[#11ff88] mb-4 animate-bounce">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-black/30 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#11ff88]/10 text-[#11ff88] text-sm">
              Process
            </div>
            <h2 className="text-4xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Streamlined Workflow
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Simple and efficient process to enhance your meetings, content
              understanding, and productivity
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-black/40 border border-white/10 p-6 rounded-lg transition-transform duration-300 group-hover:scale-105">
                  <div className="w-12 h-12 bg-[#11ff88]/10 rounded-lg flex items-center justify-center mb-4 group-hover:animate-pulse">
                    <span className="text-[#11ff88] font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-[#11ff88]/20 to-transparent transform translate-x-4 group-hover:animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-black/50 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#11ff88]/10 text-[#11ff88] text-sm">
              Testimonials
            </div>
            <h2 className="text-4xl font-bold mb-4 animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Trusted by Professionals
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              See what our users have to say about their experience
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-black/40 border border-white/10 hover:border-[#11ff88]/50 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-6">
                  <p className="text-gray-400 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#11ff88]/10 rounded-lg mr-4 animate-pulse" />
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-black/30 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="inline-block mb-4 px-4 py-1 rounded-full bg-[#11ff88]/10 text-[#11ff88] text-sm">
            Community
          </div>
          <h2 className="text-4xl font-bold mb-6 animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Join Our Growing Network
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Connect with professionals and enhance your productivity
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {communityFeatures.map((feature, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="text-[#11ff88] mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-center">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          <Button className="bg-[#11ff88] hover:bg-[#11ff88]/90 text-black px-8 py-6 text-lg rounded-lg animate-pulse">
            Join Community
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#11ff88]/10 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6 animate-text-shimmer bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            Ready to Transform Your Meetings and Content?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of professionals who have already enhanced their
            productivity
          </p>
          <Link to="/auth">
            <Button className="bg-[#11ff88] hover:bg-[#11ff88]/90 text-black px-8 py-6 text-lg rounded-lg animate-fade-in-up delay-500">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <Mic className="w-8 h-8" />,
    title: "Meeting Transcription",
    description:
      "Automatically transcribe and summarize your meetings in real-time",
  },
  {
    icon: <Youtube className="w-8 h-8" />,
    title: "YouTube Video Summarization",
    description:
      "Automatically summarize YouTube videos and extract key insights",
  },
  {
    icon: <FileQuestion className="w-8 h-8" />,
    title: "PDF Chat & Summarization",
    description:
      "Chat with your PDFs and get instant summaries of lengthy documents",
  },
  {
    icon: <File className="w-8 h-8" />,
    title: "Presentation Generation",
    description:
      "Convert video and PDF summaries into sleek PowerPoint presentations",
  },
  {
    icon: <FileAudio className="w-8 h-8" />,
    title: "Audio Summaries",
    description:
      "Listen to audio versions of your video and PDF summaries on-the-go",
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Interactive Content Chat",
    description:
      "Engage in conversations about your meetings, videos, and documents for deeper understanding",
  },
];

const steps = [
  {
    title: "Start Session",
    description:
      "Begin a meeting or upload your YouTube video link or PDF document",
  },
  {
    title: "AI Processing",
    description: "Our AI analyzes and extracts key information in real-time",
  },
  {
    title: "Generate Summaries",
    description:
      "Get concise summaries and insights from your meetings and content",
  },
  {
    title: "Interact",
    description: "Chat, listen, or convert summaries into presentations ",
  },
];

const testimonials = [
  {
    quote:
      "This tool has revolutionized how we handle meetings and content. The transcription and YouTube summaries are spot-on!",
    name: "Alex Johnson",
    role: "Product Manager",
  },
  {
    quote:
      "The PDF chat feature has made research so much easier. It's like having a personal assistant for every document and meeting.",
    name: "Dr. Emily Chen",
    role: "Researcher",
  },
  {
    quote:
      "Converting meeting and video summaries to presentations has saved me hours of work. It's a game-changer for my lectures and team meetings.",
    name: "Prof. Michael Davis",
    role: "University Lecturer",
  },
];

const communityFeatures = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Global Network",
    description: "Connect with professionals and content creators worldwide",
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: "Resource Library",
    description:
      "Access a vast library of summarized content, meeting transcripts, and insights",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "24/7 Support",
    description: "Get help from our expert support team anytime",
  },
];

export default LandingPage;
