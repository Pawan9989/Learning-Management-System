import React from "react";
import { useUserContext } from "./UserContext";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import logo from "./images/logo.png";
import c1 from "./images/c1.jpg";
import c2 from "./images/html.png";
import c3 from "./images/sql.jpg";
import c4 from "./images/python.jpg";
import c5 from "./images/java.png";
import c6 from "./images/css.png";
import "./css/style.css";
import GeminiChatbot from "./GeminiChatbot";
import {
  faGraduationCap,
  faAward,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";
import { useNavigate } from "react-router-dom";
import Footer from "./header and footer/Footer";

function Home() {
  const navigate = useNavigate();
  const authToken = localStorage.getItem("token");
  return (
    <div>
      <Navbar page={"home"} />
      <div>
        <section id="home">
          <h2>Enhance your future with Learning Management System</h2>
          <p>
            {" "}
            <strong>LMS</strong> Academy is a massive open online course provider, and its
            learning experience arranges coursework into a series of modules and
            lessons that can include videos, text notes, and assessment tests.
          </p>
          <div className="btn">
            <a className="blue" href="http://localhost:3000/#features">
              Learn More
            </a>
            <a className="yellow" href="http://localhost:3000/courses">
              Visit Courses
            </a>
          </div>
        </section>
        <section id="features">
          <h1>Awesome Features</h1>
          <p>Chance to enhance yourself</p>
          <div className="fea-base">
            <div className="fea-box">
              <FontAwesomeIcon icon={faGraduationCap} className="i" />
              <h3>Upskilling</h3>
              <p>Education is not preparation for life, education is life itself. </p>
            </div>
            <div className="fea-box">
              <FontAwesomeIcon icon={faStar} className="i" />
              <h3>Valuable Courses</h3>
              <p>
                Online education is like a rising tide, it's going to lift all
                boats.{" "}
              </p>
            </div>
            <div className="fea-box">
              <FontAwesomeIcon icon={faAward} className="i" />
              <h3>Global Certification</h3>
              <p>
                A certificate without knowledge is like a gun without bullets in
                your hand.{" "}
              </p>
            </div>
          </div>
        </section>
        <section id="course">
          <h1>Our Popular Courses</h1>
          {/* <p>10,000+ enrolled</p> */}
          <div className="course-box">
            {/* ... (Course content here) */}
            <div className="courses">
              <img src={c1} alt="" />
              <div className="details">
                <p>Updated 01/05/2025</p>
                <h6>
                  <Link to = "/courses"> JavaScript Beginner Course </Link>
                  </h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  {/* <p>(239)</p> */}
                </div>
              </div>
              {/* <div className="cost">₹999</div> */}
            </div>
            <div className="courses">
              <img src={c2} alt="" />
              <div className="details">
                <p>Updated 01/05/2025</p>
                <h6>
                <Link to = "/courses"> HTML Complete Course </Link>
                </h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  {/* <p>(178)</p> */}
                </div>
              </div>
              {/* <div className="cost">₹799</div> */}
            </div>
            <div className="courses">
              <img src={c3} alt="" />
              <div className="details">
                <p>Updated 01/05/2025</p>
                <h6>
                <Link to = "/courses"> SQL Beginner Course </Link>
                </h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  {/* <p>(258)</p> */}
                </div>
              </div>
              {/* <div className="cost">₹499</div> */}
            </div>
            <div className="courses">
              <img src={c4} alt="" />
              <div className="details">
                <p>Updated 03/05/2025</p>
                <h6>
                <Link to = "/courses"> Python Master Course </Link>
                </h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  {/* <p>(550)</p> */}
                </div>
              </div>
              {/* <div className="cost">₹1499</div> */}
            </div>
            <div className="courses">
              <img src={c5} alt="" />
              <div className="details">
                <p>Updated 05/05/2025</p>
                <h6>
                <Link to = "/courses"> Java Essentials </Link>
                </h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  {/* <p>(783)</p> */}
                </div>
              </div>
              {/* <div className="cost">₹1999</div> */}
            </div>
            <div className="courses">
              <img src={c6} alt="" />
              <div className="details">
                <p>Updated 06/05/2025</p>
                <h6>
                <Link to = "/courses"> CSS Complete Course </Link>
                </h6>
                <div className="star">
                  {[...Array(5)].map((_, index) => (
                    <FontAwesomeIcon key={index} icon={faStar} className="i" />
                  ))}
                  {/* <p>(439)</p> */}
                </div>
              </div>
              {/* <div className="cost">₹499</div> */}
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
      <GeminiChatbot />
    </div>
  );
}
export default Home;
