import { useState } from 'react';
import { MessageSquare, Code, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmbedCodeDialog } from '@/components/EmbedCodeDialog';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const [showEmbedDialog, setShowEmbedDialog] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: "Smart AI Conversations",
      description: "Powered by advanced AI that understands context and provides helpful responses"
    },
    {
      icon: Code,
      title: "Easy Integration",
      description: "Copy and paste our widget code to add chat to any website in seconds"
    },
    {
      icon: Share2,
      title: "Shareable Links",
      description: "Create shareable chat links that work anywhere, anytime"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatBot Pro
            </span>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            Dashboard
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              The Future of
              <br />
              <span className="relative">
                Customer Chat
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-scale-in"></div>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your website with an intelligent AI chatbot that engages visitors, 
              answers questions, and converts leads 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-subtle"
                onClick={() => navigate('/dashboard')}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Try Live Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50"
                onClick={() => setShowEmbedDialog(true)}
              >
                <Code className="mr-2 h-5 w-5" />
                Get Widget Code
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Choose Our ChatBot?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern businesses that want to provide exceptional customer experiences
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full w-fit mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Website?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses already using our AI chatbot
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold rounded-xl"
              onClick={() => navigate('/dashboard')}
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-6 text-lg font-semibold rounded-xl"
              onClick={() => navigate('/chat')}
            >
              Try Chat Now
            </Button>
          </div>
        </div>
      </section>

      {/* Embed Code Dialog */}
      <EmbedCodeDialog 
        open={showEmbedDialog} 
        onOpenChange={setShowEmbedDialog} 
      />
    </div>
  );
};

export default Landing;
