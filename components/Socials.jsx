import Link from 'next/link';
import React from 'react';
import { FaGithub, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';

const socials = [
  { icon: <FaGithub />, path: 'https://github.com/iamlionel' },
  {
    icon: <FaLinkedinIn />,
    path: 'https://www.linkedin.com/in/lionel-fang-64410528b',
  },
  { icon: <FaTwitter />, path: 'https://x.com/iamlionel123' },
];
const Socials = ({ containerStyles, iconStyles }) => {
  return (
    <div className={containerStyles}>
      {socials.map((item, index) => {
        return (
          <Link key={index} className={iconStyles} href={item.path}>
            {item.icon}
          </Link>
        );
      })}
    </div>
  );
};

export default Socials;
