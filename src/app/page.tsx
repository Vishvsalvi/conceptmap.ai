import React from 'react'
import { signOut, signIn, auth } from "@/auth"
import Hero from '@/components/landing/hero'
import Features from '@/components/landing/features'
import Footer from '@/components/landing/footer'
import { LandingNavbar } from '@/components/landing/Navbar'

const Page = async () => {
  const session = await auth();
  const isAuth = !!session;

  async function handleSignOut() {
    'use server'
    await signOut();
  }

  async function handleSignIn() {
    'use server'
    await signIn();
  }

  return (
    <div className='relative w-full'>
     
  {/* Your Content/Components */}
      <LandingNavbar isAuth={isAuth} onSignOut={handleSignOut} onSignIn={handleSignIn} />
      <div className="min-h-screen w-full bg-[#f8fafc] relative">
  {/* Top Fade Grid Background */}
  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
      backgroundSize: "20px 30px",
      WebkitMaskImage:
        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
      maskImage:
        "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
    }}
  />
     {/* Your Content/Components */}
      <Hero isAuth={isAuth} onSignIn={handleSignIn} />
      </div>
      <Features />
      <Footer />
    </div>
  )
}

export default Page;