# 设计研究 — Aston Martin Valkyrie 站(第三版)
> 产出:2026-08-16。依据:f80-site 与 chiron-super-sport-site 全量代码研读(HTML/CSS/JS)、Valkyrie 素材笔记、阿斯顿马丁品牌资料。
> 结论先行:**近黑碳纤维底 × 英伦赛车绿 accent × 衬线 display(Marcellus)× F1 数字标签(Rajdhani)× 章节式滚动叙事**,组件与动效机制复用两站的成熟实现,但版式节奏、配色、字体、交互重心全部换成阿斯顿马丁自己的。

---

## 1. 两个参考站拆解

### 1.1 信息架构与章节叙事
| | f80-site | chiron-super-sport-site |
|---|---|---|
| 结构 | hero(视频)→ 章节分隔页(01-08)+ 内容区交替 → 尾声 → 页脚门户 | hero(wordmark 居中)→ 序(360° scrub + 诞生 + 设计混排)→ 章节分隔页(01-06)+ 章节区 → 页脚门户 |
| 章节数 | 8 章,每章一个 `chapter-break`(编号 + 中文名 + 英文小字 + 引导句) | 6 章,`chapter-break`(编号 + 标题 + 拉丁小字 + 副句),明暗底交替(`chapter--dark`) |
| 叙事逻辑 | 时间顺序(缘起→设计→内饰→动力→空动→底盘→规格→总结) | 主题递进(序 360°→空动→动力→特别版→纪录→定制→规格) |
| 导航 | 固定顶栏(当前章节 + 品牌 + EN + 菜单)+ 右侧章节索引栏 + 右下进度表盘 | 固定顶栏(章节标签胶囊 + 品牌 + 菜单)+ 右下进度表盘;hero 区顶栏隐藏 |
| 语言 | zh/en 双页,内联 IP 检测(仅 zh→en 单向) | zh/en 双页,独立 lang-detect.js(双向 + localStorage + ipapi/ipinfo 兜底)——**本站采用此方案** |

**结论(本站取舍)**:采用 chiron 的 lang-detect 独立脚本 + f80 的"章节分隔页大编号 + 英文小字"骨架,但章节数压缩到 7-8 章,部分章节之间用全屏图"呼吸段"替代 chapter-break,避免 8 连分隔页的机械感(上版被否点之一:版式重复)。

### 1.2 组件体系(可复用清单)
- **hero**:100svh、媒体层 + 渐变 veil、kicker/title/sub/desc/data 阶梯入场(0.2/0.35/0.55/0.7/0.85s)、右下或底部 scroll 指示(1px 线 + 动画)。f80 逐字入场 `--d` 递增 0.06s。
- **chapter-break**:大编号(描边或实色)+ 章名 + 拉丁小字 + 引导句;chiron 版:右上超大水印数字(clamp 12-26rem, rgba 0.025);f80 版:扫描光带 + 渐变标题 + 左红条。
- **遮盖滚动画廊(gallery)**:左文右图;文字卡 130vh/段、glass 卡片(blur 18px + 0.09 白描边);图区 sticky 100vh,`clip-path: inset()` 逐张揭示;文字先走(62% 处上移淡出)图后切;JS clip lerp 0.22 平滑 + 0.25% 写入阈值。
- **滚动 scrub(360°)**:320vh track + sticky + 视频时间轴 seek;弹簧惯性 `vel += diff*90*dt; vel *= 0.85^(dt*60)`;移动端退化静态海报 + 4.2s 文字轮播。**本站无 360° 素材,不硬做**;弹簧惯性算法挪用给"滚动驱动图片序列/进度揭示"。
- **图文行(media-row)**:1.15fr/1fr 左右交错,图 16:9 + saturate(0.78) + hover scale 1.04;flip 变体换序。
- **数据组件**:bigstats(4 格大数字)、gauges(SVG 环 r=84, C=527.8, easeOutExpo 2200ms 滚动)、accel 行、count 数字滚动(toLocaleString 千分位)。
- **规格 tabs**:4 面板切换(specs-tabs),行 k/v + 高亮行 `--hl`。
- **年表(rec-line)**:年份 + 车名 + 数值,行式排布。
- **卡片族**:hcard(年份+事件)、dcard(图+编号+标题+一句)、ptcard(动力三卡)、webcard(视频卡)、modecard。
- **引语(quote)**:blockquote + 人名 + 头衔;f80 中文页附英文原文(`.quote__en`)。
- **页脚**:hypercar 门户卡 + 联系按钮 + 免责声明 + 双语链接。

