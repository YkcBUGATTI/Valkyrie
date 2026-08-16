# 官方视频直链清单 — Aston Martin Valkyrie
> 采集时间:2026-08-16。仅收集直链,未下载视频文件。

## 一、astonmartin.com 量产版(Valkyrie Coupé)页面视频(9 个 mp4 直链)
来源页:https://www.astonmartin.com/en/models/valkyrie
均为 Sitecore 媒体库直链,带 rev 参数,可直接 <video> 引用或下载。车型分桶:Valkyrie。

| 视频 | URL |
|---|---|
| 液压系统 (hydraulics, desktop) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/hydraulics_video_desktop_small.mp4?rev=84b9c95a1bfc4d6ea65695f383c239be |
| G-Force (desktop) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/g-force_video_desktop_small.mp4?rev=33f3d32e51a846f5bb8f90975c69de22 |
| 动力 (power, desktop) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/power_video_desktop_small.mp4?rev=9ebe2f9e187b4ba688fb345cfbe11542 |
| 动力 (power, mobile) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/power_video_mobile_small.mp4?rev=66b8c9612ff146c3810c8b63a9fb5522 |
| 尾灯 (break light, desktop) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/breaklight_video_desktop_small.mp4?rev=9ad2220085ef43a8813b05f1ac7008 |
| 尾灯 (break light, mobile) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/breaklight_video_mobile_small.mp4?rev=d1772f01434d4577b41a89e4e30b491 |
| 徽章 (badge, desktop) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/badge_desktop-video_small.mp4?rev=31a51b07fb7349d3982394242ff8d56a |
| 徽章 (badge, mobile) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/badge_mobile_video_small.mp4?rev=b8462294264843dbbf62cb1fae3b403e |
| 碳纤维雨刮 (carbon blade wiper, desktop) | https://www.astonmartin.com/-/media/models---valkyrie-2024/valkyrie-july-24-uplift/videos-from-old-models-page/carbon_blade_wiper_video_desktop_small.mp4?rev=671cf13d77164d2885ecf0... |

## 二、其他车型页
- Spider / AMR Pro / LM 页面 HTML 中未内嵌 mp4 直链(视频由前端 JS 动态加载,页面仅有海报图,如 spider/scrollable-videos/side-desk.jpg)。如需这些页面的视频需浏览器自动化进一步探查。

## 三、media.astonmartin.com 官方媒体库
- 媒体站视频通过 admin-ajax + nonce 按需加载(fluxVid 模块),静态 HTML 中无直链;播放器按 data-video-id 动态请求。可用的 AJAX 端点:
  - POST https://media.astonmartin.com/wp-admin/admin-ajax.php,action=mon_action_Vid,query_args={"cat":119},security=nonce(06f3566c31 为页面内嵌 nonce,可能轮换)
  - 返回的 data-video-url / data-video-from 字段在静态响应中为空,需浏览器环境触发点击后获取。
- 官方 YouTube 频道(外链):https://www.youtube.com/user/AstonMartin(含银石纪录视频 "View full post on YouTube",R&T 报道引用)

## 四、银石圈速纪录官方视频
- R&T 报道指向 YouTube 嵌入("View full post on YouTube"),完整 onboard 未公开(报道原文:"Aston Martin hasn't released the complete raw onboard footage just yet")。频道内可检索 "Aston Martin Valkyrie Silverstone lap record / 1:56.42"。
