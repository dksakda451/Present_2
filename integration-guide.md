# 动画代码集成指南

## 第一步：添加CSS样式

将上面提供的CSS代码添加到HTML文件的`<head>`部分内的`<style>`标签中。查找现有的样式标签：

```html
<style>
    /* 现有样式... */
    
    /* 在这里添加新的样式代码 */
    /* 打字光标动画 */
    .typing-cursor {
        display: inline-block;
        width: 2px;
        height: 1em;
        background-color: #fff;
        margin-left: 2px;
        vertical-align: middle;
        animation: blink 0.7s infinite;
    }
    
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    
    /* 其他CSS样式... */
</style>
```

## 第二步：添加JavaScript动画代码

将提供的JavaScript代码添加到HTML文件底部的`<script>`标签中。最好放在其他脚本的最后：

```html
<script>
    // 现有脚本代码...
    
    // 在最后添加新的动画代码
    
    // 为第三页(公司概述第一页)添加动画效果
    Reveal.addEventListener('slidechanged', function(event) {
        // 公司概述第一页动画代码...
    });
    
    // 为第四页(公司概述第二页)添加动画效果
    Reveal.addEventListener('slidechanged', function(event) {
        // 主营业务动画代码...
    });
</script>
```

## 第三步：确认GSAP库已加载

这些动画依赖于GSAP库。在HTML中查找以下行确保已加载:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>
```

如果这些行已存在，则无需任何操作。

## 第四步：测试演示文稿

添加完代码后，在浏览器中打开演示文稿并检查：
1. 第三页(公司概述)是否有内容框淡入和列表项逐个显示的动画
2. 第四页(主营业务)是否有标题打字效果和业务板块的分步骤呈现
3. 鼠标悬停到内容框上是否有交互效果