import { Container, Row, Col } from "react-bootstrap";
import { FaFacebookF, FaTwitter, FaInstagram, FaReact } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-light text-dark pt-4 pb-3 border-top mt-5">
      <Container>
        <Row className="text-center text-md-start">
          <Col md={4} className="mb-3">
            <h5 className="fw-bold mb-2">
              <FaReact color="#61dbfb" className="me-2 spin-icon" />
              Booklify
            </h5>
            <p className="text-muted small">
              Nơi cung cấp sách hay, chất lượng và truyền cảm hứng cho bạn mỗi
              ngày.
            </p>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Liên kết</h6>
            <ul className="list-unstyled text-muted small">
              <li>
                <a href="#home" className="text-decoration-none text-muted">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#about" className="text-decoration-none text-muted">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#contact" className="text-decoration-none text-muted">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#faq" className="text-decoration-none text-muted">
                  FAQ
                </a>
              </li>
            </ul>
          </Col>

          <Col md={4} className="mb-3">
            <h6 className="fw-bold">Theo dõi chúng tôi</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="#" className="text-muted">
                <FaFacebookF />
              </a>
              <a href="#" className="text-muted">
                <FaTwitter />
              </a>
              <a href="#" className="text-muted">
                <FaInstagram />
              </a>
            </div>
          </Col>
        </Row>

        <hr />
        <p className="text-center text-muted small mb-0">
          © {new Date().getFullYear()} BookStore. All rights reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
