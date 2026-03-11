# KeyTrader 颜色使用规范

> **版本**: v1.0.0
> **更新时间**: 2026-03-09
> **目的**: 消除硬编码颜色值，建立统一的颜色使用规范

---

## 📋 核心原则

1. **禁止硬编码 HSL 颜色值** - 所有颜色必须使用语义化类或 CSS 变量
2. **优先使用 Tailwind 语义化类** - 提高代码可读性和维护性
3. **复杂渐变使用 CSS 类** - 保持代码整洁
4. **统一视觉效果** - 确保整个项目风格一致

---

## 🎨 颜色映射表

### 背景颜色

| 用途 | 正确 ✅ | 错误 ❌ | 说明 |
|------|---------|---------|------|
| 页面背景 | `bg-background` | `bg-[hsl(150,20%,6%)]` | 主背景深墨绿 |
| 卡片背景 | `bg-card` 或 `bg-tactical-card` | `bg-gradient-to-br from-[hsl(150,18%,10%)]` | 战术面板 |
| 弹出层背景 | `bg-popover` | `bg-[hsl(150,18%,10%)]` | 对话框/下拉框 |
| 输入框背景 | `bg-background` | `bg-[hsl(150,18%,10%)]` | 表单输入 |
| 侧边栏背景 | `bg-sidebar` | `bg-[hsl(150,18%,8%)]` | 侧边栏 |

### 文字颜色

| 用途 | 正确 ✅ | 错误 ❌ | 说明 |
|------|---------|---------|------|
| 主要文字 | `text-foreground` | `text-[hsl(140,30%,92%)]` | 主文本颜色 |
| 次要文字 | `text-muted-foreground` | `text-[hsl(140,10%,50%)]` | 辅助说明 |
| 卡片文字 | `text-card-foreground` | `text-[hsl(140,30%,92%)]` | 卡片内文本 |
| 科技青文字 | `text-tech-cyan` | `text-[hsl(175,85%,45%)]` | 强调/链接 |
| 金融金文字 | `text-finance-gold` | `text-[hsl(45,95%,55%)]` | 金额/高价值 |
| 军事绿文字 | `text-tactical-green` | `text-[hsl(150,60%,40%)]` | 成功/保护 |
| 警告文字 | `text-alert-red` | `text-[hsl(0,80%,55%)]` | 错误/危险 |

### 边框颜色

| 用途 | 正确 ✅ | 错误 ❌ | 说明 |
|------|---------|---------|------|
| 默认边框 | `border-border` | `border-[hsl(150,15%,18%)]` | 战术网格 |
| 输入框边框 | `border-input` | `border-[hsl(150,15%,15%)]` | 表单输入 |
| 科技边框 | `border-tech-cyan/30` | `border-[hsl(175,50%,40%)]` | 科技元素 |
| 金融边框 | `border-finance-gold/30` | `border-[hsl(45,60%,30%)]` | 金额相关 |
| 军事边框 | `border-military-olive/30` | `border-[hsl(80,40%,30%)]` | 保护/安全 |

### 渐变颜色

#### 卡片渐变
```tsx
{/* ✅ 正确：使用 CSS 类 */}
<div className="bg-tactical-card">

{/* ✅ 正确：使用语义化渐变起点 */}
<div className="bg-gradient-to-br from-gradient-tactical-start to-gradient-tactical-end">

{/* ❌ 错误：硬编码 */}
<div className="bg-gradient-to-br from-[hsl(150,18%,10%)] to-[hsl(150,20%,6%)]">
```

#### 按钮渐变
```tsx
{/* 科技风格按钮 */}
<div className="bg-gradient-to-br from-gradient-tech-start to-gradient-tech-end">

{/* 金融风格按钮 */}
<div className="bg-gradient-to-br from-gradient-finance-start to-gradient-finance-end">
```

---

## 🎯 特效类使用指南

### 角标装饰

**类名**: `.corner-deco`

**用途**: 为卡片或容器添加战术风格角标

**使用示例**:
```tsx
<div className="corner-deco p-4 bg-card">
  {/* 内容 */}
</div>
```

**效果**:
- 左上角和右下角显示科技青色 L 形边框
- Hover 时角标发光

---

### 科技发光

**类名**: `.tech-glow`

**用途**: 为重要元素添加科技感发光效果

**使用示例**:
```tsx
<div className="tech-glow p-4 bg-card">
  重要内容
</div>
```

**效果**:
- 外发光阴影
- 内发光增强

---

### 金融边框

**类名**: `.finance-border`

**用途**: 为金额相关元素添加金融金边框

**使用示例**:
```tsx
<div className="finance-border p-4 bg-card">
  金额显示
</div>
```

---

### HUD 网格背景

**类名**: `.hud-grid`

**用途**: 添加战术显示器风格网格背景

**使用示例**:
```tsx
<div className="relative hud-grid">
  <div className="relative z-10">
    {/* 内容 */}
  </div>
</div>
```

