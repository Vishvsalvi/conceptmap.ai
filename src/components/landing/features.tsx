import {
    Paintbrush,
    Rocket,
    Github,
    Search,
    Pencil,
    Puzzle,
  } from 'lucide-react';
  
  const features = [
    {
      icon: <Pencil className="h-6 w-6" />,
      title: 'Beginner-Friendly',
      desc: 'User-friendly interface for easy navigation and understanding.',
    },
    {
      icon: <Puzzle className="h-6 w-6" />,
      title: 'Passive Learning',
      desc: 'Interactive learning experience by building your own concept maps.',
    },
    {
      icon: <Paintbrush className="h-6 w-6" />,
      title: 'Easily Customizable',
      desc: 'Drag and place your own blocks of information anywhere you want',
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: 'Discover new concepts',
      desc: 'Explore new concepts and ideas with ease and clarity.',
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: 'Never scroll for studying',
      desc: 'Zoom in and out of your study canvas to see the big picture for quick revision.',
    },
    {
      icon: <Github className="h-6 w-6" />,
      title: 'Fully Open Source',
      desc: 'Your can clone the project and run it locally. Customize it to your liking.',
    },
  ];
  export default function Features() {
    return (
      <section id="features" className="relative py-14">
        <div className="mx-auto max-w-screen-lg px-4 md:px-8">
          <div className="relative mx-auto max-w-2xl sm:text-center">
            <div className="relative z-10">
              <h3 className="text-violet-500 font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl">
                Designed to help you <br /> study smarter
              </h3>
              <p className="font-geist text-foreground/60 mt-3">
                Never get lost in a sea of AI chats again.
              </p>
            </div>
            <div
              className="absolute inset-0 mx-auto h-44 max-w-xs blur-[118px]"
            ></div>
          </div>
          <hr className="bg-foreground/30 mx-auto mt-5 h-px w-1/2" />
          <div className="relative mt-12">
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((item, idx) => (
                <li
                  key={idx}
                  className="transform-gpu space-y-3 rounded-xl border bg-transparent p-4"
                >
                  <div className="text-primary w-fit transform-gpu rounded-full border p-4">
                    {item.icon}
                  </div>
                  <h4 className="font-geist text-lg font-bold tracking-tighter">
                    {item.title}
                  </h4>
                  <p className="text-gray-500">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }
  