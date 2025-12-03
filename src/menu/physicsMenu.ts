import type { MenuItem } from '../types';

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