### 1.3 动效质感(机制拆解,本站全部沿用其物理参数)
- reveal:`opacity 0 → 1 + translateY(34px)`,1s `cubic-bezier(0.22,1,0.36,1)`,IO threshold 0.1-0.12,一次性 unobserve;`prefers-reduced-motion` 直接显示。
- stagger:组内子元素 `--d` 递增 0.08s(f80)。
- 缓动令牌:f80 `--ease: cubic-bezier(0.65,0,0.35,1)`(对称)、`--ease2: cubic-bezier(0.22,1,0.36,1)`(outQuint 风);chiron 单一 `--ease: cubic-bezier(0.22,1,0.36,1)`。
- 数字:easeOutExpo `1-2^(-10t)`,1800-2200ms。
- hover:图 `transform 0.9s ease2 + filter saturate`;按钮/描边 0.25-0.35s;卡片 tilt `perspective(700px) rotate ±7deg`(仅 finePointer);卡片光边跟随 `--mx/--my` CSS 变量。
- 滚动帧:rAF ticking 或常驻 rAF(弹簧需要常驻);geometry 惰性缓存(Resize/load 后 measure,滚动帧零 reflow)。
- hero 视差:`translateY(y*0.22)` + scale(1.1) 底图,内容 `translateY(-y*0.12) scale(1-y*0.0006)`。
- 导航:y>heroH-40 出现;进度条 width 百分比;scroll-gauge 右下 SVG 圆 C=119.4。
- 视频:IO 进视口 play/离场 pause(`data-autoview`);移动端 hero 视频 pause + preload=none。

### 1.4 排版细节(具体数值)
- f80:body 17px/1.75;wrap `min(1280px, 100%-48px)`;section padding 120px 0;hero title `clamp(52px,9vw,128px)` ls .04em;chapter 名 `clamp(36px,5vw,62px)`;sec-title `clamp(26px,3.2vw,40px)`;mono 标签 11-13px,ls .12-.42em;引语体、desc 15.5px/1.9。
- chiron:body 18px/1.8;--w-doc 1280、--w-prose 660;chapter h2 `clamp(2.2rem,5.4vw,4.2rem)` ls .03em;latin 小字 0.28em、ls .5em、uppercase、faint;lead `clamp(1.2rem,2.2vw,1.5rem)`;lbl/no 标签 0.7-0.8rem ls .32-.44em。
- **字号阶梯(本站定稿)**:hero display `clamp(3.4rem,10vw,9rem)`;chapter 名 `clamp(2.2rem,5.2vw,4rem)`;sec-title `clamp(1.7rem,3.6vw,2.6rem)`;lead `clamp(1.15rem,2vw,1.4rem)`/1.75;正文 1.0625rem(17px)/1.85;卡片标题 `clamp(1.3rem,2.4vw,1.8rem)`;小字标签 0.72-0.8rem、ls .32-.45em、uppercase;图注 0.7rem ls .24em。
- **间距系统**:4px 基数;区块 padding `clamp(3rem,8vh,6rem)`;章节分隔页 `clamp(5rem,12vh,9rem) 0 clamp(3rem,7vh,5rem)`;图文行 margin `clamp(1.5rem,4vh,2.6rem)` 递进;wrap padding `0 clamp(1.5rem,5vw,4rem)`。

