# 采集报告 — Aston Martin Valkyrie 双语官网素材
> 抓取时间:2026-08-16(UTC+8)。采集器:scraper 子代理。

## 九个源的结果总览
| # | 源 | 状态 | 结果 |
|---|---|---|---|
| 1 | en.wikipedia.org/wiki/Aston_Martin_Valkyrie | 成功 | 文字/数据全量提取(16 章节 + infobox 21 行),另抓取姊妹词条 Valkyrie AMR-LMH(含 2025 勒芒/赛季战绩)。**未使用任何图片**(版权限制) |
| 2 | astonmartin.com/en/models/valkyrie | 成功 | 页面结构=Sitecore(`/-/media/...?mw=1920&rev=`),31 张图已下载;9 个 mp4 视频直链已记录 |
| 3 | astonmartin.com/en/models/valkyrie-spider | 成功 | 15 张图已下载;页面无内嵌 mp4 |
| 4 | astonmartin.com/en/models/valkyrie-amr-pro | 成功 | 16 张图已下载;无 mp4 |
| 5 | astonmartin.com/en/models/valkyrie-lm | 成功 | 35 张图已下载;无 mp4 |
| 6 | media.astonmartin.com(官方媒体库) | 部分成功 | 结构探明(WordPress + admin-ajax API),22 篇 Valkyrie PR 文章 + 121 个官方媒体资源(asset_id + 原图下载直链)全部提取;**下载被服务器限流中断**(详见下),目前 0 张落地,121 条 URL 已入清单待重试 |
| 7 | motortrend.com(首驾评测) | 成功 | 全文提取(15,088 字符,含规格表、圈速、价格、下压力数据) |
| 8 | autocar.co.uk(深度评测) | 成功 | JSON-LD reviewBody 全文提取(9,712 字符,1140bhp 巴林试驾) |
| 9 | roadandtrack.com(银石圈速纪录) | 成功 | 全文提取(3,348 字符,含 1:56.42 纪录与 Turner 引语) |

## 图片统计
- **已下载:97 张**(全部来自 astonmartin.com,原尺寸经 mw=1920 参数输出,实测与原图字节一致)
  - Valkyrie(量产版):31 张(hero/设计/工程 overlay/探索区)
  - Spider:15 张
  - AMR Pro:16 张
  - Valkyrie LM:35 张
- **待下载:121 张**(media.astonmartin.com 官方媒体库原图,含 PR 新闻配图与车手肖像;直链已备好,见 media-manifest.json status=pending-download)

## 媒体库下载失败的详细原因(最终结论)
1. **首轮批量(3 线程并行)**:约一半请求返回 404 —— 原因是标题解析 bug 导致 download URL 的 `n=` 参数为空(文件名冲突去重后只剩 22 个任务),非服务器拒绝;
2. 另一部分请求触发服务器连接断开(SSL EOF / RemoteDisconnected);
3. 随后整个 media.astonmartin.com 域名(含首页)触发服务器端限流封锁:对 requests 表现为 TLS 连接被重置,WebFetch(不同网络路径)返回 403 —— 判定为 WAF 级封锁(非单纯代理 IP 问题)。**观察期内持续 >90 分钟未解除**(12:55 最后探测仍被拒),已按红线要求停止一切尝试、不绕行(不换代理/不伪造指纹)。
4. **后续恢复方案(已备好脚本 `assets/_tmp_download3.py`)**:待封锁解除后运行 —— 单线程、每请求间隔 4 秒、带 Referer(对应 PR 页)、失败 3 次重试;脚本会自动先探测首页可达性(最多等 30 分钟)再开始下载。也可由主代理稍后手动重试:`python assets/_tmp_download3.py`(121 条下载直链已全部记录在 media-manifest.json,status=pending-download)。

## API 用法说明(供复用)
### astonmartin.com(Sitecore)
- 图片:`https://www.astonmartin.com/-/media/<path>.jpg?mw=<宽>&rev=<hash>`;mw 不影响原图字节(实测 mw=1920/0/无参一致);rev 为媒体版本哈希,必须保留。
- 页面无 __NEXT_DATA__/JSON-LD;规格数据散在 HTML 文本与 modelHighlightPanel JSON script 中。
### media.astonmartin.com(WordPress + epresspack 主题)
- Valkyrie 分类 = WordPress category ID 119(slug: aston-martin-valkyrie),共 22 篇 PR。
- PR 列表分页 AJAX:POST `https://media.astonmartin.com/wp-admin/admin-ajax.php`,参数 `action=ajaxPressReleasesInCategory, cat_id=119, per_page=6, page=0..3, security=<nonce>`;nonce 从页面内嵌脚本取(本次为 06f3566c31,可能轮换,需每次先从任意页面 HTML 提取 `var PT_Ajax = {...}`)。
- 原图下载:`https://media.astonmartin.com/download/?picid=<asset_id>&n=<文件名>`,直接返回原图(实测 4.9MB jpg);asset_id 从 PR 页 `data-asset_id` 或 `data-epp-dl-img`(base64 列表)提取。
- 视频:fluxVid 模块经 AJAX 按 data-video-id 动态加载,静态 HTML 无直链;REST API 已禁用(401)。
- 媒体库全局页(media-library)为纯 JS 渲染,静态 HTML 无数据。

## 视频
- 9 个官方 mp4 直链(量产版页面)已记录于 `assets/video-links.md`;其余车型页无内嵌视频。
- 银石纪录视频在 Aston Martin 官方 YouTube(未公开完整 onboard)。

## 产出文件清单
- `assets/media-manifest.json`(218 条:97 已下载 + 121 待下载,按车型分桶)
- `assets/specs.md`(全系规格表,含来源标注)
- `assets/review-notes.md`(三评测要点 + 官方英文引语 + 圈速数据)
- `assets/wikipedia-notes.md`(词条文字/数据要点,含勒芒战绩与产量)
- `assets/video-links.md`(9 个 mp4 直链 + 媒体库视频说明)
- `img/`(97 张原始图片)
- `assets/_*.html/.json/.txt`(原始抓取数据与中间产物,可追溯)

## 失败项与注意事项
- media.astonmartin.com 121 张原图:因服务器限流未落地(URL 已全量记录,待冷却重试)。
- media.astonmartin.com 视频直链:需浏览器环境(JS 播放器)才能取得,未完成。
- Spider/AMR Pro/LM 页视频:页面由 JS 动态注入,静态抓取不可得。
- 评测站图片:未下载(任务定义评测站图片非必需)。
- Wikipedia 图片:按版权约束未使用。
