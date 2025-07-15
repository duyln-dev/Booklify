import { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import {
  Form,
  InputGroup,
  Button,
  Container,
  Row,
  Col,
  Card,
  Tabs,
  Tab,
  Pagination,
} from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import "./homepage.scss";
import { callGetCategories, callGetListBook } from "../../services/api";

const Home = () => {
  const navigate = useNavigate();
  const [listCategory, setListCategory] = useState([]);

  const [listBook, setListBook] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
  });

  const [tempFilters, setTempFilters] = useState({
    categories: [],
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    // call listCategory
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchBook();
  }, [current, pageSize, filters]);

  const handleViewDetail = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };

  const convertSlug = (str) => {
    str = nonAccentVietnamese(str);
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();

    // remove accents, swap ñ for n, etc
    const from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
    const to =
      "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
    for (let i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    str = str
      .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
      .replace(/\s+/g, "-") // collapse whitespace and replace by -
      .replace(/-+/g, "-"); // collapse dashes

    return str;
  };

  const nonAccentVietnamese = (str) => {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
  };

  const handleCategoryChangeCheckbox = (e, setFilters) => {
    const { value, checked } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      categories: checked
        ? [...prev.categories, value]
        : prev.categories.filter((c) => c !== value),
    }));
  };

  const handleApplyFilter = () => {
    setFilters({ ...tempFilters });
    setCurrent(1);
  };

  const fetchCategory = async () => {
    const res = await callGetCategories();
    if (res && res.data) {
      const list = res.data.map((item) => {
        return { label: item, value: item };
      });
      setListCategory(list);
    }
  };

  const fetchBook = async () => {
    let query = `current=${current}&pageSize=${pageSize}`;

    // Build filter query
    const { categories, minPrice, maxPrice } = filters;

    if (categories && categories.length > 0) {
      query += `&category=${categories.join(",")}`;
    }

    if (minPrice) {
      query += `&price>=${minPrice}`;
    }

    if (maxPrice) {
      query += `&price<=${maxPrice}`;
    }

    const res = await callGetListBook(query);
    if (res && res.data) {
      console.log(res.data);
      setListBook(res.data.result);
      setTotal(res.data.meta.total);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const renderPaginationItems = () => {
    const items = [];
    const delta = 2;
    const left = Math.max(1, current - delta);
    const right = Math.min(totalPages, current + delta);

    for (let i = left; i <= right; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === current}
          onClick={() => setCurrent(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return items;
  };

  const RatingFilter = () => {
    return (
      <>
        {[4, 3, 2, 1].map((rate) => (
          <Form.Check
            className="mt-2"
            key={rate}
            type="checkbox"
            label={
              <>
                {[...Array(rate)].map((_, i) => (
                  <FaStar key={i} color="gold" />
                ))}
              </>
            }
          />
        ))}
      </>
    );
  };

  const ProductCard = ({ product }) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const imageUrl = `${backendUrl}/images/book/${product.thumbnail}`;
    return (
      <Card className="mb-3" onClick={() => handleViewDetail(product)}>
        <Card.Img
          variant="top"
          src={imageUrl}
          style={{ height: "300px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title
            style={{ fontSize: "1rem", height: "40px", overflow: "hidden" }}
          >
            {product.mainText}
          </Card.Title>
          <Card.Text>{product.price.toLocaleString()} đ</Card.Text>
          <div>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color="gold" size={10} />
            ))}
            <div className="text-muted" style={{ fontSize: "0.8rem" }}>
              Đã bán {product.sold}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const ProductGrid = ({ products }) => {
    return (
      <Row>
        {products.map((product, index) => (
          <Col md={3} key={index}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    );
  };

  const ProductTabs = () => {
    const [key, setKey] = useState("popular");

    const getSortedBooks = (key) => {
      switch (key) {
        case "popular":
          return [...listBook].sort((a, b) => b.sold - a.sold);
        case "new":
          return [...listBook].sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        case "low":
          return [...listBook].sort((a, b) => a.price - b.price);
        case "high":
          return [...listBook].sort((a, b) => b.price - a.price);
        default:
          return listBook;
      }
    };

    return (
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
        <Tab eventKey="popular" title="Phổ biến">
          <ProductGrid products={getSortedBooks("popular")} />
        </Tab>
        <Tab eventKey="new" title="Hàng mới">
          <ProductGrid products={getSortedBooks("new")} />
        </Tab>
        <Tab eventKey="low" title="Giá Thấp Đến Cao">
          <ProductGrid products={getSortedBooks("low")} />
        </Tab>
        <Tab eventKey="high" title="Giá Cao Đến Thấp">
          <ProductGrid products={getSortedBooks("high")} />
        </Tab>
      </Tabs>
    );
  };

  return (
    <>
      <Container fluid>
        <Row className="mt-4">
          <Col md={2}>
            <div className="p-3 border rounded bg-light">
              <h5>Bộ lọc tìm kiếm</h5>
              <hr />
              <div className="mb-3">
                <strong>Danh mục sản phẩm</strong>
                {listCategory.map((item) => (
                  <Form.Check
                    key={item.value}
                    type="checkbox"
                    label={item.label}
                    value={item.value}
                    className="mt-3"
                    checked={tempFilters.categories.includes(item.value)}
                    onChange={(e) => {
                      handleCategoryChangeCheckbox(e, setTempFilters);
                    }}
                  />
                ))}
              </div>

              <div className="mb-3">
                <strong>Khoảng giá</strong>
                <InputGroup className="mb-2 mt-2 align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Từ"
                    style={{ maxWidth: "100px" }}
                    value={tempFilters.minPrice ?? ""}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value,
                      }))
                    }
                  />
                  <span className="mx-2">-</span>
                  <Form.Control
                    placeholder="Đến"
                    style={{ maxWidth: "100px" }}
                    value={tempFilters.maxPrice}
                    onChange={(e) =>
                      setTempFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
                <Button
                  className="mt-2 w-100 p-2"
                  variant="primary"
                  size="sm"
                  onClick={handleApplyFilter}
                >
                  Áp dụng
                </Button>
              </div>

              <div className="mb-3">
                <strong>Đánh giá</strong>
                <RatingFilter />
              </div>
            </div>
          </Col>
          <Col md={10}>
            <ProductTabs />

            <Pagination className="justify-content-center mt-4">
              <Pagination.First
                disabled={current === 1}
                onClick={() => setCurrent(1)}
              />
              <Pagination.Prev
                disabled={current === 1}
                onClick={() => setCurrent(current - 1)}
              />

              {renderPaginationItems()}

              <Pagination.Next
                disabled={current === totalPages}
                onClick={() => setCurrent(current + 1)}
              />
              <Pagination.Last
                disabled={current === totalPages}
                onClick={() => setCurrent(totalPages)}
              />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
