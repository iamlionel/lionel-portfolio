"use client";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import {
  SiAndroid,
  SiFlutter,
  SiNextdotjs,
  SiPython,
  SiReact,
} from "react-icons/si";

const orbitIcons = [
  { Icon: SiReact, color: "#61DAFB", label: "React" },
  { Icon: SiNextdotjs, color: "#ffffff", label: "Next.js" },
  { Icon: SiAndroid, color: "#3DDC84", label: "Android" },
  { Icon: SiFlutter, color: "#54C5F8", label: "Flutter" },
  { Icon: SiPython, color: "#FFD43B", label: "Python" },
];

const RADIUS = 185;
const DURATION = 24;

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!r) return "255,255,255";
  return `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}`;
}

const Photo = () => {
  const total = orbitIcons.length;

  return (
    <div className="w-[300px] h-[300px] xl:w-[500px] xl:h-[500px] relative flex items-center justify-center select-none">
      {/* 轨道虚线圆 */}
      <div
        className="absolute rounded-full border border-dashed opacity-10"
        style={{
          width: RADIUS * 2 + 64,
          height: RADIUS * 2 + 64,
          borderColor: "#00ff99",
        }}
      />

      {/* ── 单一旋转环：所有图标挂在这一个 div 上 ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: DURATION, repeat: Infinity, ease: "linear" }}
      >
        {orbitIcons.map(({ Icon, color, label }, i) => {
          // 用三角函数精确计算每个图标的初始位置
          const angleDeg = (i / total) * 360;
          const angleRad = (angleDeg * Math.PI) / 180;
          const x = Math.sin(angleRad) * RADIUS;
          const y = -Math.cos(angleRad) * RADIUS;
          const rgb = hexToRgb(color);

          return (
            <motion.div
              key={label}
              className="absolute flex flex-col items-center gap-1 cursor-default group"
              style={{
                left: "50%",
                top: "50%",
                // 精确定位 + 自身居中
                translate: `calc(${x}px - 50%) calc(${y}px - 50%)`,
              }}
              // 反向自转：抵消父级旋转，保持图标正立
              animate={{ rotate: -360 }}
              transition={{
                duration: DURATION,
                repeat: Infinity,
                ease: "linear",
              }}
              whileHover={{ scale: 1.3, zIndex: 30 }}
            >
              <div
                className="p-2 xl:p-3 rounded-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `rgba(${rgb}, 0.12)`,
                  border: `1px solid rgba(${rgb}, 0.4)`,
                  boxShadow: `0 0 14px rgba(${rgb}, 0.3)`,
                }}
              >
                <Icon style={{ color, fontSize: 24 }} />
              </div>
              <span
                className="text-[10px] xl:text-xs font-semibold opacity-60 group-hover:opacity-100 transition-opacity"
                style={{ color }}
              >
                {label}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── 中心 AI 图标 ── */}
      <motion.div
        className="absolute z-20 flex flex-col items-center gap-2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="p-3 xl:p-4 rounded-2xl backdrop-blur-md"
          style={{
            background: "rgba(0,255,153,0.08)",
            border: "1px solid rgba(0,255,153,0.3)",
            boxShadow:
              "0 0 20px rgba(0,255,153,0.2), 0 0 40px rgba(0,255,153,0.08)",
          }}
        >
          <BrainCircuit size={36} color="#00ff99" strokeWidth={1.5} />
        </div>
        <span
          className="text-[10px] xl:text-xs font-bold tracking-widest uppercase"
          style={{ color: "#00ff99" }}
        >
          AI
        </span>
      </motion.div>
    </div>
  );
};

export default Photo;
