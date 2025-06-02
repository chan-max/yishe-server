const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function convertSvgToPng() {
    const svgPath = path.join(__dirname, 'test.svg');
    const pngPath = path.join(__dirname, 'test.png');

    try {
        // 检查源文件是否存在
        if (!fs.existsSync(svgPath)) {
            console.error('错误：找不到 test.svg 文件');
            return;
        }

        // 读取 SVG 文件
        const svgContent = fs.readFileSync(svgPath, 'utf8');

        // 启动浏览器
        const browser = await puppeteer.launch({
            executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', // macOS Chrome 路径
            headless: 'new'
        });

        // 创建新页面
        const page = await browser.newPage();
        
        // 设置视口大小
        await page.setViewport({
            width: 320,
            height: 200,
            deviceScaleFactor: 2 // 提高清晰度
        });

        // 创建临时 HTML 文件
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { margin: 0; padding: 0; }
                    svg { width: 100%; height: 100%; }
                </style>
            </head>
            <body>
                ${svgContent}
            </body>
            </html>
        `;

        // 设置页面内容
        await page.setContent(htmlContent);

        // 等待 SVG 渲染完成
        await page.waitForTimeout(100);

        // 截图
        await page.screenshot({
            path: pngPath,
            omitBackground: true
        });

        // 关闭浏览器
        await browser.close();

        console.log('转换成功！');
        console.log(`PNG 文件已保存到: ${pngPath}`);
    } catch (error) {
        console.error('转换过程中发生错误:', error);
        console.error('错误详情:', error.message);
    }
}

// 执行转换
convertSvgToPng(); 