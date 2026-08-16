# Valkyrie 官方媒体库补采报告(第三轮)

- 获取时间:2026-08-16(第 3 轮;前两轮因限流未完成)
- 目标:30 张;成功:30;失败:0;未遭遇限流(无 429/403/TLS reset)
- 来源:https://media.astonmartin.com/ 官方媒体库(eppresspack download 直链)
- 参数:单线程、请求间隔 >=4s、带 Referer(https://media.astonmartin.com/)、浏览器 UA、失败重试 3 次(8/16/32s 递增)、首页可达性前置探测(最长等 15 分钟)
- 总耗时:约 8 分钟(含探测与间隔)

## 关键发现(与前两轮不同之处)

1. **Python requests 的 TLS 指纹被 WAF 拒绝**:`requests.get()` 稳定报 `SSLError: UNEXPECTED_EOF_WHILE_READING`(3/3 次),而同一时刻 `curl` 完全正常(首页 302、下载 200)。改用 curl 作传输层后全部成功。**建议后续轮次一律用 curl 下载本域,不要用 requests/urllib3**。
2. **下载直链的 `n` 参数必须使用 manifest `source_url` 中的原图名**:用完整文件名(picid 前缀形式)拼 URL 会返回 404;`source_url` 原样可用。
3. 下载 URL 中的 `+`(空格编码)不可再编码(quote 时需保留),否则服务器端 404。

## 成功清单(30/30)

| 分组 | picid | 尺寸 | 大小(KB) | 文件名 |
|---|---|---|---|---|
| **规则1 首车交付棚拍 (First customer car)** | | | | |
| | 37649 | 3533x5300 | 2967 | `first-aston-martin-valkyrie-customer-car-complete__37649__Aston_MArtin_Valkyrie14-jpg.jpg` |
| | 37652 | 8640x5760 | 5694 | `first-aston-martin-valkyrie-customer-car-complete__37652__Aston_Martin_Valkyrie16-jpg.jpg` |
| | 37655 | 4419x6500 | 3187 | `first-aston-martin-valkyrie-customer-car-complete__37655__Aston_Martin_Valkyrie15-jpg.jpg` |
| | 37658 | 6500x4333 | 4574 | `first-aston-martin-valkyrie-customer-car-complete__37658__Aston_MArtin_Valkyrie13-jpg.jpg` |
| | 37661 | 4333x6500 | 2859 | `first-aston-martin-valkyrie-customer-car-complete__37661__Aston_MArtin_Valkyrie12-jpg.jpg` |
| | 37664 | 4333x6500 | 3940 | `first-aston-martin-valkyrie-customer-car-complete__37664__Aston_Martin_Valkyrie11-jpg.jpg` |
| **规则2 V12 发布稿 (V12 launch)** | | | | |
| | 26621 | 5568x3712 | 5437 | `aston-martin-valkyrie-first-laps-for-formula-one-pros-as-add__26621__Aston_Martin_Valkyrie_7-jpg.jpg` |
| | 26624 | 5568x3712 | 4437 | `aston-martin-valkyrie-first-laps-for-formula-one-pros-as-add__26624__Aston_Martin_Valkyrie_8-jpg.jpg` |
| | 26627 | 4287x2858 | 1878 | `aston-martin-valkyrie-first-laps-for-formula-one-pros-as-add__26627__Aston_Martin_Valkyrie_6-jpg.jpg` |
| | 26630 | 5568x3712 | 5686 | `aston-martin-valkyrie-first-laps-for-formula-one-pros-as-add__26630__Aston_Martin_Valkyrie_5-JPG.jpg` |
| | 26633 | 4508x3006 | 2217 | `aston-martin-valkyrie-first-laps-for-formula-one-pros-as-add__26633__Aston_Martin_Valkyrie_4-jpg.jpg` |
| | 26636 | 4978x3318 | 3163 | `aston-martin-valkyrie-first-laps-for-formula-one-pros-as-add__26636__Aston_Martin_Valkyrie_3-jpg.jpg` |
| **规则3 混动发动机细节 (Engine)** | | | | |
| | 12962 | 5472x3648 | 2917 | `aston-martin-valkyrie-v12-turns-the-hypercar-engine-up-to-11__12962__Aston_Martin_Valkyrie_Engine_20-jpg.jpg` |
| | 12968 | 5472x3648 | 3037 | `aston-martin-valkyrie-v12-turns-the-hypercar-engine-up-to-11__12968__Aston_Martin_Valkyrie_Engine_19-jpg.jpg` |
| | 12971 | 7952x5304 | 9010 | `aston-martin-valkyrie-v12-turns-the-hypercar-engine-up-to-11__12971__Aston_Martin_Valkyrie_Engine_13-JPG.jpg` |
| | 12974 | 5304x7952 | 11635 | `aston-martin-valkyrie-v12-turns-the-hypercar-engine-up-to-11__12974__Aston_Martin_Valkyrie_Engine_12-JPG.jpg` |
| | 12977 | 7952x5304 | 9667 | `aston-martin-valkyrie-v12-turns-the-hypercar-engine-up-to-11__12977__Aston_Martin_Valkyrie_Engine_14-JPG.jpg` |
| | 12983 | 7076x4720 | 7039 | `aston-martin-valkyrie-v12-turns-the-hypercar-engine-up-to-11__12983__Aston_Martin_Valkyrie_Engine_11-JPG.jpg` |
| **规则4 银石公开首秀 (Silverstone)** | | | | |
| | 19424 | 4160x2773 | 1487 | `aston-martin-valkyrie-wows-crowds-on-public-debut-at-silvers__19424__Aston_Martin_Valkyrie_at_Silverstone__7-jpg.jpg` |
| | 19430 | 3732x2488 | 1015 | `aston-martin-valkyrie-wows-crowds-on-public-debut-at-silvers__19430__Aston_Martin_Valkyrie_at_Silverstone__6-jpg.jpg` |
| | 19436 | 4737x3158 | 1721 | `aston-martin-valkyrie-wows-crowds-on-public-debut-at-silvers__19436__Aston_Martin_Valkyrie_at_Silverstone__5-jpg.jpg` |
| | 19439 | 3549x2366 | 1063 | `aston-martin-valkyrie-wows-crowds-on-public-debut-at-silvers__19439__Aston_Martin_Valkyrie_at_Silverstone__3-jpg.jpg` |
| **规则5 设计规格 MAXIMUM 组 (Designer Spec)** | | | | |
| | 14492 | 5333x3000 | 4988 | `aston-martin-valkyrie-the-ultimate-hybrid-powertrain-for-the__14492__Aston_Martin_Valkyrie__Designer_Specification__MAXIMUM_4-jpg.jpg` |
| | 14495 | 5333x3000 | 4610 | `aston-martin-valkyrie-the-ultimate-hybrid-powertrain-for-the__14495__Aston_Martin_Valkyrie__Designer_Specification__MAXIMUM_3-jpg.jpg` |
| | 14498 | 5333x3000 | 3880 | `aston-martin-valkyrie-the-ultimate-hybrid-powertrain-for-the__14498__Aston_Martin_Valkyrie__Designer_Specification__MAXIMUM_2-jpg.jpg` |
| | 14501 | 5333x3000 | 3721 | `aston-martin-valkyrie-the-ultimate-hybrid-powertrain-for-the__14501__Aston_Martin_Valkyrie__Designer_Specification__MAXIMUM_1-jpg.jpg` |
| **规则6 2025 勒芒回归 (Le Mans 2025)** | | | | |
| | 56336 | 3376x6000 | 1730 | `aston-martin-returns-to-le-mans-with-two-valkyrie-lmh-hyperc__56336__ASTON_MARTIN_RETURNS_TO_LE_MANS_TO_FIGHT_FOR_OVERALL_VICTORY_WITH_VALKYRIE_HYPER.jpg` |
| | 56342 | 6000x3375 | 2480 | `aston-martin-returns-to-le-mans-with-two-valkyrie-lmh-hyperc__56342__ASTON_MARTIN_RETURNS_TO_LE_MANS_TO_FIGHT_FOR_OVERALL_VICTORY_WITH_VALKYRIE_HYPER.jpg` |
| **规则7 命名/内外饰揭秘 (Name & Design)** | | | | |
| | 1247 | 8000x4500 | 4273 | `the-aston-martin-valkyrie-am-rb-001-hypercar-takes-its-name-__1247__Aston_Martin_Valkyrie_01jpg.jpg` |
| | 17519 | 3000x2400 | 805 | `aston-martin-valkyrie-secrets-of-exterior-and-interior-desig__17519__Aston_Martin_Valkyrie_13jpg.jpg` |

## 失败清单

无。

## 限流情况

全程未触发 WAF(无 429/403/TLS reset),完成 30/30。

## 文件落位与可追溯性

- 图片:`img/` 目录,文件名沿用 manifest `file` 字段
- 目标清单:`assets/_target30.json`(rule/picid/file/source_url)
- 下载日志:`assets/_dl30_log.json`(每条含 picid/状态/字节数/时间戳)
- 脚本:`assets/_tmp_dl30_curl.py`(curl 传输版,可复用)
- manifest 中对应 30 条已回写 `status=downloaded`(见 media-manifest.json)

## 补采:AMR-LMH 勒芒 Hypercar 赛车图(2026-08-16,13 张)

目标:客户版 Valkyrie LM 之外、AMR-LMH 赛车实拍(2025/2026 勒芒回归新闻稿 + IMSA 北美首秀赛车图)。
传输:curl(单线程 4s 间隔,Referer media.astonmartin.com,3 次递增重试,首页探测,TLS reset/403/429 硬停)。

### 下载清单(文件名/尺寸/字节)

| picid | 尺寸 | KB | 说明 | 文件 |
|---|---|---|---|---|
| 56345 | 3376x6000 | 5184 | 2025勒芒回归_08 | `aston-martin-returns-to-le-mans-with-two-valkyrie-lmh-hyperc__56345__...jpg` |
| 56348 | 6000x3375 | 5437 | 2025勒芒回归_07 | `aston-martin-returns-to-le-mans-with-two-valkyrie-lmh-hyperc__56348__...jpg` |
| 56351 | 3376x6000 | 5662 | 2025勒芒回归_06 | `aston-martin-returns-to-le-mans-with-two-valkyrie-lmh-hyperc__56351__...jpg` |
| 54419 | 3376x6000 | 1721 | 2026勒芒回归_10 | `aston-martin-returns-to-le-mans-to-fight-for-overall-victory__54419__...jpg` |
| 54422 | 6000x3375 | 2468 | 2026勒芒回归_09 | `aston-martin-returns-to-le-mans-to-fight-for-overall-victory__54422__...jpg` |
| 54425 | 3376x6000 | 5171 | 2026勒芒回归_08 | `aston-martin-returns-to-le-mans-to-fight-for-overall-victory__54425__...jpg` |
| 62522 | 9754x9754 | 95188 | Valkyrie IMSA Side(超大原图) | `aston-martin-valkyrie-set-for-north-american-competition-deb__62522__Valkyrie_IMSA_Side.jpg` |
| 62516 | 5425x3617 | 5241 | Valkyrie trio landscape | `aston-martin-valkyrie-set-for-north-american-competition-deb__62516__Valkyrie_trio_landscape.jpg` |
| 62519 | 3648x5472 | 5273 | Valkyrie trio | `aston-martin-valkyrie-set-for-north-american-competition-deb__62519__Valkyrie_trio.jpg` |
| 62510 | 9071x5102 | 41555 | Valkyrie IMSA Side 16:9(超大原图) | `aston-martin-valkyrie-set-for-north-american-competition-deb__62510__Valkyrie_IMSA_Side_16_215%3B9.jpg` |
| 62483 | 3840x3840 | 8974 | Valkyrie IMSA 3/4 square | `aston-martin-valkyrie-set-for-north-american-competition-deb__62483__Valkyrie_IMSA_3_4_square.jpg` |
| 62513 | 9754x9754 | 95478 | Valkyrie IMSA HighSide(超大原图) | `aston-martin-valkyrie-set-for-north-american-competition-deb__62513__Valkyrie_IMSA_HighSide.jpg` |
| 62627 | 6000x4000 | 15879 | Vantage leads Valkyrie(卡塔尔站实拍) | `aston-martin-valkyrie-makes-solid-start-to-campaign-with-top__62627__Vantage_leads_Valkyrie.jpg` |

### 筛选说明

- 56336 系列(2025 勒芒):56336/56342 已在上批下载,本次补 56345/56348/56351;56333(Ian James 肖像)按规则排除。
- 54419 系列(2026 勒芒):无法目视判断主图,按 picid 顺序取前 3(54419/54422/54425)。
- IMSA 组:62483/62510/62513/62516/62519/62522(赛车发布新闻稿 6 张全部)。
- 62627 "Vantage leads Valkyrie" 为 WEC 卡塔尔站发车实拍,画面含 Valkyrie 赛车主体,纳入。
- 已排除:客户版 Valkyrie LM(64595-64610 六张)、车手肖像(74993-75008/66473/66482/66485)、Vantage/RSL 条目(66476/66479/66488/62630-62642)。
- AMR-Pro 赛道图(Bahrain 2022 等)未启用:LM bucket 候选已足,无需补足。

### 失败清单

无。13/13 成功。

### 限流情况

全程未触发 WAF(无 429/403/TLS reset)。注意:62522/62513(9754x9754,约 95MB)与 62510(9071x5102,约 42MB)为超大原图,如需站点使用建议主代理后续转压缩(如 w=2400 JPEG)。

## 文件落位与可追溯性

- 图片:img/ 目录,文件名沿用 manifest file 字段
- 目标清单:assets/_target_amrlmh.json
- 下载日志:assets/_dl_amrlmh_log.json
- 脚本:assets/_tmp_dl_amrlmh_curl.py(基于 _tmp_dl30_curl.py 改造)
- manifest 中对应 13 条已回写 status=downloaded
