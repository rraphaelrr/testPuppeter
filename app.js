const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Ir para a página https://t.17track.net/pt
  await page.goto('https://t.17track.net/pt');

  // Inserir o código no textarea
  await page.waitForSelector('#jsTrackBox');

  await page.evaluate(() => {
    document.querySelector("textarea").value = "LP00557310039118";
  });
  // Clicar no botão de busca
  await Promise.all([
    page.click("#yqiTrackBtn"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);

  // Capturar os dados da página de resultados
  const trackData = await page.evaluate(() => {
    const source = document.querySelector(".provider-name").textContent;
    const code = document.querySelector(".text-uppercase").textContent;
    const origin = document.querySelector(".provider-name").textContent;
    const destiny = document.querySelector(".base-info > span").textContent;
    const path = Array.from(document.querySelectorAll(".trn-block")).map((item) => {
      const desc = item.querySelector("div > time ").textContent;
      const date = item.querySelector("div > p").textContent;
      return { desc, date };
    });

    /* Imprimir Json */
    return {
      TrackCode: code,
      TrackResult: {
        source,
        code,
        origin,
        destiny,
        path,
      },
    };
  });

  console.log(JSON.stringify([trackData], null, 2));

  

  await browser.close();
})();
