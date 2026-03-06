"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { FaMailBulk, FaPhoneAlt, FaTelegram } from "react-icons/fa";

import { useTranslation } from "@/context/LanguageContext";
import { useState } from "react";

const infoIcons = [
  <FaPhoneAlt key="phone" />,
  <FaMailBulk key="mail" />,
  <FaTelegram key="telegram" />,
];

const Contact = () => {
  const { t } = useTranslation();
  const translations_contact = t("contact");
  const info = infoIcons.map((icon, index) => ({
    icon,
    title: translations_contact.info[index].title,
    description: translations_contact.info[index].description,
  }));

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (val) => {
    setFormData((prev) => ({ ...prev, service: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("https://formspree.io/f/xreygzjo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          service: "",
          message: "",
        });
        // Reset status after 3 seconds
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        const data = await response.json();
        console.error("Formspree Error:", data);
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact Form Error:", error);
      setStatus("error");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: { delay: 0, duration: 0.1, ease: "easeIn" },
      }}
      className="py-1"
    >
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-[30px]">
          <div className="xl:w-[54%] order-2 xl:order-none">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6 p-6 bg-[#27272c] rounded-xl"
            >
              <h3 className="text-4xl text-accent">{t("contact.title")}</h3>
              <p className="text-white/60">{t("contact.subtitle")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="firstname"
                  type="text"
                  placeholder={t("contact.firstname")}
                  value={formData.firstname}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastname"
                  type="text"
                  placeholder={t("contact.lastname")}
                  value={formData.lastname}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  placeholder={t("contact.email")}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="phone"
                  type="text"
                  placeholder={t("contact.phone")}
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <Select onValueChange={handleServiceSelect} required>
                <SelectTrigger>
                  <SelectValue placeholder={t("contact.selectService")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("contact.selectService")}</SelectLabel>
                    {translations_contact.services.map((service, index) => (
                      <SelectItem key={index} value={service}>
                        {service}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Textarea
                name="message"
                className="h-[200px]"
                placeholder={t("contact.message")}
                value={formData.message}
                onChange={handleChange}
                required
              />
              <div className="flex items-center gap-6">
                <Button
                  type="submit"
                  size="md"
                  className="max-w-40"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? t("contact.sending")
                    : t("contact.send")}
                </Button>
                {status === "success" && (
                  <p className="text-accent text-sm animate-pulse">
                    {t("contact.success")}
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-sm">{t("contact.error")}</p>
                )}
              </div>
            </form>
          </div>
          <div className="flex-1 flex items-center xl:justify-center order-1 xl:order-none mb-8 xl:mb-0">
            <ul className="flex flex-col gap-10">
              {info.map((item, index) => {
                return (
                  <li key={index} className="flex items-center gap-6">
                    <div className="w-[52px] h-[52px] xl:w-[72px] xl:h-[72px] bg-[#27272c] text-accent rounded-md flex items-center justify-center">
                      <div className="text-[28px]">{item.icon}</div>
                    </div>
                    <div className="flex-1">
                      <p className="text-white/60">{item.title}</p>
                      <h3 className="text-xl">{item.description}</h3>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;