### 1.5 配色逻辑
- f80:近黑 `#07070b`/`#0c0d13` + 法拉利红 `#dc0000`(accent、进度、热点、渐变标题),selection 红。
- chiron:近黑 `#050507`/`#0a0b0f` + 布加迪蓝 `#004bfa` + 亮蓝 `#3f7bff`(数字 em),明暗章交替 `--bg-soft`。
- 共性:文字三级(ink/dim/faint),线 `rgba(255,255,255,.12/.07)`,玻璃卡 `rgba(10,11,15,.5)+blur18+0.09 描边`。

### 1.6 响应式与移动端
- 断点:chiron 980px(画廊/scrub 退化、图文行单列)、860px(scrub 退化);f80 900px(lead-grid 单列)。
- 移动端规则(两站一致):srcset 720w+原图双候选、sizes 只写一次 `(max-width:980px) 100vw, 2400px`;hero 视频 pause+preload none;滚动视频 display none;竖版 tile 图在移动端原生适配(900x400 mobile 版图可选);全站 overflow-x hidden + 验证无横向溢出。

---

## 2. "无 AI 味"标准(硬性,写入实施检查单)
**文案**
1. 事实驱动:每段至少一个可核查的具体物(数字/日期/人名/地点/事件)。禁止无事实支撑的形容句。
2. 短句为主(中文 ≤40 字/句优先),允许一个克制的主观判断(如"车内比车外安静这件事不存在,反了过来"式观察),但不得连续两句抒情。
3. 禁用词表:极致、巅峰、惊艳、震撼、融合、匠心、赋能、殿堂、美学盛宴、视觉冲击、速度与激情、无关的成语连用。允许使用:仅在直接引语原文与车型官方定位句("no rules" 等)中出现。
4. 中文技术写作习惯:单位前加窄空格感(直接连写亦可),千分位逗点,数据带来源口径(如"1,160 hp @ 10,500 rpm");不把 bhp/PS 混用在同一句(换算口径在规格区注明)。
5. 引语:英文原文保留,中文页给忠实翻译(不润色不增译);人名+头衔+场合三要素齐全。
6. 每章的"呼吸句"(章节引导语)只写一句,写具体事实或引语,不写排比。

**动效**
7. 全站只有一条缓动族(outQuint 系)+ 弹簧参数 90/0.85,但不同组件时长/位移不同:reveal 34px/1s,chapter 元素 14-20px/0.7s 错峰 0.08s,hero 阶梯 0.15s 步进。
8. 滚动驱动组件必须有 lerp/弹簧(gallery clip lerp 0.22;数字 easeOutExpo);禁止裸 scrollTo 直连。
9. hover 只做两件事:提亮(scale/saturate/描边),不做位移跳跃;tilt 仅桌面 finePointer。
10. 禁止:全站统一模板动画(所有卡片同 delay 同位移同曲线)、无限循环动画超过 1 处(hero scroll 线可循环,其余静态)。

**布局**
11. 卡片组不居中整齐排:4 卡组用 2x2 不对称网格(首卡跨列/错位 margin-top);图组用 figrow(2+1、1+2 交错);每章版式与上一章不同(时间线/画廊/热点/切换器/全屏图列/tabs 各一章)。
12. 留白节奏:章与章之间至少一个 100vh 级"呼吸段"(全屏图或大引语),不让内容区连续滚动超过 3 屏无停顿。
13. 数字永远 mono 字体 + 千分位 + 单位小字;正文里的数字用 `<b>` 提亮但不放大。

---

## 3. 阿斯顿马丁品牌气质 → 设计 token

### 3.1 气质来源
- **英伦赛车绿**:AM车队绿(British Racing Green 系)是品牌底色;Valkyrie 官方棚拍常见 Racing Green 车身 + 铜色细节。绿不是"环保绿",是赛道漆面:冷、深、带灰蓝调。
- **F1 工程基因**:Adrian Newey 地面效应空动、Red Bull Advanced Technologies 合作、11,100 rpm Cosworth V12、"F1 car for the road"(Alonso 语)。表达为:精密的 mono 数据标签、细线框、图纸感描边数字、章节编号如车号(007/009)。
- **V12 机械纯粹**:自然吸气、无涡轮、206 kg 发动机即承力件。表达为:衬线 display 的古典车徽气质(Marcellus 罗马碑刻体)与工业 mono 的对撞——"老钱的车徽,赛车的仪表"。
- **勒芒传承**:DBR9 与 007 号渊源、2025 勒芒回归完赛。表达为:赛道段落用 4K 实拍图 + 计时格式数字(1:56.42、24:00)。

