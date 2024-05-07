const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
//puppeteer는 동적페이지 크롤링 => 페이지가 완전히 로드된후 크롤링
const puppeteer = require("puppeteer");
const app = express();

app.use(cors());

app.get("/crawl/channel", async (req, res) => {
  try {
    let datas = [];
    const searchValue = req.query.searchValue;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(
      `https://www.youtube.com/results?search_query=${searchValue}`
    );
    // await page.waitForSelector("#subscribers");

    const htmlString = await page.content();
    const $ = cheerio.load(htmlString);

    const parents = $("div #content-section").slice(0, 10);

    parents.each((index, element) => {
      const channelName = $(element).find("#text").text();
      const channelID = $(element).find("#subscribers").text();
      const imgSrc = $(element).find("#img").attr("src");

      datas.push({
        channelName: channelName,
        channelID: channelID,
        imgSrc: imgSrc,
      });
    });

    await browser.close();
    res.json(datas);
    console.log("success search Channel");
  } catch (error) {
    console.error(error);
    // res.status(500).join({ error: "An Error Occurred" });
  }
});

async function autoScroll(page) {
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
}

async function commentCrawl(browser, url) {
  const page = await browser.newPage();
  await page.goto(`https://www.youtube.com${url}`);

  await autoScroll(page);

  // await page.waitForSelector('ytd-comment-view-model#comment');

  const htmlString = await page.content();
  const $ = cheerio.load(htmlString);

  let bestComments = [];

  //댓글 막힌 경우
  if ($("#contents > ytd-message-renderer").length !== 0) {
    console.log("zz");
    return bestComments;
  }

  const comments = $("ytd-comment-view-model#comment");

  console.log(comments.length);
  const promises = [];
  
  comments.each((index, element) => {
    const comment = $(element)
    .find(
      "span.yt-core-attributed-string.yt-core-attributed-string--white-space-pre-wrap"
    )
    .text();
    let good = parseInt($(element).find("span#vote-count-middle").text());
    if (!good)
    good = 0;
  bestComments.push({ comment: comment, good: good });
  
    
    // const promise = new Promise(async (resolve, reject) => {
    //   const good = parseInt($(element).find("span#vote-count-middle").text()) || 0;
    //   const commentData = { comment: comment, good: good };
    //   resolve(commentData);
    // });
    // promises.push(promise);
  });

  // const results = await Promise.all(promises);
  // bestComments = results;

  await page.close();
  return bestComments;
}

app.get("/crawl/comment", async (req, res) => {
  try {
    const startTime = new Date();

    const searchValue = req.query.searchValue;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.youtube.com/${searchValue}/videos`);

    const htmlString = await page.content();
    const $ = cheerio.load(htmlString);

    //영상개수
    const videos = $("div #content .style-scope.ytd-rich-item-renderer").slice(0, 5);
    
    let bestComment = [];

    for (const element of videos) {
      const url = $(element).find("a#thumbnail").attr("href");
      const imgSrc = $(element).find("img").attr("src");
      const title = $(element).find("#video-title").text();

      const comments = await commentCrawl(browser, url);
      
      comments.forEach((comment) => {
        bestComment.push({
          title: title,
          imgSrc: imgSrc,
          url: url,
          comment: comment.comment,
          good: comment.good,
        });
      });
    }
    console.log('how many comments ', bestComment.length);

    bestComment.sort((a, b) => b.good - a.good);
    bestComment = bestComment.slice(0, 5);

    await browser.close();
    res.json(bestComment);
    
    const endTime = new Date();
    console.log('success comment crawl', endTime - startTime);
  } catch (error) {
    console.error(error);
  }
});

app.listen(8080);
