"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Hero from '@/components/layout/Hero';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/molecules/LoadingSpinner';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  // Don't render landing page if user is authenticated
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Footer />
    </div>
  );
}
