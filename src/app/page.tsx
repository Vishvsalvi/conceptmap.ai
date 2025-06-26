import React from 'react'
import Link from 'next/link'
import { signOut, signIn, auth } from "@/auth"
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Rocket } from 'lucide-react'
import Image from 'next/image'



const page = async () => {
  const isAuth = await auth();

  return (
    <div className="min-h-screen ">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-4 md:py-2 md:px-6">
        {/* <Link href="/" className="text-lg md:text-xl font-semibold"> */}
          <span className='font-bold text-gray-800' >
          ConceptMap.AI
            </span>
        {/* </Link> */}
        <div className="flex items-center gap-2 md:gap-4">
          {
            isAuth && (
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <Button variant={'outline'} className='text-sm' type="submit"><LogOut/> Sign Out</Button>
              </form>
            )
          }
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-12 sm:pt-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-[55rem] mx-auto text-center">
            <h1 className="px-6 text-lg text-gray-600"> Create Concept Maps with AI</h1>
            <div className="tracking-tighter mt-2 text-4xl font-bold leading-tight text-gray-900 sm:leading-tight sm:text-5xl lg:text-6xl lg:leading-tight ">
              Simplify Learning, Amplify Understanding With AI
            </div>

            <div className="px-8 mt-9 flex flex-col sm:flex-row sm:items-center sm:justify-center sm:px-0 sm:space-x-5 space-y-4 sm:space-y-0">
              {isAuth ? (
                <>
                  <Link href="/map" passHref>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Explore Now
                    </Button>
                  </Link>

                  <Link
                    href="/library"
                    passHref
                    ><Button
                    variant={"outline"}
                    className="border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-semibold py-2 px-6 rounded-lg shadow-sm transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                    >
                      Library
                    </Button>
                  </Link>
                </>
              ) : (
                <form
                  action={async () => {
                    "use server"
                    await signIn()
                  }}
                >
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign in to get started
                  </Button>
                </form>
              )}
            </div>

            <p className="my-8 text-gray-500">Its free to use, no credit card required</p>
          </div>
        </div>

        <div className="pb-12 bg-white">
          <div className="relative">
            <div className="absolute inset-0 h-2/3"></div>
            <div className="relative mx-auto">
              <div className="lg:max-w-6xl lg:mx-auto">
                {/* Video component */}
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-xl">
                  <video 
                    className="w-full h-full object-cover"
                    autoPlay={true}
                    loop  
                    playsInline
                    controls
                    muted={true}
                    >
                    <source src="/conceptmapai-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features */}
      <section>
      {featureContent.map((feature, index) => (
        <ResearchHub 
        key={index} 
        feature={feature} 
        isReversed={index % 2 !== 0}
        />
      ))}
      </section>
      <section className='mt-10' >
        <Footer />
      </section>

    </div>
  )
}

export default page

const featureContent = [
  {
    title: "Enhance Learning with YouTube Integration",
    description: `
      <p>
        Seamlessly embed <span class="font-semibold">YouTube videos</span> into your concept maps for a richer, interactive learning experience.
      </p>
    `,
    videoSrc: "/yt-demo.mp4",
    bgColor: "#FAF5FF",
  },
  {
    title: "Generate Blogs, Essays, and Summaries Instantly",
    description: `
    <p>
    Leverage the power of <span class="font-semibold">AI</span> to craft high-quality summaries, essays, and blogs directly from your concept maps.
    </p>
    `,
    videoSrc: "/blog-demo.mp4",
    bgColor: "#EFF6FF",
  },
  {
    title: "Discover New Concepts and Ideas",
    description: `
    <p>
    Utilize <span class="font-semibold">AI tools</span> to uncover fresh concepts and insights, expanding the possibilities of your concept maps.
    </p>
    `,
    videoSrc: "/term-demo.mp4",
    bgColor: "#F5F5F5",
  }
];

interface FeatureContent {
  title: string;
  description: string;
  videoSrc: string;
  bgColor: string;
}

interface ResearchHubProps {
  feature: FeatureContent;
  isReversed?: boolean;
}

function ResearchHub({ feature, isReversed = false }: ResearchHubProps) {
  return (
    <div style={{ backgroundColor: feature.bgColor }} className={`min-h-screen flex items-center justify-center`}>
      <div className={`max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
        {/* Browser Window Mockup */}
        <div className={`relative w-full aspect-[16/10] bg-white rounded-lg shadow-2xl overflow-hidden ${isReversed ? 'lg:col-start-2' : ''}`}>
          
          {/* Browser Content - Mind Map */}
          <div className=" h-[calc(100%-2rem)] bg-white">
          <video 
                    className="w-full h-full object-cover"
                    autoPlay={true}
                    loop  
                    playsInline
                    controls
                    muted={true}
                  >
                    <source src={feature.videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
          </div>
        </div>

        {/* Content */}
        <div className={`space-y-6 ${isReversed ? 'lg:col-start-1' : ''}`}>
          <span className="text-[#1e293b] text-3xl font-bold leading-tight">
            {feature.title}
          </span>
          <div className="text-lg text-gray-700 space-y-4" dangerouslySetInnerHTML={{ __html: feature.description }} />
        </div>
      </div>
    </div>
  )
}


const navigation = {
  connect: [
    {
      name: 'Twitter',
      href: 'https://twitter.com/SalviVishv',
    },
    {
      name: 'Github',
      href: 'https://www.github.com/vishvsalvi',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/vishvsalvi/',
    },
  ],
 
}

const Footer = () => {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="mx-auto font-inter w-full max-w-7xl"
    >
      <h2 id="footer-heading" className="sr-only">
        Conceptmap.ai
      </h2>
      <div className="mx-auto max-w-7xl px-2">
        <div className="flex flex-col justify-between lg:flex-row">
          <div className="space-y-8">
            <Image
              priority={true}
              unoptimized={true}
              width={100}
              height={40}
              src="/logo.png"
              alt="ConceptMap.ai"
              className="w-[10rem]"
            />
            <p className="text-md max-w-xs leading-6 text-gray-700 dark:text-gray-300">
              This application is powered by Gemini, the content generated is not guaranteed to be accurate or up-to-date.
            </p>
            <div className="flex space-x-6 text-sm text-gray-700  dark:text-gray-300">
              <div>Made with ❤️ by Vishv.</div>
            </div>
          </div>
          {/* Navigations */}
          <div className="mt-16 grid grid-cols-2 gap-14 md:grid-cols-2 lg:mt-0 xl:col-span-2">
            <div className="md:mt-0">
              <span className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-200">
                Connect
              </span>
              <div className="mt-6 space-y-4">
                {navigation.connect.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm leading-6 text-gray-700 hover:text-gray-900 dark:text-gray-600 hover:dark:text-gray-200"
                    >
                      {item.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div>
           
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-gray-100/10">
          <p className="text-xs leading-5 text-gray-700 dark:text-gray-300">
          </p>
        </div>
      </div>
    </footer>
  )
}