### 3.2 设计 token(完整数值表)
```
配色(暗主题 · 站点实际使用)
  --bg:          #060907        /* 近黑,带一丝绿意 */
  --bg-soft:     #0a0f0c        /* 章节交替底 */
  --panel:       #0e1511        /* 卡片底 */
  --ink:         #f2f5f1        /* 主文字,冷调暖白 */
  --ink-dim:     #a8b0aa        /* 次级 */
  --ink-faint:   #79817b        /* 弱级 */
  --green:       #22574a        /* 赛车绿(深,用于面/描边/渐变) */
  --green-mid:   #2f7a66        /* 主 accent(线、进度、active) */
  --green-bri:   #5cc9a6        /* 亮 accent(数字 em、hover、下划线) */
  --green-glow:  rgba(92,201,166,.14)   /* 光晕、玻璃卡描边 */
  --lime:        #c9d175        /* 点缀(仅限赛事段落的小标签,克制) */
  --line:        rgba(242,245,241,.12)
  --line-soft:   rgba(242,245,241,.07)
  --glass:       rgba(8,14,11,.55)
  --gold:        #b3956f        /* 铜色细节(车徽/铭牌段专用,极少) */
配色(亮主题 · token 备用,本站不实现切换)
  --bg: #f3f4f1 / --bg-soft:#e9ebe6 / --ink:#161b18 / --ink-dim:#4c554f
  --green:#1e4f43 / --green-mid:#236a58 / --green-bri:#1c8f6e / --line:rgba(22,27,24,.14)

字体(自托管,fonts/ 已备)
  --font-display: 'Valkyrie Display'(Marcellus 400)——章名/大标题/引语,罗马碑刻衬线
  --font-text:    system-ui + 'Noto Sans SC'/'PingFang SC'/'Microsoft YaHei'——正文
  --font-mono:    'Valkyrie Mono'(Rajdhani 500/600/700)——全部数字/标签/编号/计时
  (Cormorant Garamond 备用于引语斜体,可不用)

字号阶梯(rem)
  hero display  clamp(3.4rem, 10vw, 9rem) / ls .02em / lh 1
  chapter 名    clamp(2.2rem, 5.2vw, 4rem) / ls .03em / lh 1.08
  sec-title     clamp(1.7rem, 3.6vw, 2.6rem) / lh 1.2
  卡片标题      clamp(1.3rem, 2.4vw, 1.8rem) / lh 1.16
  lead          clamp(1.15rem, 2vw, 1.4rem) / lh 1.75
  正文          1.0625rem / lh 1.85
  bigstat 数值  clamp(1.8rem, 3.6vw, 2.8rem)(mono)
  标签/mono     .72–.8rem / ls .32–.45em / uppercase
  图注          .7rem / ls .24em
  水印大字      clamp(12rem, 30vw, 26rem) rgba(242,245,241,.025)

间距与结构
  --w-doc: 1280px  --w-prose: 660px  wrap padding 0 clamp(1.5rem,5vw,4rem)
  section padding clamp(3rem, 8vh, 6rem) 0
  chapter-break padding clamp(5rem,12vh,9rem) 0 clamp(3rem,7vh,5rem)
  组件间距 margin-top clamp(1.5rem,4vh,2.6rem) 递进;卡组 gap clamp(1rem,2vw,1.5rem)

圆角 / 描边 / 阴影
  圆角:4px(卡片 2-4px,极克制——AM 是机身切割感,不是气泡卡)
  描边:1px var(--line);玻璃卡 1px rgba(242,245,241,.09)
  阴影:卡片 0 18px 50px rgba(0,0,0,.35)(沿用);绿色 glow 仅用于 active 态(hotspot/进度)

动效时长
  reveal 1s / chapter 错峰 .7s(+.08/.16/.24s) / hover .25–.35s / 图 scale .9s
  数字 1800ms(hp 类)/ 2200ms(gauge)
  缓动 --ease: cubic-bezier(.22,1,.36,1)(全站唯一);弹簧 90 / 0.85^(60dt)
  gallery clip lerp 0.22、写入阈值 0.25%

selection:绿底白字;scrollbar 细绿(可选)
```

