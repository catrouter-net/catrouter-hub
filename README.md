# CatRouter 模型导航站

一个单文件静态站点：把 28 个 2026 年最新模型（Claude 5.5 全系、GPT-6.1 Sol、GPT-6 Astra、Gemini 3.8 Flash、Grok 4.7、DeepSeek V4、Kimi K3、GLM-5.3-Flash、GPT-Image-2.5/2.6、Nano Banana 2.1、Seedance 2.5、MiniMax H3）的版本、参数、跑分与定价整理成一张可搜索的索引。

- 线上地址：<https://catrouter-net.github.io/catrouter-hub/>
- 官方站点：<https://catrouter.net>
- 统一 BaseURL：`https://catrouter.net/v1`

功能：按厂商分组浏览、关键词搜索、文本/图像/视频筛选、点开看关键参数与适用场景、一键复制模型名与调用片段、按任务与预算给出推荐。

页面是纯静态单文件（HTML + 内联 CSS/JS），无后端、无第三方依赖，直接用浏览器打开 `index.html` 也能运行。
