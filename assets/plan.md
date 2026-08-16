# 实施规划 — Aston Martin Valkyrie 站 v3(阶段三产出,2026-08-16)
> 用户已确认:9 章结构(细节工艺独立)/ 家族章滚动依次展开 / 勒芒全屏滚动图列 / 视觉=碳纤维黑×赛车绿三阶×Marcellus 衬线×Rajdhani 数字。
> 设计 token 见 assets/design-research.md §3.2(唯一定稿源)。

## 章节规划(9 章 + hero + 尾声)

| # | id | 章名 / 拉丁 | 叙事要点(全部来自已核实笔记) | 主组件(每章唯一) | 素材 |
|---|---|---|---|---|---|
| hero | hero | — | kicker: GAYDON · 2016 → 2021;VALKYRIE 大字;副题:F1 冠军设计师的公路 Hypercar;数据条 1,160 PS / 11,100 rpm / 275 台 | 静态 1920 图 + 底部数据条 + 视差 | valkyrie_valkyrie-hero-desktop.jpg |
| 01 | origin | 缘起 / PROJECT ORIGINS | Nebula→AM-RB 001→Valkyrie 命名(北欧女武神,V 字传统);Newey/Horner/Palmer/Sproule 聚餐谈成;2016.7 Gaydon 首发、2017.3 日内瓦亮相;Verstappen/Albon 银石首测;Valhalla "Son of Valkyrie" | 时间线(横排 4-5 节点卡,stagger) | 竖版卡:badge-overlay-new / crafted-wings-tile-new;引语 Newey(green/black) |
| 02 | design | 设计与空气动力学 / SHAPED BY AIRFLOW | 开放底板+Venturi 地效 18 kN(≈1,800 kgf);下压力 137-220 mph 区间 2,425 lb(MT);无外后视镜(摄像头);鸥翼门;Nurnberger 8mm 座舱让步故事 | 遮盖滚动画廊(clip-path,6 段) | design-desktop(1920)、aero-overlay-new、gforce-overlay、explore-1/2/3-desk |
| 03 | power | 动力总成 / THE V12 | Cosworth 6.5L NA V12,1,001 bhp @10,500;红线 11,100 rpm;电机 160 hp + Rimac 1.3 kWh;综合 1,160 PS / 900 Nm;Ricardo 7 速单离合;发动机 206 kg 即承力件;Cosworth 设计寿命 50,000 mi;排气自车顶引出;无倒挡(电机倒车) | gauges(11,100/1,160/900/2.6)+ 图文行 + bigstats | power 视频+poster;scraper 新下 Engine 高清图(若成);bigstats |
| 04 | details | 细节与工艺 / OBSESSIVE DETAILS | 碳纤维单片雨刷、液压、G 力表、尾灯光效、徽章;屏幕阵列替代仪表簇;3D 扫描定制桶椅;可拆方向盘 | 视频小卡族 5-6 个(桌面播放/移动 poster)+ 竖版图卡 | 视频 badge/breaklight/carbon_blade_wiper/g-force/hydraulics(+power 若03未用);竖版:carbon-blade-tile、hydraulics-tile、lightweight-tile |
| 05 | family | 家族 / THE FAMILY | Coupé 150 台(2021.11-2024.12,约 $3M);Spider 85 台(可拆碳顶、蝶翼门、两次超额认购);AMR Pro 40 台(no rules、去 KERS 1,100hp、3.3G/3.5G、LMP1 胎);LM 10 台(520kW、8,400rpm、基于 AMR Pro) | 滚动依次展开:四车型各一个 media-row 交错(1920 hero 图+数据侧栏) | 四张 hero 1920 + spider_side-desk + amr-pro_desktop-top + lm 图;各 2-3 个 mono 数据 |
| 06 | silverstone | 银石纪录 / 1:56.42 | Turner/Cup 2/Hangar 直道约 200 mph;前纪录 Manthey 911 GT2 RS 2:06.82(快 10.4s);对比 Huracan GT3 Evo 1:58.165 / FR 2.0 1:56.052 / F1 1:27.097;Turner 两段引语 | 超大计时数字(逐位揭示)+ rec-line 对比行 | valkyrie_ep-desk / aero-overlay;数字组件 |
| 07 | lemans | 勒芒回归 / RETURN TO LE MANS | AMR-LMH 2025:The Heart of Racing,WEC #007/#009、IMSA #23(DBR9 渊源);首战卡塔尔;勒芒无机械故障完赛;Petit Le Mans 全场第 2(距 Cadillac 5 秒);14 年来首台 V12 顶级原型;LM 客户版 10 台 | 全屏滚动图列(sticky+弹簧惯性,4-6 屏) | LM_01/06/03/05(4K)+ lm_the-experience;引语 "We've arrived…";数据卡 |
| 08 | specs | 技术规格 / SPECIFICATIONS | 四车型 tabs:通用/动力/底盘/性能;口径注释(1,160 PS 官方 vs 1,139 hp MT 实测) | specs-tabs(4 车型 × 4 组)+ gauges | spec 数据全量来自 specs.md |
| 09 | epilogue | 尾声 / 275 | 275 台全售罄;反炒卖政策;Alonso "F1 car for the road" 引语;官方链接 | 大引语 + final-stats + 按钮 | explore-4-desk(多车编队)或 lm_slide-final |

## 呼吸段(章间全屏停顿,防版式疲劳)
- 01→02 之间:无(02 自带全屏画廊)
- 04→05 之间:大引语段(Reichman "no rules" 或 Spider PR 情感句)全宽
- 06 开头即计时大数字(自带停顿)
- 07 全屏图列自带
- 09 前用 explore-4-desk 全屏图收束

## 移动端退化方案(≤980px)
- hero:静态图(无视频本来)、数据条 2×2
- 遮盖画廊:图区改普通块,每段文字+图垂直堆叠(CSS 完成,JS 跳过)
- 视频卡:不加载视频,pure poster 图(judge: media poster 已是本地 1280×720)
- 全屏图列:保留 sticky 序列(轻量,纯 transform),若性能不佳退化为顺序大图
- gauges/bigstats:2 列
- specs-tabs:tab 横向滚动
- 图片:全部 srcset 720w+原图,sizes 只写一次
- 无横向溢出(验证脚本)

## 实施步骤(可执行粒度)
1. `img/m/` 缩略图批量生成(仅页面实际引用的图;旧 120 张可清)= python PIL 720w q80
2. `css/style.css`:token(:root)+ 基础 + nav/menu/gauge → hero → chapter-break → 9 章组件 → footer → 响应式(980/640)
3. `js/lang-detect.js`:chiron 机制,key=valkyrie-lang,click 监听第一行注册
4. `js/main.js`:reveal IO + stagger + 数字计数 + gauges + 画廊 clip(lerp .22)+ 全屏图列弹簧(90/0.85)+ 家族数据条 + tabs + 视频 IO 控制 + 导航/进度/菜单 + 视差
5. `index.html` 全量(中文文案按无 AI 味标准写,事实全部来自笔记)
6. `en.html` 同构英文
7. 验证五项(标签平衡/死链/headless console+img/srcset 双视口/溢出)并修复
8. 交叉检查:文案禁用词扫描(极致/巅峰/惊艳/震撼/融合/绝唱…),引语英文原文核对

## 风险与对策
- Engine 高清图若下载失败 → 03 章用现有竖版 overlay 卡 + power 视频即可,不阻塞
- 遮盖画廊移动端 clip 兼容 → 移动端直接不启用 JS,纯 CSS 堆叠
- 全屏图列 4K 图体积 → srcset 720w 双候选 + lazy;首屏外的 4K 图 loading=lazy
