import { Drawer, Badge, Descriptions, Image } from "antd";
import moment from "moment";
import { FORMAT_DATE_DISPLAY } from "../../../utils/constant";

const BookViewDetail = (props) => {
  const {
    openViewDetail,
    setOpenViewDetail,
    dataViewDetail,
    setDataViewDetail,
  } = props;

  const onClose = () => {
    setOpenViewDetail(false);
    setDataViewDetail(null);
  };

  const baseImageURL = `${import.meta.env.VITE_BACKEND_URL}/images/book`;

  return (
    <Drawer
      title="Chi tiết sách"
      width={"50vw"}
      onClose={onClose}
      open={openViewDetail}
    >
      <Descriptions title="Thông tin sách" bordered column={2}>
        <Descriptions.Item label="ID">{dataViewDetail?._id}</Descriptions.Item>
        <Descriptions.Item label="Tên sách">
          {dataViewDetail?.mainText}
        </Descriptions.Item>

        <Descriptions.Item label="Tác giả">
          {dataViewDetail?.author}
        </Descriptions.Item>
        <Descriptions.Item label="Thể loại">
          {dataViewDetail?.category}
        </Descriptions.Item>

        <Descriptions.Item label="Giá tiền">
          {dataViewDetail?.price?.toLocaleString()} VNĐ
        </Descriptions.Item>
        <Descriptions.Item label="Đã bán">
          {dataViewDetail?.sold}
        </Descriptions.Item>

        <Descriptions.Item label="Tồn kho">
          <Badge
            status={dataViewDetail?.quantity > 0 ? "success" : "error"}
            text={`${dataViewDetail?.quantity} quyển`}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Ngày tạo">
          {moment(dataViewDetail?.createdAt).format(FORMAT_DATE_DISPLAY)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {moment(dataViewDetail?.updatedAt).format(FORMAT_DATE_DISPLAY)}
        </Descriptions.Item>

        {dataViewDetail?.thumbnail && (
          <Descriptions.Item label="Ảnh bìa" span={2}>
            <Image
              width={150}
              src={`${baseImageURL}/${dataViewDetail.thumbnail}`}
              alt="Ảnh sách"
              style={{ border: "1px solid #ccc", padding: 4 }}
            />
          </Descriptions.Item>
        )}
      </Descriptions>
    </Drawer>
  );
};

export default BookViewDetail;
