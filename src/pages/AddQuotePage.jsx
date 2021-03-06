import { useState } from "react";
import quoteSchema from "../validation/quote.validation";
import Joi from "joi-browser";
import { useNavigate } from "react-router-dom";
import ErrorPopupComponent from "../components/ErrorPopupComponent";

import jwt from "jwt-decode";

import "../style/select.css";
import "../style/addQuote.css";
import axios from "axios";

const AddQuotePage = (props) => {
  const [keyedBy, setKeyedBy] = useState("");
  const [mediaType, setMediaType] = useState("Media type");
  const [source, setSource] = useState("");
  const [quote, setQuote] = useState("");
  const [link, setLink] = useState("");
  const [language, setLanguage] = useState("Language");
  const navigate = useNavigate();
  const token = localStorage.getItem("tokenKey");
  const user = jwt(token);

  const [trigger, setTrigger] = useState(false);
  const [addQuoteErr, setAddQuoteErr] = useState("");

  const handleKeyedBy = (event) => {
    setKeyedBy(event.target.value);
  };

  const handleMediaType = (event) => {
    setMediaType(event.target.value);
  };

  const handleLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const handleSource = (event) => {
    setSource(event.target.value);
  };

  const handleQuote = (event) => {
    setQuote(event.target.value);
  };

  const handleLink = (event) => {
    setLink(event.target.value);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setAddQuoteErr("");

    const createdBy = user.userName;

    if (mediaType === "Media type") {
      setAddQuoteErr("please select a media type");
      setTrigger(true);
      return;
    }
    if (language === "Language") {
      setAddQuoteErr("please select a language");
      setTrigger(true);
      return;
    }

    const validatedValue = Joi.validate(
      {
        quote,
        keyedBy,
        language,
        source,
        link,
        mediaType,
        createdBy,
      },
      quoteSchema,
      { abortEarly: false }
    );

    const { error } = validatedValue;
    if (error) {
      switch (error.details[0].context.label) {
        case "quote":
          setAddQuoteErr("Quote field must contain at least 2 characters");
          break;
        case "keyedBy":
          setAddQuoteErr("Keyed-by field is mendatory");
          break;
        case "source":
          setAddQuoteErr("Source field must contain at least 2 characters");
          break;
        case "link":
          setAddQuoteErr("Link field is mendatory");
          break;
      }
      setTrigger(true);
      return;
    } else {
      axios
        .post("/quotes/newquote", {
          quote,
          keyedBy,
          language,
          source,
          link,
          mediaType,
          createdBy,
        })
        .then((res) => {
          navigate("/quotes");
        })
        .catch((err) => {
          if (err.response) {
            setAddQuoteErr("Server error : Please try again.");
            setTrigger(true);
          }
        });
    }
  };

  return (
    <div className="add-quote-page">
      <div className="add-quote-box">
        <form className="add-quote-form" onSubmit={handleOnSubmit}>
          <div className="add-quote-header">
            <h2>Create a quote</h2>
          </div>
          <div className="add-quote-flex">
            <div className="add-quote-field">
              <label className="" htmlFor="quote">
                "Quote"
              </label>
              <textarea
                
                id="quote"
                className=""
                value={quote}
                onChange={handleQuote}
              />
            </div>

            <div className="add-quote-field">
              <div className="box">
                <div className="select">
                  <select
                    name="mediaType"
                    id="format"
                    defaultValue={mediaType}
                    onChange={handleMediaType}
                  >
                    <option disabled>Media type</option>
                    <option value="music">Music</option>
                    <option value="video-games">Video Games</option>
                    <option value="cinema-tv">Cinema / TV</option>
                    <option value="proverbs">Proverbs</option>
                    <option value="literature">Literature</option>
                    <option value="social-media">Social Media</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="add-quote-field">
              <div className="box">
                <div className="select">
                  <select
                    name="format"
                    id="format"
                    defaultValue={language}
                    onChange={handleLanguage}
                  >
                    <option disabled>Language</option>
                    <option value="english">English</option>
                    <option value="japanese">Japanese</option>
                    <option value="hebrew">Hebrew</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="add-quote-field">
              <label className="" htmlFor="keyedBy">
                Keyed by
              </label>

              <input
                type="text"
                id="keyedBy"
                className=""
                value={keyedBy}
                onChange={handleKeyedBy}
              />
            </div>

            <div className="add-quote-field">
              <label className="" htmlFor="source">
                Quote source
              </label>

              <input
                type="text"
                id="source"
                className=""
                value={source}
                onChange={handleSource}
              />
            </div>

            <div className="add-quote-field">
              <label className="" htmlFor="link">
                Link to quote source
              </label>
              <input
                type="text"
                id="link"
                className=""
                value={link}
                onChange={handleLink}
              />
            </div>

            <div className="add-quote-btn-container">
              <button className="add-quote-btn">Add quote</button>
            </div>
          </div>
        </form>
      </div>
      <ErrorPopupComponent trigger={trigger} setTrigger={setTrigger}>
        {addQuoteErr}
      </ErrorPopupComponent>
    </div>
  );
};

export default AddQuotePage;
