"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WorkSliderBtns from "@/components/WorkSliderBtns";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsArrowUpRight, BsGithub } from "react-icons/bs";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
const projects = [
  {
    num: "01",
    category: "Lyra Voice Assistant",
    title: "project 1",
    description:
      "Based on self-developed full-chain speech and language interaction technology，LLM（AISPEECH DFM）and big data, AISpeech has launched 1+N Reliable Distributed LLM Agent System, connecting language processing and model ecosystems, forming an ecological circle for the automotive vertical domain. ",
    stack: [
      { name: "Android" },
      { name: "Kotlin" },
      { name: "AISpeech DUI" },
      { name: "AISpeech DFM" },
    ],
    image: "/assets/work/thumb1.png",
    live: "https://en.aispeech.com/carbusiness",
    github: "",
  },
  {
    num: "02",
    category: "AI TV Assistant",
    title: "project 2",
    description:
      "A smart TV voice interaction solution based on IFlyTek's advanced speech recognition and natural language processing. It enables seamless voice control, multi-device interconnection, and personalized smart home experiences for the big-screen ecosystem.",
    stack: [
      { name: "Android" },
      { name: "IOT" },
      { name: "Remote Controller" },
    ],
    image: "/assets/work/thumb2.png",
    live: "http://tvoice.iflytek.com/product/studio/ai-tv-assistant/",
    github: "",
  },
  {
    num: "03",
    category: "IFlytek Smart Assignments",
    title: "project 3",
    description:
      "An intelligent homework and assessment platform for K-12 education. Utilizing AI-driven data analysis to provide personalized learning paths, automated grading, and insightful performance tracking for both teachers and students.",
    stack: [
      { name: "Android" },
      { name: "Kotlin" },
      { name: "AI Data Analysis" },
    ],
    image: "/assets/work/thumb3.png",
    live: "https://edu.iflytek.com/solution/school/smart-assignments",
    github: "",
  },
  {
    num: "04",
    category: "Biometric Intelligent Hardware & SDK",
    title: "project 4",
    description:
      "A comprehensive biometric identification solution integrating facial recognition and fingerprint scanning with hardware systems. Built using Android and Kotlin to provide secure, high-performance access control and attendance management for enterprise environments.",
    stack: [
      { name: "Android" },
      { name: "Kotlin" },
      { name: "JNI" },
      { name: "Deep Learning" },
    ],
    image: "/assets/work/thumb4.png",
    live: "https://www.biometric.net.cn/home",
    github: "",
  },
];

const Work = () => {
  const [project, setProject] = useState(projects[0]);

  const handleSlideChange = (swiper) => {
    const currentIndex = swiper.activeIndex;
    setProject(projects[currentIndex]);
  };
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0, duration: 0.1, ease: "easeIn" },
      }}
      className="min-h-[80vh] flex flex-col justify-center py-12 xl:px-0"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row xl:gap-[30px]">
          <div className="w-full xl:w-[50%] xl:h-[460px] flex flex-col xl:justify-between order-2 xl:order-none">
            <div className="flex flex-col gap-[30px] h-[50%]">
              <div className="text-8xl leading-none font-extrabold text-transparent text-outline">
                {project.num}
              </div>
              <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500 capitalize">
                {project.category}
              </h2>
              <p className="text-white/60">{project.description}</p>
              <ul className="flex gap-4">
                {project.stack.map((item, index) => {
                  return (
                    <li key={index} className="text-xl text-accent">
                      {item.name}
                      {index != project.stack.length - 1 && ","}
                    </li>
                  );
                })}
              </ul>
              <div className="border border-white/20"></div>
              <div className="flex items-center gap-4">
                <Link
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                        <BsArrowUpRight className="text-white text-3xl group-hover:text-accent" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Live Project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Link>
                {project.github && (
                  <Link
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger className="w-[70px] h-[70px] rounded-full bg-white/5 flex justify-center items-center group">
                          <BsGithub className="text-white text-3xl group-hover:text-accent" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Github repository</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="w-full xl:w-[50%]">
            <Swiper
              spaceBetween={30}
              slides-per-view={1}
              className="xl:h-[520px] mb-12"
              onSlideChange={handleSlideChange}
            >
              {projects.map((project, index) => {
                return (
                  <SwiperSlide key={index} className="w-full">
                    <div className="h-[460px] relative group flex justify-center items-center bg-pink-50/20">
                      <div className="absolute top-0 bottom-0 w-full h-full bg-black/10 z-10"></div>
                      <div className="relative w-full h-full">
                        <Image
                          src={project.image}
                          fill
                          className="object-fill"
                          alt=""
                        />
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
              <WorkSliderBtns
                containerStyles="flex gap-2 absolute right-0 bottom-[calc(50%_-_22px)] xl:bottom-0 z-20 w-full justify-between xl:w-max xl:justify-none"
                btnStyles="bg-accent hover:bg-accent-hover text-primary text-[22px] w-[44px] h-[44px] flex justify-center items-center transition-all"
              />
            </Swiper>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Work;
