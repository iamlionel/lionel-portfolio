"use client";
import Photo from "@/components/Photo";
import Socials from "@/components/Socials";
import Stats from "@/components/Stats";
import { Button } from "@/components/ui/button";
import { FiDownload } from "react-icons/fi";

import { useTranslation } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useTranslation();
  const handleDownloadCV = () => {
    window.open("/assets/resume.pdf", "_blank", "noopener,noreferrer");
  };

  return (
    <section className="h-full xl:h-[calc(100vh-140px)] flex flex-col justify-center">
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row items-center justify-between xl:pt-4 xl:pb-8">
          <div className="text-center xl:text-left order-2 xl:order-none">
            <h1 className="h1 mb-4 mt-2">
              {t("home.greeting")} <br />{" "}
              <span className="text-accent">Lionel Fang</span>
            </h1>
            <p className="max-w-[500px] mb-6 text-white/80">
              {t("home.description")}
            </p>

            {/* btn and socials */}
            <div className="flex flex-col xl:flex-row items-center gap-8">
              <Button
                variant="outline"
                size="lg"
                className="uppercase flex items-center gap-2"
                onClick={handleDownloadCV}
              >
                <span>{t("home.downloadCv")}</span>
                <FiDownload className="text-xl" />
              </Button>
              <div className="mb-0 xl:mb-0">
                <Socials
                  containerStyles="flex gap-6"
                  iconStyles="w-9 h-9 border border-accent rounded-full items-center justify-center flex text-accent text-base hover:bg-accent hover:text-primary hover:transition-all duration-500"
                />
              </div>
            </div>
          </div>
          <div className="order-1 xl:order-none mb-4 xl:mb-0">
            <Photo />
          </div>
        </div>
        <div className="mt-12 xl:mt-16">
          <Stats />
        </div>
      </div>
    </section>
  );
}
