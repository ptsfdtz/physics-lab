# 🧭 高中物理可视化平台

# **前端开发文档（React + pnpm）v1.0**

本文档用于指导本项目的持续开发，保证代码结构统一、模块可扩展、逻辑一致，以及所有新实验具有相同的交互体验。

---

# 1. 技术栈

本项目采用以下技术栈：

| 技术                          | 作用                               |
| ----------------------------- | ---------------------------------- |
| **Vite + React + TypeScript** | 开发框架与构建工具                 |
| **react-router-dom**          | 路由管理（首页 → 分类 → 实验页面） |
| **react-konva + konva**       | Canvas 渲染物理图形场景            |
| **framer-motion**             | 动画与过渡效果                     |
| **Zustand**                   | 全局轻量状态管理（主题、单位制等） |
| **MUI (Material UI)**         | UI 组件库（滑条、按钮、侧边栏）    |

安装命令（pnpm）：

```bash
pnpm add react-router-dom
pnpm add react-konva konva
pnpm add framer-motion
pnpm add zustand
pnpm add @mui/material @emotion/react @emotion/styled
```

---

# 2. 项目结构规范

```
physics-lab/
├── public/
│   └── icons/                     # 图标素材
│
├── src/
│   ├── app/
│   │   ├── router.tsx             # 路由表
│   │   ├── layout/                # 布局组件（侧边栏/顶部栏）
│   │   │   └── SidebarLayout.tsx
│   │   └── menu/                  # 左侧分类菜单
│   │       └── physicsMenu.ts
│   │
│   ├── components/                # 公共组件
│   │   ├── ui/                    # 基础 UI 组件
│   │   ├── control-panel/         # 参数调节面板（自动控件）
│   │   │   └── ParameterController.tsx
│   │   ├── canvas/                # Konva 封装
│   │   │   └── PhysicsCanvas.tsx
│   │   ├── chart/                 # 图表相关
│   │   └── physics/               # 通用物理展示组件
│   │       ├── VectorArrow.tsx
│   │       ├── GridBackground.tsx
│   │       └── MotionObject.tsx
│   │
│   ├── physics/                   # 物理计算核心
│   │   ├── kinematics.ts
│   │   ├── dynamics.ts
│   │   ├── electricity.ts
│   │   ├── waves.ts
│   │   └── utils.ts
│   │
│   ├── experiments/               # 各物理模块（重点）
│   │   ├── mechanics/
│   │   │   ├── kinematics/
│   │   │   │   ├── UniformMotion/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   ├── model.ts
│   │   │   │   │   └── renderer.tsx
│   │   │   ├── dynamics/
│   │   │   ├── energy/
│   │   ├── electromagnetism/
│   │   │   └── static-electric-field/
│   │   └── waves/
│   │
│   ├── hooks/
│   │   ├── useAnimationFrame.ts
│   │   └── usePhysicsModel.ts
│   │
│   ├── store/
│   │   └── userSettings.ts
│   │
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
```

---

# 3. 物理分类菜单规范（左侧导航）

使用统一的数据结构，保证未来扩展方便。

```ts
export const physicsMenu = [
  {
    label: '力学王国',
    children: [
      { label: '运动学', path: '/mechanics/kinematics' },
      { label: '牛顿定律', path: '/mechanics/newton-laws' },
    ],
  },
  {
    label: '电磁世界',
    children: [{ label: '静电场', path: '/em/electric-field' }],
  },
  {
    label: '波动宇宙',
    children: [{ label: '简谐运动', path: '/waves/shm' }],
  },
];
```

规则：

1. 一级：力学、电磁、波动、光学、原子
2. 二级：按教材知识结构命名
3. `path` 必须与路由结构一致
4. 新实验只需添加一行菜单结构

---

# 4. 物理实验模块规范（最核心）

每个实验模块必须包含 3 个文件：

```
model.ts        ← 定义参数（支持用户自定义）
renderer.tsx    ← 实验可视化界面（Konva）
index.tsx       ← 页面组件（控制面板 + Canvas）
```

### 4.1 model.ts（实验参数模型）

负责定义可调参数。

```ts
export interface UniformMotionModel {
  v: number; // 速度
  t: number; // 时间
}

export const defaultModel: UniformMotionModel = {
  v: 2,
  t: 0,
};
```

要求：

- 必须导出接口定义（参数类型）
- 必须导出默认参数
- 参数命名必须物理意义明确

---

### 4.2 renderer.tsx（Konva 渲染）

```tsx
import { Group, Circle } from 'react-konva';

export function UniformMotionRenderer({ model }: { model: any }) {
  const x = model.v * model.t * 50;

  return (
    <Group>
      <Circle x={x} y={100} radius={10} fill="red" />
    </Group>
  );
}
```

要求：

- 渲染逻辑必须无状态（靠 props）
- 禁止直接写物理公式 → 公式应放在 `/physics` 文件夹
- 尽量使用可复用组件（VectorArrow、GridBackground）

---

### 4.3 index.tsx（实验页面）

```tsx
export default function UniformMotionPage() {
  const [params, setParams] = useState(defaultModel);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ParameterController parameters={params} onChange={setParams} />

      <PhysicsCanvas>
        <UniformMotionRenderer model={params} />
      </PhysicsCanvas>
    </div>
  );
}
```

要求：

- 页面只做三件事：初始化参数 + 控制面板 + 渲染实验
- 所有参数必须通过 ParameterController 控制

---

# 5. 公共组件规范

### 5.1 UI 组件（通用）

放在 `src/components/ui/`

包括：

- Button
- Slider
- InputNumber
- Switch
- Card
- Tabs

UI 统一使用 MUI 风格。

---

### 5.2 PhysicsCanvas

封装 Konva 的统一画布组件。

要求：

- 全屏自适应
- 自动添加背景网格（可选）
- 自动管理舞台缩放（可选）

---

### 5.3 ParameterController（自动生成控制面板）

输入一个参数对象，即可自动渲染：

```ts
{
  v: 2,
  t: 0
}
```

自动生成：

- v（速度）：滑条 + 数字输入
- t（时间）：滑条 + 数字输入

开发者不需要重复写 UI，提高效率。

---

# 6. 物理计算核心规范

所有公式必须写在 `/src/physics` 中：

示例：

```ts
export function displacement(v: number, t: number) {
  return v * t;
}
```

规则：

- 不允许在 renderer 里写物理公式
- 不允许在页面直接写数学公式
- 所有计算公式要保持可测试、可复用

---

# 7. Hooks 开发规范

必须放在 `/src/hooks`：

### 必备钩子：

| Hook                | 用途                  |
| ------------------- | --------------------- |
| `useAnimationFrame` | 帧动画更新（t += dt） |
| `usePhysicsModel`   | 参数模型的通用绑定    |

---

# 8. 命名规范

### 文件夹命名（统一英文）

```
mechanics/
kinematics/
UniformMotion/
```

### 文件命名

| 类型     | 格式                              |
| -------- | --------------------------------- |
| 页面     | `index.tsx`                       |
| 模型     | `model.ts`                        |
| 渲染器   | `renderer.tsx`                    |
| 公用组件 | `帕斯卡命名法（VectorArrow.tsx）` |

---

# 9. 扩展开发规则

1. 新增实验时必须按“三件套结构”
2. 菜单同步更新 physicsMenu
3. 路由同步新增
4. 所有参数必须是可调节的（支持交互）
5. 所有渲染场景必须可复用（禁止重复画布逻辑）
6. 禁止把动画逻辑写入 physics 文件夹
7. 禁止在 renderer 中写 useState（保持纯渲染）
