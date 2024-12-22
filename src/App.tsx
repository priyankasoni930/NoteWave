import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Meeting from "./pages/Meeting";
import Auth from "./pages/Auth";
import LandingPage from "./pages/LandingPage";
import YoutubeFeatures from "./pages/YoutubeFeatures";
import PdfFeatures from "./pages/PdfFeatures";
import MeetingChat from "./pages/MeetingChat";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Restore last visited route when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const lastRoute = localStorage.getItem('lastRoute');
        if (lastRoute) {
          window.history.pushState({}, '', lastRoute);
        }
      }
    };

    // Save current route when tab becomes hidden
    const handleBeforeUnload = () => {
      localStorage.setItem('lastRoute', window.location.pathname);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  if (isAuthenticated === null) {
    return null; // Loading state
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/meeting"
              element={
                isAuthenticated ? (
                  <Meeting />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/meeting/chat/:meetingId"
              element={
                isAuthenticated ? (
                  <MeetingChat />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/meeting/flashcards/:meetingId"
              element={
                isAuthenticated ? (
                  <FlashcardsPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/meeting/quiz/:meetingId"
              element={
                isAuthenticated ? (
                  <QuizPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/youtube"
              element={
                isAuthenticated ? (
                  <YoutubeFeatures />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/youtube/flashcards"
              element={
                isAuthenticated ? (
                  <FlashcardsPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/youtube/quiz"
              element={
                isAuthenticated ? (
                  <QuizPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/pdf"
              element={
                isAuthenticated ? (
                  <PdfFeatures />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/pdf/flashcards"
              element={
                isAuthenticated ? (
                  <FlashcardsPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/pdf/quiz"
              element={
                isAuthenticated ? (
                  <QuizPage />
                ) : (
                  <Navigate to="/auth" replace />
                )
              }
            />
            <Route
              path="/auth"
              element={
                !isAuthenticated ? (
                  <Auth />
                ) : (
                  <Navigate to="/meeting" replace />
                )
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;