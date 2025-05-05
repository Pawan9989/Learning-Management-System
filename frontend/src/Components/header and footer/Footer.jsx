import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import '../css/style.css'

function Footer(){
  return(
  <section id='footer'>
     <footer>
        <div className="footer-col">
          <h3>Master Courses</h3>
          <li>Java Fullstack Developer</li>
          <li>Devops</li>
          <li>Machine Learning</li>
          {/* <li>Project Fundamentals</li> */}
        </div>
        <div className="footer-col">
          <h3>Intermediate Courses</h3>
          <li>Python</li>
          <li>SQL</li>
          <li>Javascript</li>
          {/* <li>Project Fundamentals</li> */}
        </div>
        <div className="footer-col">
          <h3>Beginner Courses</h3>
          <li>HTML</li>
          <li>CSS</li>
          <li>Java Essentials</li>
          {/* <li>Project Fundamentals</li> */}
        </div>
        <div className="copyright">
          <p>Copyright ©2025 All rights reserved</p>
          <div className="pro-links">
            <FontAwesomeIcon icon={faFacebookF} className="i"/>
            <FontAwesomeIcon icon={faInstagram} className="i"/>
            <FontAwesomeIcon icon={faLinkedinIn} className="i"/>
          </div>
        </div>
        </footer>
      </section>
  )
}
export default Footer;