---

### 扫描线效果

**类名**: `.tactical-scanline`

**用途**: 添加动态扫描线动画

**使用示例**:
```tsx
<div className="tactical-scanline">
  动态内容
</div>
```

---

## 🚫 常见错误示例

### 错误 1：硬编码背景渐变

```tsx
// ❌ 错误
<div className="bg-gradient-to-br from-[hsl(150,18%,10%)] to-[hsl(150,20%,6%)]">

// ✅ 正确
<div className="bg-tactical-card">
```

---

### 错误 2：硬编码文字颜色

```tsx
// ❌ 错误
<p className="text-[hsl(140,30%,92%)]">标题</p>

// ✅ 正确
<p className="text-foreground">标题</p>
```

---

### 错误 3：硬编码边框颜色

```tsx
// ❌ 错误
<div className="border border-[hsl(150,15%,18%)]">

// ✅ 正确
<div className="border border-border">
```

---

### 错误 4：硬编码半透明颜色

```tsx
// ❌ 错误
<div className="border border-[hsl(175,50%,40%)]">

// ✅ 正确（使用 Tailwind 透明度修饰符）
<div className="border border-tech-cyan/30">
```

---

## 📐 颜色组合模式

### 战术风格（默认）

```tsx
<div className="bg-card border-border corner-deco">
  <h3 className="text-foreground">标题</h3>
  <p className="text-muted-foreground">描述</p>
</div>
```

**适用于**: 大部分卡片、面板

---

### 科技风格

```tsx
<div className="bg-gradient-to-br from-gradient-tech-start to-gradient-tech-end border-tech-cyan/30 corner-deco tech-glow">
  <h3 className="text-background">标题</h3>
  <p className="text-background/80">描述</p>
</div>
```

**适用于**: 主要交互元素、重要按钮

---

### 金融风格

```tsx
<div className="bg-gradient-to-br from-gradient-finance-start to-gradient-finance-end border-finance-gold/30 finance-border">
  <h3 className="text-background">金额</h3>
  <p className="text-finance-gold">¥1,000,000</p>
</div>
```

**适用于**: 金额显示、价值标签

---

### 军事风格

```tsx
<div className="bg-gradient-to-br from-[hsl(80,50%,25%)] to-[hsl(150,60%,20%)] border-military-olive/30">
  <h3 className="text-background">保护状态</h3>
  <p className="text-tactical-green">已激活</p>
</div>
```

**适用于**: 保护机制、安全状态

---

## 🔍 ESLint 规则建议

为了防止硬编码颜色，建议在 ESLint 配置中添加规则：

```json
{
  "rules": {
    "no-hardcoded-colors": ["error", {
      "allowedColors": ["transparent", "currentColor"],
      "allowedProperties": ["borderColor"]
    }]
  }
}
```

或者使用自定义插件：

```bash
npm install --save-dev eslint-plugin-no-hardcoded-colors
```

```json
{
  "plugins": ["no-hardcoded-colors"],
  "rules": {
    "no-hardcoded-colors/no-hardcoded-colors": "error"
  }
}
```

---

## 📚 快速参考

### Tailwind 语义化颜色类速查

```tsx
// 基础色
background          // 页面背景
foreground          // 主要文字
card                // 卡片背景
border              // 边框
muted-foreground    // 次要文字

// 主题色
tech-primary        // 科技青（主色）
tech-cyan           // 科技青（强调）
finance-gold        // 金融金
military-olive      // 军事橄榄
tactical-green      // 军事绿
alert-red           // 警告红

// 渐变起点
gradient-tactical-start  // 战术渐变起点
gradient-tactical-end    // 战术渐变终点
gradient-tech-start      // 科技渐变起点
gradient-tech-end        // 科技渐变终点
gradient-finance-start   // 金融渐变起点
gradient-finance-end     // 金融渐变终点
```

### CSS 变量速查

```css
var(--background)         /* 页面背景 */
var(--foreground)         /* 主要文字 */
var(--card)              /* 卡片背景 */
var(--border)            /* 边框 */
var(--primary)           /* 主色（科技青） */
var(--tech-cyan)         /* 科技青 */
var(--finance-gold)      /* 金融金 */
var(--military-olive)    /* 军事橄榄 */
var(--tactical-green)    /* 军事绿 */
var(--alert-red)         /* 警告红 */
```

---

## ✅ 检查清单

在提交代码前，请确认：

- [ ] 没有硬编码的 HSL 颜色值
- [ ] 所有颜色使用语义化类名
- [ ] 渐变使用预定义的渐变起点
- [ ] 特效类使用正确
- [ ] 颜色组合符合主题风格

---

**文档维护**: 如有疑问或需要补充，请联系团队负责人。

**最后更新**: 2026-03-09
**维护者**: AI 编程助手 - 哈雷酱
