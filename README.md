```
physics-lab/
├── public/
│   └── icons/                     # 学科 & 实验图标
│
├── src/
│   ├── app/                       # App 入口区域
│   │   ├── router.tsx             # 路由配置
│   │   ├── layout/                # 布局组件（侧边栏等）
│   │   │   └── SidebarLayout.tsx
│   │   └── menu/                  # 左侧物理分类菜单的数据结构
│   │       └── physicsMenu.ts
│   │
│   ├── components/                # 公共组件（最关键）
│   │   ├── ui/                    # 基础 UI（Slider、Button…）
│   │   ├── control-panel/         # 参数控制（自动生成控件）
│   │   │   └── ParameterController.tsx
│   │   ├── canvas/                # Konva Canvas 封装
│   │   │   └── PhysicsCanvas.tsx
│   │   ├── chart/                 # 图表组件
│   │   └── physics/               # 可复用的物理可视化组件
│   │       ├── VectorArrow.tsx
│   │       ├── GridBackground.tsx
│   │       └── MotionObject.tsx
│   │
│   ├── physics/                   # 物理计算核心（你未来的武器库）
│   │   ├── kinematics.ts          # 运动学
│   │   ├── dynamics.ts            # 牛顿定律
│   │   ├── electricity.ts         # 电场
│   │   ├── waves.ts               # 波动
│   │   └── utils.ts               # 公共数学工具
│   │
│   ├── experiments/               # 每个物理实验模块（重点）
│   │   ├── mechanics/
│   │   │   ├── kinematics/
│   │   │   │   ├── UniformMotion/
│   │   │   │   │   ├── index.tsx       # 页面
│   │   │   │   │   ├── model.ts        # 参数模型（可自定义）
│   │   │   │   │   └── renderer.tsx    # 渲染逻辑（Konva 或动画）
│   │   │   ├── dynamics/
│   │   │       └── NewtonLaws/
│   │   │           ├── index.tsx
│   │   │           ├── model.ts
│   │   │           └── renderer.tsx
│   │   ├── electromagnetism/
│   │   │   └── static-electric-field/
│   │   │       ├── index.tsx
│   │   │       ├── model.ts
│   │   │       └── renderer.tsx
│   │   └── waves/
│
│   ├── hooks/
│   │   ├── useAnimationFrame.ts   # 物理动画更新
│   │   └── usePhysicsModel.ts     # 通用参数绑定
│
│   ├── store/                     # Zustand 全局状态
│   │   └── userSettings.ts        # 用户自定义配置（单位、主题等）
│
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
│
└── package.json
```
