import classnames from "classnames";
import { Fragment, useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

import Avatar from "@components/avatar";
import useJwt from "@src/auth/jwt/useJwt";
import { formatDate } from "@utils";

import {
  ChevronLeft,
  CornerUpLeft,
  CornerUpRight,
  MoreVertical,
  Star,
  Trash,
  Trash2,
} from "react-feather";

import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

const MailDetails = ({
  mailId,
  openMail,
  setOpenMail,
  labelColors,
  formatDateToMonthShort,
}) => {
  const [mail, setMail] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mailId || !openMail) return;
    
    const fetchMail = async () => {
      setLoading(true);
      try {
        const res = await useJwt.getMail();
        setMail(res.data);
      } catch (err) {
        console.error("Failed to load mail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMail();
  }, [mailId, openMail]);

  const updateMail = async (payload) => {
    if (!mail) return;
    await useJwt.updateMail(mail.id, payload);
    setMail((prev) => ({ ...prev, ...payload }));
  };

  const handleGoBack = () => setOpenMail(false);

  const renderLabels = (labels = []) =>
    labels.map((label) => (
      <Badge
        key={label}
        color={`light-${labelColors[label]}`}
        className="me-50 text-capitalize"
        pill
      >
        {label}
      </Badge>
    ));

  const renderAttachments = (arr = []) =>
    arr.map((item, index) => (
      <a
        key={item.fileName}
        href="/"
        onClick={(e) => e.preventDefault()}
        className={classnames({ "mb-50": index + 1 !== arr.length })}
      >
        <img
          src={item.thumbnail}
          alt={item.fileName}
          width="16"
          className="me-50"
        />
        <span className="text-muted fw-bolder">{item.fileName}</span>
        <span className="text-muted font-small-2 ms-25">({item.size})</span>
      </a>
    ));

  const renderMessage = (obj) => (
    <Card>
      <CardHeader className="email-detail-head">
        <div className="user-details d-flex align-items-center">
          <Avatar img={obj.from.avatar} className="me-75" />
          <div>
            <h5 className="mb-0">{obj.from.name}</h5>
            <small>{obj.from.email}</small>
          </div>
        </div>

        <div className="mail-meta-item">
          <small className="text-muted">{formatDate(obj.time)}</small>
          <UncontrolledDropdown>
            <DropdownToggle tag="span">
              <MoreVertical size={14} />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>
                <CornerUpLeft size={14} className="me-50" /> Reply
              </DropdownItem>
              <DropdownItem>
                <CornerUpRight size={14} className="me-50" /> Forward
              </DropdownItem>
              <DropdownItem onClick={() => updateMail({ folder: "trash" })}>
                <Trash2 size={14} className="me-50" /> Delete
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </CardHeader>

      <CardBody dangerouslySetInnerHTML={{ __html: obj.message }} />

      {obj.attachments?.length ? (
        <CardFooter>{renderAttachments(obj.attachments)}</CardFooter>
      ) : null}
    </Card>
  );

  return (
    <div className={classnames("email-app-details", { show: openMail })}>
      {loading || !mail ? null : (
        <Fragment>
          <div className="email-detail-header">
            <div className="email-header-left">
              <ChevronLeft size={20} onClick={handleGoBack} />
              <h4 className="mb-0">{mail.subject}</h4>
            </div>

            <div className="email-header-right">
              <Star
                size={18}
                className={classnames({ "text-warning": mail.isStarred })}
                onClick={() => updateMail({ isStarred: !mail.isStarred })}
              />
              <Trash
                size={18}
                onClick={() => {
                  updateMail({ folder: "trash" });
                  handleGoBack();
                }}
              />
            </div>
          </div>

          <PerfectScrollbar className="email-scroll-area">
            <Row>
              <Col sm="12">
                <div className="email-label">{renderLabels(mail.labels)}</div>
              </Col>
            </Row>

            {renderMessage(mail)}
          </PerfectScrollbar>
        </Fragment>
      )}
    </div>
  );
};

export default MailDetails;
