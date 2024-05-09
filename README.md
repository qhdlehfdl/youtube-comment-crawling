## 프로젝트 소개
유튜브 채널 검색해서 좋아요 댓글 TOP5 보여줌

## ⚙️개발환경
* nodejs(v20.9.0)
* React
* axios
* puppeteer

## 🖥️화면 구성
![화면 캡처 2024-05-07 162504](https://github.com/qhdlehfdl/youtube-comment-crawling/assets/74577699/da293c2c-9619-4fe6-87af-34d2e7058e9c)
![화면 캡처 2024-05-07 162804](https://github.com/qhdlehfdl/youtube-comment-crawling/assets/74577699/4719f585-6ff9-4a24-863f-6681d0168827)

## ⛓️로직
최신영상 5개를 순차적으로 돌면서 영상당 대략 40개 정도의 댓글을 모은 후 약 200개 정도의 댓글 중에서 좋아요 순으로 5개를 추린다. 댓글이 막힌 경우나 댓글이 아예 없는 경우는 댓글이 없습니다라고 뜸. 

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

autoScroll 함수는 유튜브 영상페이지 들어가서 자동으로 스크롤하는 함수이다.
위 함수의 아쉬운 점은 스크롤을 내릴때마다 2초의 interval을 가지는 것인데 유튜브 특성상스크롤을 끝까지 내려야 동적으로 댓글이 로딩된다.
크롤링 시간을 줄이려면 스크롤을 내릴때마다가 아니라 스크롤을 끝까지 내렸을때만댓글 로딩을 기다리는 interval을 가지면 크롤링 시간을 줄일 수 있을것이다.
하지만 구현하지 못했다.
