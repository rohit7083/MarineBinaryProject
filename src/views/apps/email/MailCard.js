/* ---------- Helpers ---------- */

const htmlToText = (html) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const getPreviewText = (html, sentenceCount = 2) => {
  const text = htmlToText(html).replace(/\s+/g, " ").trim();

  if (!text) return "No preview available";

  const sentences = text.match(/[^.!?]+[.!?]+/g);

  if (!sentences) {
    return text.split(" ").slice(0, 30).join(" ") + "…";
  }

  return sentences.slice(0, sentenceCount).join(" ").trim();
};

/* ---------- Component ---------- */

const MailCard = ({ mail, formatDateToMonthShort, onOpenMail, onMarkRead }) => {


  const handleClick = () => {
    onOpenMail(mail.id);
    if (!mail.isRead) onMarkRead(mail.id);
  };

  const baseBg = mail.isSelected
    ? "rgba(13, 110, 253, 0.1)"
    : mail.isRead
    ? "#f8f9fa"
    : "#ffffff";

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "12px",
        borderBottom: "1px solid #dee2e6",
        cursor: "pointer",
        backgroundColor: baseBg,
        margin:' 0px -27px',
      }}
      onMouseEnter={(e) => {
        if (!mail.isSelected) {
          e.currentTarget.style.backgroundColor = "#e9ecef";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = baseBg;
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          marginRight: 12,
          backgroundColor: "#0d6efd",
          color: "#fff",
          borderRadius: "50%",
          fontSize: "0.875rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {mail.createdBy?.name?.charAt(0)?.toUpperCase() || "U"}
      </div>

      {/* Content */}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: mail.isRead ? 400 : 600,
                color: mail.isRead ? "#6c757d" : "#212529",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {mail?.toEmail || "Unknown"}
            </span>

            {!mail.isRead && (
              <span
                style={{
                  width: 8,
                  height: 8,
                  backgroundColor: "#0d6efd",
                  borderRadius: "50%",
                  flexShrink: 0,
                }}
              />
            )}
          </div>

          <span
            style={{
              fontSize: "0.75rem",
              color: "#6c757d",
              whiteSpace: "nowrap",
            }}
          >
            {formatDateToMonthShort(mail.createdAt)}
          </span>
        </div>

        <h6
          style={{
            fontSize: "0.875rem",
            margin: "0 0 2px 0",
            fontWeight: mail.isRead ? 400 : 500,
            color: mail.isRead ? "#6c757d" : "#212529",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {mail.subject}
        </h6>

        <p
          style={{
            fontSize: "0.75rem",
            color: "#6c757d",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {getPreviewText(mail?.body, 2)}
        </p>

        <span
          style={{
            fontSize: "0.7rem",
            color: "#adb5bd",
          }}
        >
          ID: {mail.id}
        </span>
      </div>

      {/* Actions */}
      <div
        style={{
          marginLeft: 12,
          display: "flex",
          gap: 8,
          opacity: 0,
          transition: "opacity 0.2s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = 1;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = 0;
        }}
      >
        {mail.hasAttachment && <span>📎</span>}
        <span
          style={{
            color: mail.isStarred ? "#ffc107" : "#adb5bd",
          }}
        >
          {mail.isStarred ? "⭐" : "☆"}
        </span>
      </div>

      
    </div>
  );
};

export default MailCard;
