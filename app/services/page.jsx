"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { BsArrowDownRight } from "react-icons/bs";

const services = [
  {
    num: "01",
    title: "Android Development",
    description:
      "Proficient in building robust Android applications using Java and Kotlin. Focusing on material design principles, efficient API integration, and optimized performance for various devices.",
    href: "",
  },
  {
    num: "02",
    title: "Web Development",
    description:
      "Expertise in modern frontend frameworks like React and Next.js. Crafting responsive, performant web applications with clean, maintainable code and intuitive user interfaces.",
    href: "",
  },
  {
    num: "03",
    title: "Backend Development",
    description:
      "Building scalable, high-performance server-side applications with Node.js and Python. Designing RESTful APIs, managing databases, and deploying containerized services with Docker for reliable production environments.",
    href: "",
  },
  {
    num: "04",
    title: "AI Engineering",
    description:
      "Developing AI-powered applications leveraging large language models (LLMs), RAG pipelines, and intelligent agents. Integrating OpenAI, LangChain, and vector databases to build smart, context-aware product experiences.",
    href: "",
  },
];

const Services = () => {
  return (
    <>
      <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0, duration: 0.1, ease: "easeIn" },
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-[60px]"
          >
            {services.map((service, index) => {
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col justify-center gap-6 group"
                >
                  <div className="w-full flex justify-between items-center">
                    <div className="text-5xl font-extrabold text-outline text-transparent group-hover:text-outline-hover">
                      {service.num}
                    </div>
                    <Link
                      href={service.href}
                      className="w-[70px] h-[70px] rounded-full bg-white group-hover:bg-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45"
                    >
                      <BsArrowDownRight className="text-primary text-3xl" />
                    </Link>
                  </div>
                  <h2 className="text-[42px] font-bold leading-none text-white group-hover:text-accent transition-all duration-500">
                    {service.title}
                  </h2>
                  <p>{service.description}</p>
                  <div className="border-b border-white/20 w-full"></div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;
