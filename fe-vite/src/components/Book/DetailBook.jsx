import { Breadcrumb } from "antd";
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
import BookLoader from "./BookLoader";
import { Divider } from "antd";

import "./detailBook.scss";

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

  return (
    <>
      <div className="detail">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: (
                <a style={{ textDecoration: "none" }} href="/">
                  Trang chủ
                </a>
              ),
            },
            {
              title: (
                <a style={{ textDecoration: "none", color: "blue" }} href="#">
                  Chi tiết sách
                </a>
              ),
            },
          ]}
        />

        <Divider />

        <div className="detail-book">
          {dataBook && dataBook._id ? (
            <>
              <div className="detail-book__img">
                <ImageGallery
                  items={galleryImages}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  showNav={true} // vẫn giữ true nếu muốn dùng swipe hoặc keyboard
                  slideOnThumbnailOver={true}
                  renderLeftNav={() => <></>}
                  renderRightNav={() => <></>}
                />
              </div>
              <div className="detail-book_info">
                <h4>{dataBook.mainText}</h4>
                <div className="author">
                  Tác giả: <i>{dataBook.author}</i>
                </div>
                <h5>
                  {new Intl.NumberFormat("vi-VN").format(dataBook?.price || 0)}{" "}
                  <small>đ</small>
                </h5>
                <div className="sold">Đã bán: {dataBook.sold}</div>

                <div>
                  <h6>Vận chuyển: Miễn phí vận chuyển</h6>
                  <div className="count">
                    <span className="quantity">Số lượng:</span>
                    <button onClick={handleMinus}>-</button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleChange}
                    />
                    <button onClick={handlePlus}>+</button>
                  </div>
                </div>

                <div>
                  <button className="addToCart" onClick={handleAddToCart}>
                    <BsCartPlus />
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>{" "}
            </>
          ) : (
            <BookLoader />
          )}
        </div>
      </div>
    </>
  );
};

export default DetailBook;
