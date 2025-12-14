import type { MenuItem } from '@/types/types';

export const physicsMenu: MenuItem[] = [
  {
    label: '力学',
    children: [
      {
        label: '运动学',
        children: [
          {
            label: '质点与参考系',
            path: '/mechanics/kinematics/reference-frame',
          },
          {
            label: '匀速直线运动',
            path: '/mechanics/kinematics/uniform-motion',
          },
          {
            label: '匀变速直线运动',
            path: '/mechanics/kinematics/uniform-acceleration',
          },
          {
            label: '自由落体',
            path: '/mechanics/kinematics/free-fall',
          },
          {
            label: '抛体运动',
            path: '/mechanics/kinematics/projectile',
          },
          {
            label: '运动的合成与分解',
            path: '/mechanics/kinematics/vector-decomposition',
          },
        ],
      },
      {
        label: '力与牛顿定律',
        children: [
          {
            label: '力的概念与分类',
            path: '/mechanics/forces/force-types',
          },
          {
            label: '受力分析',
            path: '/mechanics/forces/force-analysis',
          },
          {
            label: '共点力平衡',
            path: '/mechanics/forces/equilibrium',
          },
          {
            label: '牛顿第一定律',
            path: '/mechanics/forces/newton-first-law',
          },
          {
            label: '牛顿第二定律',
            path: '/mechanics/forces/newton-second-law',
          },
          {
            label: '牛顿第三定律',
            path: '/mechanics/forces/newton-third-law',
          },
          {
            label: '连接体与多物体问题',
            path: '/mechanics/forces/multi-body-system',
          },
        ],
      },
      {
        label: '功与能量',
        children: [
          {
            label: '功的概念与计算',
            path: '/mechanics/energy/work',
          },
          {
            label: '功率与机械效率',
            path: '/mechanics/energy/power',
          },
          {
            label: '动能与动能定理',
            path: '/mechanics/energy/kinetic-energy',
          },
          {
            label: '重力势能与弹性势能',
            path: '/mechanics/energy/potential-energy',
          },
          {
            label: '机械能守恒',
            path: '/mechanics/energy/mechanical-energy-conservation',
          },
        ],
      },
      {
        label: '动量',
        children: [
          {
            label: '冲量与动量',
            path: '/mechanics/momentum/impulse',
          },
          {
            label: '动量定理',
            path: '/mechanics/momentum/momentum-theorem',
          },
          {
            label: '动量守恒定律',
            path: '/mechanics/momentum/conservation',
          },
          {
            label: '碰撞问题',
            path: '/mechanics/momentum/collision',
          },
        ],
      },

      {
        label: '圆周运动与万有引力',
        children: [
          {
            label: '圆周运动基础',
            path: '/mechanics/circular-motion/basic',
          },
          {
            label: '向心力来源分析',
            path: '/mechanics/circular-motion/centripetal-force',
          },
          {
            label: '圆周运动临界问题',
            path: '/mechanics/circular-motion/critical-condition',
          },
          {
            label: '万有引力定律',
            path: '/mechanics/gravity/law',
          },
          {
            label: '天体运动与卫星',
            path: '/mechanics/gravity/orbital-motion',
          },
        ],
      },
    ],
  },
  {
    label: '电磁学',
    children: [
      {
        label: '电场',
        children: [
          { label: '电荷与库仑定律', path: '/em/electric-field/coulomb' },
          { label: '电场强度', path: '/em/electric-field/field-strength' },
          { label: '电势与电势能', path: '/em/electric-field/potential' },
          { label: '带电粒子在电场中的运动', path: '/em/electric-field/particle-motion' },
        ],
      },
      {
        label: '磁场',
        children: [
          { label: '磁场与磁感应强度', path: '/em/magnetic-field/basic' },
          { label: '洛伦兹力', path: '/em/magnetic-field/lorentz-force' },
          { label: '带电粒子在磁场中的运动', path: '/em/magnetic-field/particle-motion' },
        ],
      },
      {
        label: '电磁感应',
        children: [
          { label: '磁通量', path: '/em/induction/flux' },
          { label: '法拉第电磁感应定律', path: '/em/induction/faraday' },
          { label: '楞次定律', path: '/em/induction/lenz' },
        ],
      },
      {
        label: '交变电流',
        children: [
          { label: '正弦交流电', path: '/em/ac/sine' },
          { label: '有效值', path: '/em/ac/effective-value' },
          { label: '变压器', path: '/em/ac/transformer' },
        ],
      },
    ],
  },
  {
    label: '波动与振动',
    children: [
      { label: '简谐振动', path: '/waves/shm' },
      { label: '机械波', path: '/waves/mechanical-wave' },
      { label: '波的叠加与干涉', path: '/waves/interference' },
    ],
  },
  {
    label: '光学',
    children: [
      { label: '反射与折射', path: '/optics/reflection-refraction' },
      { label: '几何光学成像', path: '/optics/imaging' },
      { label: '光的干涉与衍射', path: '/optics/wave-optics' },
    ],
  },
  {
    label: '近代物理',
    children: [
      { label: '原子结构', path: '/modern/atom' },
      { label: '能级跃迁', path: '/modern/energy-level' },
      { label: '核反应基础', path: '/modern/nuclear' },
    ],
  },
];

export const menuItems: MenuItem[] = physicsMenu;
