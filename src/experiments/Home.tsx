import { Activity, Aperture, ArrowRight, Atom, Box, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const features = [
    {
      title: '力学',
      icon: <Box className="text-blue-500" size={32} />,
      desc: '通过交互式模拟探索运动、力和能量。',
      link: '/mechanics/kinematics/uniform-motion',
    },
    {
      title: '电磁学',
      icon: <Zap className="text-yellow-500" size={32} />,
      desc: '实时可视化场、电荷和电路。',
      link: '/em/electric-field/coulomb',
    },
    {
      title: '波',
      icon: <Activity className="text-green-500" size={32} />,
      desc: '理解振动、叠加和波的传播。',
      link: '/waves/shm',
    },
    {
      title: '光学',
      icon: <Aperture className="text-indigo-500" size={32} />,
      desc: '研究光的传播、反射与折射现象。',
      link: '/optics/reflection-refraction',
    },
    {
      title: '近代物理',
      icon: <Atom className="text-pink-500" size={32} />,
      desc: '探索原子、能级与核反应的基本概念。',
      link: '/modern/atom',
    },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">物理可视化平台</h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          面向高中物理教育的高性能交互式实验室。从侧边栏选择一个模块开始。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Link key={i} to={f.link} className="block group">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all h-full flex flex-col">
              <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-600 mb-6 flex-1">{f.desc}</p>
              <div className="flex items-center text-blue-600 font-medium group-hover:translate-x-1 transition-transform">
                开始实验 <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
