import { Breadcrumb } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsCartPlus } from "react-icons/bs";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { callGetDetailBook } from "../../services/api";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doAddBookAction } from "../../redux/order/orderSlice";

const DetailBook = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const bookId = searchParams.get("id");

  const dispatch = useDispatch();

  const [dataBook, setDataBook] = useState();
  const [quantity, setQuantity] = useState(1);

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    fetchDataBook(bookId);
  }, []);

  useEffect(() => {
    if (dataBook && dataBook.thumbnail) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL; // nếu dùng Vite
      const mainImage = {
        original: `${backendUrl}/images/book/${dataBook.thumbnail}`,
        thumbnail: `${backendUrl}/images/book/${dataBook.thumbnail}`,
      };

      const sliderImages = dataBook.slider.map((img) => ({
        original: `${backendUrl}/images/book/${img}`,
        thumbnail: `${backendUrl}/images/book/${img}`,
      }));

      setGalleryImages([mainImage, ...sliderImages]);
    }
  }, [dataBook]);

  const fetchDataBook = async (id) => {
    const res = await callGetDetailBook(id);

    if (res && res.data) {
      console.log(res.data);
      setDataBook(res.data);
      setQuantity(1);
    }
  };

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1); // sau này giới hạn theo book.quantity
  };

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!dataBook) return;

    dispatch(
      doAddBookAction({
        quantity,
        detail: dataBook,
        _id: dataBook._id,
      })
    );
  };

  const LeftSlide = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="left-slide">
        <ImageGallery
          items={images}
          showFullscreenButton={false}
          showPlayButton={false}
          showNav={true}
          slideOnThumbnailOver={true}
        />
      </div>
    );
  };

  return (
    <>
      <div
        className="view-detail-page"
        style={{ padding: "20px", minHeight: "100vh" }}
      >
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
            Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Chi tiết sách</Breadcrumb.Item>
        </Breadcrumb>

        <Row
          className="mt-3"
          style={{ background: "#fff", padding: "20px", borderRadius: "8px" }}
        >
          {/* Cột trái - ảnh sách */}
          <Col md={5} sm={12}>
            <LeftSlide images={galleryImages} />
          </Col>

          {/* Cột phải - thông tin sách */}
          <Col md={7} sm={12}>
            {dataBook && (
              <div className="right-slide">
                <h4>{dataBook.mainText}</h4>
                <div className="text-muted mb-2">
                  Tác giả: <i>{dataBook.author}</i>
                </div>
                <h5 className="text-danger">
                  {dataBook?.price} <small>đ</small>
                </h5>
                <div className="text-muted mb-3">Đã bán: {dataBook.sold}</div>

                <div className="mb-3">
                  <h6>Vận chuyển: Miễn phí vận chuyển</h6>
                  <span className="me-2">Số lượng:</span>
                  <InputGroup className="mt-2" style={{ width: "150px" }}>
                    <Button variant="outline-secondary" onClick={handleMinus}>
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={handleChange}
                    />
                    <Button variant="outline-secondary" onClick={handlePlus}>
                      +
                    </Button>
                  </InputGroup>
                </div>

                <div className="d-flex gap-2 mt-3">
                  <Button
                    variant="outline-primary"
                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                    style={{
                      borderColor: "#1ba9ff",
                      color: "#1ba9ff",
                      backgroundColor: "transparent",
                    }}
                    onClick={handleAddToCart}
                  >
                    <BsCartPlus style={{ marginRight: "5px" }} />
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    className="flex-grow-1 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#1ba9ff",
                      borderColor: "#1ba9ff",
                      color: "white",
                    }}
                  >
                    <FaMoneyCheckAlt style={{ marginRight: "5px" }} />
                    Mua ngay
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default DetailBook;
