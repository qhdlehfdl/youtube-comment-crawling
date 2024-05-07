import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Thumbnail(props) {
  const [isLoading, setIsLoading] = useState(false);

  const searchComment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/crawl/comment?searchValue=${props.channelID}`);
      const data = await response.json();
      props.settingComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    };
  }
  
  return (
    <div className="col-2 m-4" >
      <div>
        <a onClick={searchComment}>
          <img className="card-img-top rounded-circle" src={props.imgSrc} alt={props.channelName}></img>
          <p>{props.channelName}</p>
        </a>
      </div>
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

function Comment(props) {
  return (
    <div className="row">
      {props.comments && props.comments.map((content, index) => (
        <div className="col-lg col-sm-6" key={index}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{content.comment}</h5>
              <a href={`https://www.youtube.com${content.url}`} target="_blank">
                <img src={content.imgSrc} className="card-img-top" />
                <p className="card-text">{content.title}</p>
              </a>
              <p className="card-text">좋아요 수: {content.good}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [inputValue, setInputValue] = useState("");
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);

  const searchChannel = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8080/crawl/channel?searchValue=${inputValue}`
      );
      const data = await response.json();
      setThumbnails(data);
      setComments([]);
      setShowThumbnails(true);
      setShowComments(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="container text-center">
        <h4 className="m-4">유튜브 베스트 댓글</h4>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          placeholder="유튜브 채널명"
        ></input>
        <button className="btn btn-primary" onClick={searchChannel}>
          검색
        </button>

        {isLoading && <p>Loading...</p>}

        <div className="row">
          {showThumbnails ? (thumbnails.length !== 0 ? thumbnails.map((thumbnail, index) => (
            <Thumbnail
              key={index}
              channelName={thumbnail.channelName}
              channelID={thumbnail.channelID}
              imgSrc={thumbnail.imgSrc}
              settingComments={(data) => {
                console.log(data);
                setComments(data);
                setShowComments(true);
              }}
            ></Thumbnail>
          )) : <p>검색 결과가 없습니다</p>) : null}
        </div>

      
        {showComments ? (comments.length > 0 ? <Comment comments={comments}></Comment> : <p>댓글이 없습니다</p>):null}
        
      </div>
      
    </Router>
  );
}

  export default App;
