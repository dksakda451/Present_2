// capture-errors.js
// 使用puppeteer捕获HTML页面控制台错误
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// 运行函数
async function captureConsoleErrors() {
  console.log('正在启动浏览器...');
  
  // 启动浏览器 - 修改启动选项以解决超时问题
  const browser = await puppeteer.launch({
    headless: false, // 设为false以便可以看到浏览器窗口
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // 添加此项以解决内存问题
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080'
    ],
    timeout: 60000 // 将超时时间延长到60秒
  });

  try {
    // 创建新页面
    const page = await browser.newPage();
    
    // 设置视窗大小
    await page.setViewport({ width: 1920, height: 1080 });
    
    // 收集所有控制台消息
    const consoleMessages = [];
    const errors = [];
    
    // 监听控制台消息
    page.on('console', msg => {
      const text = msg.text();
      const type = msg.type();
      const messageObj = { type, text, time: new Date().toISOString() };
      consoleMessages.push(messageObj);
      
      // 在Node.js控制台输出
      if (type === 'error') {
        console.error(`页面错误: ${text}`);
      } else if (type === 'warning') {
        console.warn(`页面警告: ${text}`);
      } else {
        console.log(`页面日志: ${text}`);
      }
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
      const errorObj = { 
        message: error.message, 
        stack: error.stack, 
        time: new Date().toISOString() 
      };
      errors.push(errorObj);
      console.error('JavaScript错误:', error.message);
    });
    
    // 监听请求失败
    page.on('requestfailed', request => {
      const failure = request.failure();
      const errorObj = { 
        url: request.url(), 
        errorText: failure ? failure.errorText : '未知错误',
        time: new Date().toISOString()
      };
      errors.push(errorObj);
      console.error(`资源加载失败: ${request.url()} - ${failure ? failure.errorText : '未知错误'}`);
    });

    // 获取HTML文件的绝对路径
    const htmlPath = path.resolve(__dirname, 'goel-financial-analysis.html');
    const fileUrl = `file://${htmlPath}`;
    
    console.log(`正在打开文件: ${fileUrl}`);
    
    // 导航到HTML文件
    await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // 等待页面充分加载
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log('页面加载完成，正在收集错误信息...');
    
    // 将收集到的信息写入文件
    fs.writeFileSync('console-logs.json', JSON.stringify(consoleMessages, null, 2));
    fs.writeFileSync('page-errors.json', JSON.stringify(errors, null, 2));
    
    console.log('控制台日志已保存到 console-logs.json');
    console.log('页面错误已保存到 page-errors.json');
    
    // 可选：在页面上执行JavaScript查看更多信息
    const revealInfo = await page.evaluate(() => {
      return {
        version: Reveal?.VERSION || '未知',
        plugins: Object.keys(Reveal?.getPlugins() || {})
      };
    }).catch(e => ({ error: e.message }));
    
    console.log('Reveal.js信息:', revealInfo);
    
    // 保持浏览器打开30秒然后关闭
    console.log('浏览器将在30秒后自动关闭...');
    await new Promise(resolve => setTimeout(resolve, 30000));
    
  } catch (error) {
    console.error('运行过程中出错:', error);
  } finally {
    // 关闭浏览器
    await browser.close();
    console.log('浏览器已关闭');
  }
}

// 执行函数
captureConsoleErrors(); 