### 3.3 差异清单(与两参考站的区隔,防"翻版"检查)
| 维度 | f80(红黑科技) | chiron(蓝黑奢华) | **Valkyrie(本站)** |
|---|---|---|---|
| accent | 法拉利红 #dc0000 | 布加迪蓝 #004bfa | 赛车绿三阶(深/中/亮)+ 铜色微点缀;无红无蓝 |
| 字体 | 全 sans + mono | Bugatti Display 衬线变体 | **Marcellus 碑刻衬线 display × Rajdhani 工业 mono 对撞**;正文 sans |
| 章节分隔 | 扫描光带+红渐变字+左红条 | 大水印数字+描边编号 | **描边车号式编号(如 01)+ 绿色细规线 + 章名衬线**;无扫描光带;明暗交替但用绿黑而非蓝黑 |
| hero | 视频底+左下文字块 | wordmark 居中+视频 | **静态 1920 图 + 底部数据条(mono 计时式)+ kicker 用车型官方定位句**;视频不做 hero(素材是细节片) |
| 核心交互 | aero 热点 + 灯箱 | 360° scrub + 遮盖画廊 | **遮盖画廊(设计章)+ 滚动驱动图片序列(勒芒章,弹簧惯性)+ 车型切换器(家族章)+ 规格四 tabs**;无 360°(素材缺,不硬做) |
| 排版节奏 | 每章统一 wrap 内容流 | 长章节多组件混排 | **每章主组件唯一 + 章间 100vh 呼吸段(全屏图/大计时数字)** |
| 语言切换 | 内联脚本单向 | lang-detect.js 双向 | 同 chiron 机制,key 改 `valkyrie-lang`,**click 监听第一行注册** |

---

## 4. 素材清单核对(与 design 配合的可用性结论)
- 四车型 hero 1920×1080 齐备(valkyrie/spider/amr-pro/lm 各一)→ 全屏章背景与 hero 可用。
- LM 4K×6(3840×2160)+ IMSA 4K-9K×15 + lm_slide 2880×4 → 勒芒/赛事章全屏滚动图列充足;9754px/95MB 那张需 resize ≤3840 后使用。
- 量产 Coupé 桌面图仅 3 张 1920(hero/design/ep-desk)→ 设计章全屏用 design-desktop;细节用 980×1200 竖版 overlay 卡片(半屏/卡片布局合规)。
- 视频 9 支均为细节特写 → 用作"工程细节"卡片区的小视频卡(桌面播放、移动静态),不做 hero、不做滚动 scrub。
- 媒体库 40 张(`__` 命名)内容多为赛道/人物/领奖台 → 赛事章与 LM 章叙事图;拟用的需 vision 复核清晰度。
- poster-*.jpg 6 张 720p → 仅视频 poster 用。
- 禁用清单(image-classification.md):lm_faq/enquire、brake_light_screenshot、carbon_blade_wiper_screenshot、视频帧图;重复对取其一。

## 5. 结论
设计方向一句话:**"绿翼碑刻 × F1 仪表"——用 Marcellus 的英伦车徽气质承载章节标题,用 Rajdhani 的赛车仪表气质承载一切数字,底色是碳纤维黑与赛车绿的明暗交替,组件体系复用两站已验证的机制但每章版式不重复,文案全部落在可核查的事实与引语上。**
