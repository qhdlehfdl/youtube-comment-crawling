## 프로젝트 소개
유튜브 채널 검색해서 최신 5개 영상에서 좋아요순 댓글 TOP5 보여줌

## ⚙️개발환경
* nodejs(v20.9.0)
* React
* axios
* puppeteer

## 🖥️화면 구성
![화면 캡처 2024-05-07 162504](https://github.com/qhdlehfdl/youtube-comment-crawling/assets/74577699/da293c2c-9619-4fe6-87af-34d2e7058e9c)
![화면 캡처 2024-05-07 162804](https://github.com/qhdlehfdl/youtube-comment-crawling/assets/74577699/4719f585-6ff9-4a24-863f-6681d0168827)

## ✍️후기
문제점은 크롤링 시간이 너무 오래 걸린다.

```async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const distance = 1000;
      const maxScrollHeight = 5885;
      let lastScrollHeight = 0; //스크롤 더 이상 안될때
      let currentScrollHeight = 0;

      const scrollInterval = setInterval( () => {
        const screenHeight = document.documentElement.scrollHeight;
        window.scrollBy(0, distance);
        currentScrollHeight = window.scrollY;

        if (currentScrollHeight === lastScrollHeight || currentScrollHeight >= maxScrollHeight) {
          clearInterval(scrollInterval);
          resolve();
        }
        
        lastScrollHeight = currentScrollHeight;
        
      }, 2000);
    });
  });
}```
