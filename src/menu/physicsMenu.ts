import type { MenuItem } from '../types/types';

export const physicsMenu: MenuItem[] = [
  {
    label: '力学',
    children: [
      {
        label: '运动学',
        children: [
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
        ],
      },
      {
        label: '力与机械',
        children: [
          {
            label: '受力分析',
            path: '/mechanics/forces/force-analysis',
          },
          {
            label: '功和能',
            path: '/mechanics/forces/work-energy',
          },
          {
            label: '简单机械',
            path: '/mechanics/forces/simple-machines',
          },
        ],
      },
      {
        label: '动力学',
        children: [
          {
            label: '牛顿运动定律',
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
        path: '/em/electric-field',
      },
    ],
  },
  {
    label: '波',
    children: [
      {
        label: '简谐运动',
        path: '/waves/shm',
      },
    ],
  },
];

export const menuItems: MenuItem[] = physicsMenu;
