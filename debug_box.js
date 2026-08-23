const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/anniversary?edit');
  await page.waitForSelector('iframe');
  
  // Click the heart to select it
  const frames = await page.frames();
  const iframe = frames.find(f => f.url().includes('/anniversary'));
  await page.waitForTimeout(2000); // let things settle
  
  const heart = await iframe.$('.custom_heart_solid_d2a801c6');
  if (heart) {
    await heart.click();
    await page.waitForTimeout(1000);
    
    const box = await page.$('.amBox');
    if (box) {
      const boxRect = await box.boundingBox();
      console.log('Selection box bounds:', boxRect);
      
      const heartRect = await iframe.evaluate(() => {
        const h = document.querySelector('.custom_heart_solid_d2a801c6');
        return h.getBoundingClientRect();
      });
      console.log('Heart bounds inside iframe:', heartRect);
      
      const iframeElement = await page.$('iframe');
      const iframeRect = await iframeElement.boundingBox();
      console.log('Iframe bounds:', iframeRect);
      
      const unrotated = await page.evaluate(() => {
        const iframeDoc = document.querySelector('iframe').contentDocument;
        const el = iframeDoc.querySelector('.custom_heart_solid_d2a801c6');
        const cs = iframeDoc.defaultView.getComputedStyle(el);
        return {
          cw: cs.width,
          ch: cs.height,
          clientWidth: el.clientWidth,
          clientHeight: el.clientHeight,
          attrW: el.getAttribute('width'),
          offsetWidth: el.offsetWidth
        };
      });
      console.log('Unrotated values:', unrotated);
    } else {
      console.log('No selection box found');
    }
  } else {
    console.log('Heart not found');
  }
  
  await browser.close();
})();
