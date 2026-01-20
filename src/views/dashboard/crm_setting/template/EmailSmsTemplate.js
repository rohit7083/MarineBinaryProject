import ExtensionsHeader from "@components/extensions-header";
import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/editor/editor.scss";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { Col, Row, Spinner } from "reactstrap";
import EditorCompo from "./EditorCompo";
import ShortcodeTable from "./ShortcodeTable";

const TemplateManager = () => {
  const [shortcodes, setShortcodes] = React.useState([]);
  const [loading, setLoading] = useState(false);
  const [isemptySetting, setIsemptySetting] = useState(false);
  const location = useLocation();

  const editTemplate = location?.state?.row;
   (editTemplate);

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (editTemplate) {
      // Local helper to strip HTML tags and return plain text
      const htmlToPlainText = (html) => {
        if (!html) return "";
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
      };

      // Convert HTML body to plain text
      const plainEmailBody = htmlToPlainText(editTemplate.emailBody);

      // For debugging (optional)
       ("Converted Email Body:", plainEmailBody);

      // Reset form with converted values
      reset({
        templateType: {
          value: editTemplate.templateType,
          label: editTemplate.templateTypeLabel || editTemplate.templateType,
        },
        emailTemplate: {
          status: editTemplate.emailStatus ?? false,
          subject: editTemplate.emailSubject || "",
          senderName: editTemplate.emailSenderName || "{{site_name}} Finance",
          senderEmail: editTemplate.emailSenderEmail || "",
          message: plainEmailBody, // ✅ use the plain text version here
        },
        smsTemplate: {
          status: editTemplate.smsStatus ?? false,
          sentFrom: editTemplate.smsSentFrom || "",
          message: editTemplate.smsBody || "",
        },
      });
    }
  }, [editTemplate, reset]);

  const toast = useRef(null);
  const emailTemplate = watch("emailTemplate");
  const smsTemplate = watch("smsTemplate");

  const cleanHtml = (value) => {
    if (!value) return "";
    return value
      .replace(/\s*(<\/?[^>]+>)\s*/g, "$1") // remove indentation
      .replace(/<br\s*\/?>/g, "") // drop redundant <br>
      .trim();
  };

  const onSubmit = async (data) => {
  
     (data);

    const emailStatus = data.emailTemplate.status;
    const smsStatus = data.smsTemplate.status;

    // Validation: At least one template must be enabled
    if (!emailStatus && !smsStatus) {
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: "Please enable at least one template (Email or SMS)",
        life: 3000,
      });
      return;
    }

    // Base payload with required fields
    const payload = {
      templateType: data?.templateType?.value,
    };

    if (emailStatus) {
      const raw = convertToRaw(data.emailTemplate.message.getCurrentContent());
      const html = draftToHtml(raw);
      payload.emailSubject = data.emailTemplate.subject;
      payload.emailStatus = true;
      payload.emailBody = `
    <html>
      <body>
        ${cleanHtml(html)}
      </body>
    </html>
  `.trim();
    } else {
      payload.emailStatus = false;
    }

    // Add SMS fields if SMS is enabled
    if (smsStatus) {
      payload.smsStatus = true;
      payload.smsSentFrom = data.smsTemplate.sentFrom;
      payload.smsBody = data.smsTemplate.message;
    } else {
      payload.smsStatus = false;
    }

     ("Final Payload:", payload);

    try {
      setLoading(true);

      if (editTemplate?.uid) {
        const response = await useJwt.updateTemplate(editTemplate?.uid, payload);
         (response);
        toast.current.show({
          severity: "success",
          summary: "Template Updated",
          detail: "Template Updated sucessfully",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/crm/template/index");
        }, 1999);
      } else {
        const response = await useJwt.createTemaplte(payload);
         (response);
        toast.current.show({
          severity: "success",
          summary: "Template Added",
          detail: "Template Created sucessfully",
          life: 2000,
        });
        setTimeout(() => {
          navigate("/crm/template/index");
        }, 1999);
      }
    } catch (err) {
      console.error("Error submitting template:", err);
      toast.current.show({
        severity: "error",
        summary: "Submission Failed",
        detail: err?.response?.data?.content || "Something went wrong",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Insert variable (shortcode) into either Email Editor or SMS textarea
  const insertVariable = (variable, type) => {
    const shortcode = `{{${variable}}}`;

    if (type === "email") {
      // Insert into WYSIWYG editor (EditorCompo)
      try {
        // Assuming EditorCompo takes HTML string (it does from your setup)
        const currentValue = watch("emailTemplate.message") || "";
        const selection = window.getSelection();

        // If selection is inside the editor, insert shortcode at cursor
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          const node = document.createTextNode(shortcode);
          range.insertNode(node);

          // Move cursor to after inserted shortcode
          range.setStartAfter(node);
          range.setEndAfter(node);
          selection.removeAllRanges();
          selection.addRange(range);

          // Sync editor value to react-hook-form
          const newContent =
            currentValue.substring(0, range.startOffset) +
            shortcode +
            currentValue.substring(range.startOffset);

          setValue("emailTemplate.message", newContent, {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          // Fallback: append shortcode at the end if no active cursor
          setValue("emailTemplate.message", currentValue + shortcode, {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } catch (err) {
        console.warn("Could not insert shortcode into editor:", err);
      }
    } else {
      // Insert into SMS textarea
      const key = "smsTemplate.message";
      const currentValue = watch(key) || "";
      const textarea = document.getElementById("smsMessage");

      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue =
        currentValue.substring(0, start) +
        shortcode +
        currentValue.substring(end);

      setValue(key, newValue, { shouldValidate: true, shouldDirty: true });
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          start + shortcode.length,
          start + shortcode.length
        );
      }, 0);
    }
  };

  useEffect(() => {
    const fetchValuesofTemplate = async () => {
      try {
        const res = await useJwt.getTemplateValues();
         (res);

        if (res?.data?.content?.result?.length === 0) {
          toast.current.show({
            severity: "error",
            summary: "Settings Missing",
            detail: "Setting must be created before creating a template.",
            life: 3000,
          });
          setTimeout(() => {
            navigate("/crm/email_sms_setting");
          }, 2500);
        }

        const resData = res?.data?.content?.result?.map((x, i) => {
          return {
            emailSentFromName: x?.siteName,
            emailSentFromEmail: x?.email,
            smsSentFrom: x?.siteName,
            smsPhoneNumber: x?.phoneNumber,
          };
        });
        setValue("emailTemplate.senderName", resData[0]?.emailSentFromName);

        setValue("emailTemplate.senderEmail", resData[0]?.emailSentFromEmail);
        setValue("smsTemplate.sentFrom", resData[0]?.smsSentFrom);
        setValue("smsTemplate.phoneNumber", resData[0]?.smsPhoneNumber);
      } catch (error) {
         (error);
      }
    };
    fetchValuesofTemplate();
  }, []);
  const templateKeys = [
    "resetPassword",
    "resetPin",
    "subUserLoginDetails",
    "verifyEmail",
    "slipPaymentLink",
    "invoiceWithoutLinkForPos",
    "autoDebitRecipt",
    "invalidPaymentModeNotification",
    "successPaymentNotification",
    "failedPaymentNotification",
    "missingDocumentsReminder",
    "renewalReminder",
    "duePaymentReminder",
    "overduePaymentReminder",
    "slipDiscountOtp",
    "eventDiscountOtp",
    "roomDiscountOtp",
    "sendSms",
    "reSendSms",
    "callOtp",
    "slipDiscountOtpCall",
    "eventDiscountOtpCall",
    "roomDiscountOtpCall",
  ];
  const templateOptions = templateKeys.map((key) => ({
    value: key,
    label: key
      .replace(/([A-Z])/g, " $1") // Add spaces before capital letters
      .replace(/^./, (c) => c.toUpperCase()), // Capitalize first letter
  }));

  return (
    <>
      <ShortcodeTable setShortcodes={setShortcodes} shortcodes={shortcodes} />
      <Toast ref={toast} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container-fluid" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="row">
            <Col md={12} className={"mb-1"}>
              <label className="form-label">
                Select Template Type <span className="text-danger">*</span>
              </label>
              <Controller
                name="templateType"
                control={control}
                rules={{ required: "Template type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={templateOptions}
                    placeholder="Select Template Type..."
                    classNamePrefix="select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#f5f5f5",
                        borderColor: state.isFocused ? "#7367F0" : "#ced4da",
                        boxShadow: "none",
                        "&:hover": { borderColor: "#7367F0" },
                      }),
                    }}
                  />
                )}
              />
              {errors.templateType && (
                <div className="text-danger mt-1 small">
                  {errors.templateType.message}
                </div>
              )}
            </Col>

            {/* Email Template */}
            <div className="col-lg-6 mb-4">
              <div
                className={`card shadow-sm ${
                  !emailTemplate?.status ? "opacity-75" : ""
                }`}
              >
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: "#7367F0" }}
                >
                  <h5 className="mb-0" style={{ color: "white" }}>
                    Email Template
                  </h5>
                  <div className="form-check form-switch mb-0">
                    <Controller
                      name="emailTemplate.status"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="emailStatus"
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          style={{
                            width: "3rem",
                            height: "1.5rem",
                            cursor: "pointer",
                            backgroundColor: value ? "#28c76f" : "#82868b",
                          }}
                        />
                      )}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="emailStatus"
                      style={{ color: "white", fontSize: "0.9rem" }}
                    >
                      {emailTemplate?.status ? "Enabled" : "Disabled"}
                    </label>
                  </div>
                </div>

                <div className="card-body">
                  <Row className="mb-1 mt-1">
                    <Col md={12}>
                      <label className="form-label">
                        Subject{" "}
                        {emailTemplate?.status && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      {/* Subject */}

                      <Controller
                        name="emailTemplate.subject"
                        control={control}
                        rules={{
                          required: emailTemplate?.status
                            ? "Subject is required"
                            : false,
                          minLength: emailTemplate?.status
                            ? {
                                value: 3,
                                message:
                                  "Subject must be at least 3 characters long",
                              }
                            : undefined,
                          pattern: emailTemplate?.status
                            ? {
                                value: /^[A-Za-z0-9 ]+$/,
                                message: "Special characters are not allowed",
                              }
                            : undefined,
                        }}
                        render={({ field }) => (
                          <input
                            type="text"
                            className={`form-control ${
                              errors.emailTemplate?.subject ? "is-invalid" : ""
                            }`}
                            style={{ backgroundColor: "#f5f5f5" }}
                            disabled={!emailTemplate?.status}
                            value={field.value}
                            onChange={(e) => {
                              const sanitized = e.target.value.replace(
                                /[^A-Za-z0-9 ]/g,
                                ""
                              );
                              field.onChange(sanitized);
                            }}
                          />
                        )}
                      />

                      {errors.emailTemplate?.subject && (
                        <div className="invalid-feedback">
                          {errors.emailTemplate.subject.message}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* Sender Fields */}
                  <Row>
                    {/* <Col md={6} className="mb-1">
                      <label className="form-label">
                        Email Sent From - Name
                        {emailTemplate?.status && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      <Controller
                        name="emailTemplate.senderName"
                        control={control}
                        rules={{
                          required: emailTemplate?.status
                            ? "Sender name is required"
                            : false,
                          minLength: emailTemplate?.status
                            ? {
                                value: 2,
                                message:
                                  "Sender name must be at least 2 characters",
                              }
                            : undefined,
                        }}
                        render={({ field }) => (
                          <input
                            type="text"
                            className={`form-control ${
                              errors.emailTemplate?.senderName
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{ backgroundColor: "#f5f5f5" }}
                            disabled={!emailTemplate?.status || true}
                            {...field}
                          />
                        )}
                      />
                      {errors.emailTemplate?.senderName && (
                        <div className="invalid-feedback">
                          {errors.emailTemplate.senderName.message}
                        </div>
                      )}
                    </Col> */}

                    <Col md={12} className="mb-1">
                      <label className="form-label">
                        Email Sent From - Email
                        {emailTemplate?.status && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      <Controller
                        name="emailTemplate.senderEmail"
                        control={control}
                        rules={{
                          required: emailTemplate?.status
                            ? "Sender email is required"
                            : false,
                          pattern: emailTemplate?.status
                            ? {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                              }
                            : undefined,
                        }}
                        render={({ field }) => (
                          <input
                            type="email"
                            className={`form-control ${
                              errors.emailTemplate?.senderEmail
                                ? "is-invalid"
                                : ""
                            }`}
                            style={{ backgroundColor: "#f5f5f5" }}
                            disabled={!emailTemplate?.status || true}
                            {...field}
                          />
                        )}
                      />
                      {errors.emailTemplate?.senderEmail && (
                        <div className="invalid-feedback">
                          {errors.emailTemplate.senderEmail.message}
                        </div>
                      )}
                    </Col>
                  </Row>

                  <ExtensionsHeader
                    title=""
                    subTitle=""
                    link="https://jpuri.github.io/react-draft-wysiwyg/#/docs"
                  />

                  {/* Email Message Editor */}
                  <Row>
                    <Col sm={12}>
                      <Controller
                        name="emailTemplate.message"
                        control={control}
                        render={({ field }) => (
                          <div
                            style={{
                              opacity: emailTemplate?.status ? 1 : 0.6,
                              pointerEvents: emailTemplate?.status
                                ? "auto"
                                : "none",
                            }}
                          >
                            <EditorCompo
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        )}
                      />
                    </Col>
                  </Row>

                  {/* Shortcode Buttons */}
                  {/* <div className="mt-3">
                    <small className="text-muted d-block mb-2">
                      Available Variables:
                    </small>
                    <div className="d-flex flex-wrap gap-1">
                      {shortcodes?.map((variable) => (
                        <button
                          key={variable?.code}
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            insertVariable(variable?.code, "email")
                          }
                          disabled={!emailTemplate.status}
                        >
                          {`{{${variable?.code}}}`}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* SMS Template */}
            <div className="col-lg-6 mb-4">
              <div
                className={`card shadow-sm ${
                  !smsTemplate?.status ? "opacity-75" : ""
                }`}
              >
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  style={{ backgroundColor: "#7367F0" }}
                >
                  <h5 className="mb-0" style={{ color: "white" }}>
                    SMS Template
                  </h5>
                  <div className="form-check form-switch mb-0">
                    <Controller
                      name="smsTemplate.status"
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="smsStatus"
                          checked={value}
                          onChange={(e) => onChange(e.target.checked)}
                          style={{
                            width: "3rem",
                            height: "1.5rem",
                            cursor: "pointer",
                            backgroundColor: value ? "#28c76f" : "#82868b",
                          }}
                        />
                      )}
                    />
                    <label
                      className="form-check-label ms-2"
                      htmlFor="smsStatus"
                      style={{ color: "white", fontSize: "0.9rem" }}
                    >
                      {smsTemplate?.status ? "Enabled" : "Disabled"}
                    </label>
                  </div>
                </div>

                <div className="card-body">
                  <Row className="mb-1 mt-1">
                    {/* <Col md={6}>
                      <label className="form-label">
                        SMS Sent From{" "}
                        {smsTemplate?.status && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      <Controller
                        name="smsTemplate.sentFrom"
                        control={control}
                        rules={{
                          required: smsTemplate?.status
                            ? "Sender name is required"
                            : false,
                          minLength: smsTemplate?.status
                            ? {
                                value: 3,
                                message:
                                  "Sender name must be at least 3 characters",
                              }
                            : undefined,

                          pattern: smsTemplate?.status
                            ? {
                                value: /^[A-Za-z0-9 _.-]+$/,
                                message:
                                  "Sender name may only contain letters, numbers, spaces, dots, underscores, and hyphens",
                              }
                            : undefined,
                        }}
                        render={({ field }) => (
                          <input
                            type="text"
                            className={`form-control ${
                              errors.smsTemplate?.sentFrom ? "is-invalid" : ""
                            }`}
                            style={{ backgroundColor: "#f5f5f5" }}
                            disabled={!smsTemplate?.status || true}
                            {...field}
                          />
                        )}
                      />

                      {errors.smsTemplate?.sentFrom && (
                        <div className="invalid-feedback">
                          {errors.smsTemplate.sentFrom.message}
                        </div>
                      )}
                    </Col> */}
                    <Col md={12}>
                      <label className="form-label">
                        SMS Sent From (Phone Number)
                        {smsTemplate?.status && (
                          <span className="text-danger">*</span>
                        )}
                      </label>

                      <Controller
                        name="smsTemplate.phoneNumber"
                        control={control}
                        rules={{
                          required: smsTemplate?.status
                            ? "Phone number is required"
                            : false,
                          pattern: smsTemplate?.status
                            ? {
                                value: /^[0-9]{13}$/,
                                message: "Enter a valid  phone number",
                              }
                            : undefined,
                        }}
                        render={({ field }) => (
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            className={`form-control ${
                              errors.smsTemplate?.sentFrom ? "is-invalid" : ""
                            }`}
                            style={{ backgroundColor: "#f5f5f5" }}
                            disabled={!smsTemplate?.status || true}
                            {...field}
                          />
                        )}
                      />

                      {errors.smsTemplate?.phoneNumber && (
                        <div className="invalid-feedback">
                          {errors.smsTemplate?.phoneNumber.message}
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* SMS Message */}
                  <div className="mb-3">
                    <label className="form-label">
                      Message{" "}
                      {smsTemplate?.status && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <Controller
                      name="smsTemplate.message"
                      control={control}
                      rules={{
                        required: smsTemplate?.status
                          ? "SMS message is required"
                          : false,
                        minLength: smsTemplate?.status
                          ? {
                              value: 10,
                              message:
                                "Message must be at least 10 characters long",
                            }
                          : undefined,
                        maxLength: smsTemplate?.status
                          ? {
                              value: 500,
                              message: "Message must not exceed 500 characters",
                            }
                          : undefined,
                        validate: smsTemplate?.status
                          ? (value) =>
                              value.trim().length > 0 ||
                              "Message cannot be empty or whitespace only"
                          : undefined,
                      }}
                      render={({ field }) => (
                        <textarea
                          id="smsMessage"
                          rows="8"
                          className={`form-control ${
                            errors.smsTemplate?.message ? "is-invalid" : ""
                          }`}
                          style={{ backgroundColor: "#f5f5f5" }}
                          disabled={!smsTemplate?.status}
                          {...field}
                        />
                      )}
                    />

                    {errors.smsTemplate?.message && (
                      <div className="invalid-feedback">
                        {errors.smsTemplate.message.message}
                      </div>
                    )}
                  </div>

                  {/* SMS Variables */}
                  {/* <div className="mt-3">
                    <small className="text-muted d-block mb-2">
                      Available Variables:
                    </small>
                    <div className="d-flex flex-wrap gap-2">
                      {shortcodes.map((variable) => (
                        <button
                          key={variable?.code}
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => insertVariable(variable?.code, "sms")}
                          disabled={!smsTemplate?.status}
                        >
                          {`{{${variable?.code}}}`}
                        </button>
                      ))}
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="row">
            <div className="col text-end">
              <button
                className="btn btn-primary btn-lg px-5"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <>
                    Loading...
                    <Spinner size={"sm"} />
                  </>
                ) : (
                  <>Save Templates</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default TemplateManager;









// // TemplateManager.jsx
// import ExtensionsHeader from "@components/extensions-header";
// import useJwt from "@src/auth/jwt/useJwt";
// import "@styles/react/libs/editor/editor.scss";
// import { ContentState, convertFromHTML, convertToRaw, EditorState, Modifier } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import { Toast } from "primereact/toast";
// import { useEffect, useRef, useState } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { useLocation, useNavigate } from "react-router-dom";
// import Select from "react-select";
// import { Col, Row, Spinner } from "reactstrap";
// import EditorCompo from "./EditorCompo";
// import ShortcodeTable from "./ShortcodeTable";

// const TemplateManager = () => {
//   const [shortcodes, setShortcodes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const editTemplate = location?.state?.row;

//   // Toast ref
//   const toast = useRef(null);

//   // Helpers to convert HTML <-> EditorState
//   const htmlToEditorState = (html) => {
//     if (!html) return EditorState.createEmpty();
//     // convertFromHTML returns { contentBlocks, entityMap } in draft-js v0.10.x
//     const blocksFromHTML = convertFromHTML(html || "");
//     // blocksFromHTML.contentBlocks may be null if html empty
//     const contentState = ContentState.createFromBlockArray(
//       blocksFromHTML.contentBlocks || [],
//       blocksFromHTML.entityMap || {}
//     );
//     return EditorState.createWithContent(contentState);
//   };

//   const cleanHtml = (value) => {
//     if (!value) return "";
//     return value
//       .replace(/\s*(<\/?[^>]+>)\s*/g, "$1") // remove indentation
//       .replace(/<br\s*\/?>/g, "") // drop redundant <br>
//       .trim();
//   };

//   const {
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     reset,
//     getValues,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       templateType: null,
//       emailTemplate: {
//         status: false,
//         subject: "",
//         senderName: "{{site_name}} Finance",
//         senderEmail: "",
//         // message MUST be EditorState for Draft.js
//         message: EditorState.createEmpty(),
//       },
//       smsTemplate: {
//         status: false,
//         sentFrom: "",
//         phoneNumber: "",
//         message: "",
//       },
//     },
//   });

//   const navigate = useNavigate();

//   // When editing existing template, populate form properly (EditorState for message)
//   useEffect(() => {
//     if (editTemplate) {
//       const emailEditorState = htmlToEditorState(editTemplate.emailBody || "");
//       reset({
//         templateType: {
//           value: editTemplate.templateType,
//           label: editTemplate.templateTypeLabel || editTemplate.templateType,
//         },
//         emailTemplate: {
//           status: editTemplate.emailStatus ?? false,
//           subject: editTemplate.emailSubject || "",
//           senderName: editTemplate.emailSenderName || "{{site_name}} Finance",
//           senderEmail: editTemplate.emailSenderEmail || "",
//           message: emailEditorState,
//         },
//         smsTemplate: {
//           status: editTemplate.smsStatus ?? false,
//           sentFrom: editTemplate.smsSentFrom || "",
//           phoneNumber: editTemplate.smsPhoneNumber || "",
//           message: editTemplate.smsBody || "",
//         },
//       });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [editTemplate, reset]);

//   // Load settings (sender names/emails etc.)
//   useEffect(() => {
//     const fetchValuesofTemplate = async () => {
//       try {
//         const res = await useJwt.getTemplateValues();
//         const result = res?.data?.content?.result;
//         if (!result || result.length === 0) {
//           toast.current.show({
//             severity: "error",
//             summary: "Settings Missing",
//             detail: "Setting must be created before creating a template.",
//             life: 3000,
//           });
//           setTimeout(() => navigate("/crm/email_sms_setting"), 2500);
//           return;
//         }

//         const first = result[0];
//         setValue("emailTemplate.senderName", first?.siteName || "");
//         setValue("emailTemplate.senderEmail", first?.email || "");
//         setValue("smsTemplate.sentFrom", first?.siteName || "");
//         setValue("smsTemplate.phoneNumber", first?.phoneNumber || "");
//       } catch (err) {
//         console.error("Failed to fetch template settings", err);
//       }
//     };

//     fetchValuesofTemplate();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Shortcode keys and options
//   const templateKeys = [
//     "resetPassword",
//     "resetPin",
//     "subUserLoginDetails",
//     "verifyEmail",
//     "slipPaymentLink",
//     "invoiceWithoutLinkForPos",
//     "autoDebitRecipt",
//     "invalidPaymentModeNotification",
//     "successPaymentNotification",
//     "failedPaymentNotification",
//     "missingDocumentsReminder",
//     "renewalReminder",
//     "duePaymentReminder",
//     "overduePaymentReminder",
//     "slipDiscountOtp",
//     "eventDiscountOtp",
//     "roomDiscountOtp",
//     "sendSms",
//     "reSendSms",
//     "callOtp",
//     "slipDiscountOtpCall",
//     "eventDiscountOtpCall",
//     "roomDiscountOtpCall",
//   ];

//   const templateOptions = templateKeys.map((key) => ({
//     value: key,
//     label: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
//   }));

//   // Watchers
//   const emailTemplate = watch("emailTemplate");
//   const smsTemplate = watch("smsTemplate");

//   // Insert variable into Draft.js EditorState (safer than DOM hacks)
//   const insertVariable = (variable, type) => {
//     const shortcode = `{{${variable}}}`;

//     if (type === "email") {
//       try {
//         const currentEditorState = getValues("emailTemplate.message") || EditorState.createEmpty();
//         const contentState = currentEditorState.getCurrentContent();
//         const selection = currentEditorState.getSelection();

//         // Insert text at current selection using Modifier
//         const newContent = Modifier.insertText(contentState, selection, shortcode);

//         const newEditorState = EditorState.push(
//           currentEditorState,
//           newContent,
//           "insert-characters"
//         );

//         // place cursor after inserted shortcode
//         const anchorOffset = selection.getStartOffset() + shortcode.length;
//         const newSelection = newEditorState.getSelection().merge({
//           anchorOffset,
//           focusOffset: anchorOffset,
//         });

//         const finalState = EditorState.forceSelection(newEditorState, newSelection);

//         setValue("emailTemplate.message", finalState, { shouldValidate: true, shouldDirty: true });
//       } catch (err) {
//         console.warn("Could not insert shortcode into editor:", err);
//       }
//     } else {
//       // SMS textarea
//       const key = "smsTemplate.message";
//       const currentValue = getValues(key) || "";
//       const textarea = document.getElementById("smsMessage");
//       if (!textarea) {
//         // fallback append
//         setValue(key, currentValue + shortcode, { shouldValidate: true, shouldDirty: true });
//         return;
//       }
//       const start = textarea.selectionStart;
//       const end = textarea.selectionEnd;
//       const newValue =
//         currentValue.substring(0, start) + shortcode + currentValue.substring(end);
//       setValue(key, newValue, { shouldValidate: true, shouldDirty: true });

//       // restore focus & cursor
//       setTimeout(() => {
//         textarea.focus();
//         const pos = start + shortcode.length;
//         textarea.setSelectionRange(pos, pos);
//       }, 0);
//     }
//   };

//   const onSubmit = async (data) => {
//     // Simple debug breakpoint removed; keep  s
//      ("Form submit data:", data);

//     const emailStatus = data.emailTemplate.status;
//     const smsStatus = data.smsTemplate.status;

//     if (!emailStatus && !smsStatus) {
//       toast.current.show({
//         severity: "error",
//         summary: "Failed",
//         detail: "Please enable at least one template (Email or SMS)",
//         life: 3000,
//       });
//       return;
//     }

//     const payload = {
//       templateType: data?.templateType?.value,
//     };

//     if (emailStatus) {
//       const editorState = data.emailTemplate.message;
//       if (!editorState || typeof editorState.getCurrentContent !== "function") {
//         toast.current.show({
//           severity: "error",
//           summary: "Invalid Editor",
//           detail: "Email editor state is invalid.",
//           life: 3000,
//         });
//         return;
//       }

//       const raw = convertToRaw(editorState.getCurrentContent());
//       const html = draftToHtml(raw);
//       payload.emailSubject = data.emailTemplate.subject;
//       payload.emailStatus = true;
//       payload.emailBody = `
//        <!DOCTYPE html><html lang='en' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head><meta charset='utf-8'><meta name='x-apple-disable-message-reformatting'><meta http-equiv='x-ua-compatible' content='ie=edge'><meta name='viewport' content='width=device-width, initial-scale=1'><meta name='format-detection' content='telephone=no, date=no, address=no, email=no'><title>Welcome to Marine</title><link href='https://fonts.googleapis.com/css?family=Montserrat:400,600,700' rel='stylesheet' media='screen'><style>body { font-family: Montserrat, sans-serif; background-color: #eceff1; margin: 0; padding: 0; }.btn { display: inline-block; padding: 12px 24px; background-color: #ff5850; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; }.btn:hover { background-color: #e14e48; }</style></head>
//           <body>
//             ${cleanHtml(html)}
//           </body>
//         </html>
//       `.trim();
//     } else {
//       payload.emailStatus = false;
//     }

//     if (smsStatus) {
//       payload.smsStatus = true;
//       payload.smsSentFrom = data.smsTemplate.sentFrom;
//       payload.smsBody = data.smsTemplate.message;
//     } else {
//       payload.smsStatus = false;
//     }

//      ("Payload:", payload);
//     setLoading(true);
//     try {
//       if (editTemplate?.uid) {
//         const response = await useJwt.updateTemplate(editTemplate.uid, payload);
//          ("update response:", response);
//         toast.current.show({
//           severity: "success",
//           summary: "Template Updated",
//           detail: "Template updated successfully",
//           life: 2000,
//         });
//         setTimeout(() => navigate("/crm/template/index"), 1400);
//       } else {
//         const response = await useJwt.createTemaplte(payload);
//          ("create response:", response);
//         toast.current.show({
//           severity: "success",
//           summary: "Template Added",
//           detail: "Template created successfully",
//           life: 2000,
//         });
//         setTimeout(() => navigate("/crm/template/index"), 1400);
//       }
//     } catch (err) {
//       console.error("Error submitting template:", err);
//       toast.current.show({
//         severity: "error",
//         summary: "Submission Failed",
//         detail: err?.response?.data?.content || "Something went wrong",
//         life: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <ShortcodeTable setShortcodes={setShortcodes} shortcodes={shortcodes} />
//       <Toast ref={toast} />

//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="container-fluid" style={{ backgroundColor: "#f8f9fa" }}>
//           <div className="row">
//             <Col md={12} className={"mb-1"}>
//               <label className="form-label">
//                 Select Template Type <span className="text-danger">*</span>
//               </label>
//               <Controller
//                 name="templateType"
//                 control={control}
//                 rules={{ required: "Template type is required" }}
//                 render={({ field }) => (
//                   <Select
//                     {...field}
//                     options={templateOptions}
//                     placeholder="Select Template Type..."
//                     classNamePrefix="select"
//                     styles={{
//                       control: (base, state) => ({
//                         ...base,
//                         backgroundColor: "#f5f5f5",
//                         borderColor: state.isFocused ? "#7367F0" : "#ced4da",
//                         boxShadow: "none",
//                         "&:hover": { borderColor: "#7367F0" },
//                       }),
//                     }}
//                   />
//                 )}
//               />
//               {errors.templateType && (
//                 <div className="text-danger mt-1 small">
//                   {errors.templateType.message}
//                 </div>
//               )}
//             </Col>

//             {/* Email Template */}
//             <div className="col-lg-6 mb-4">
//               <div className={`card shadow-sm ${!emailTemplate?.status ? "opacity-75" : ""}`}>
//                 <div
//                   className="card-header d-flex justify-content-between align-items-center"
//                   style={{ backgroundColor: "#7367F0" }}
//                 >
//                   <h5 className="mb-0" style={{ color: "white" }}>
//                     Email Template
//                   </h5>
//                   <div className="form-check form-switch mb-0">
//                     <Controller
//                       name="emailTemplate.status"
//                       control={control}
//                       render={({ field: { value, onChange } }) => (
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id="emailStatus"
//                           checked={value}
//                           onChange={(e) => onChange(e.target.checked)}
//                           style={{
//                             width: "3rem",
//                             height: "1.5rem",
//                             cursor: "pointer",
//                             backgroundColor: value ? "#28c76f" : "#82868b",
//                           }}
//                         />
//                       )}
//                     />
//                     <label
//                       className="form-check-label ms-2"
//                       htmlFor="emailStatus"
//                       style={{ color: "white", fontSize: "0.9rem" }}
//                     >
//                       {emailTemplate?.status ? "Enabled" : "Disabled"}
//                     </label>
//                   </div>
//                 </div>

//                 <div className="card-body">
//                   <Row className="mb-1 mt-1">
//                     <Col md={12}>
//                       <label className="form-label">
//                         Subject {emailTemplate?.status && <span className="text-danger">*</span>}
//                       </label>

//                       <Controller
//                         name="emailTemplate.subject"
//                         control={control}
//                         rules={{
//                           required: emailTemplate?.status ? "Subject is required" : false,
//                           minLength: emailTemplate?.status
//                             ? { value: 3, message: "Subject must be at least 3 characters long" }
//                             : undefined,
//                           pattern: emailTemplate?.status
//                             ? { value: /^[A-Za-z0-9 ]+$/, message: "Special characters are not allowed" }
//                             : undefined,
//                         }}
//                         render={({ field }) => (
//                           <input
//                             type="text"
//                             className={`form-control ${errors.emailTemplate?.subject ? "is-invalid" : ""}`}
//                             style={{ backgroundColor: "#f5f5f5" }}
//                             disabled={!emailTemplate?.status}
//                             value={field.value}
//                             onChange={(e) => {
//                               const sanitized = e.target.value.replace(/[^A-Za-z0-9 ]/g, "");
//                               field.onChange(sanitized);
//                             }}
//                           />
//                         )}
//                       />

//                       {errors.emailTemplate?.subject && (
//                         <div className="invalid-feedback">
//                           {errors.emailTemplate.subject.message}
//                         </div>
//                       )}
//                     </Col>
//                   </Row>

//                   {/* Sender Fields */}
//                   <Row>
//                     <Col md={6} className="mb-1">
//                       <label className="form-label">
//                         Email Sent From - Name {emailTemplate?.status && <span className="text-danger">*</span>}
//                       </label>
//                       <Controller
//                         name="emailTemplate.senderName"
//                         control={control}
//                         rules={{
//                           required: emailTemplate?.status ? "Sender name is required" : false,
//                           minLength: emailTemplate?.status
//                             ? { value: 2, message: "Sender name must be at least 2 characters" }
//                             : undefined,
//                         }}
//                         render={({ field }) => (
//                           <input
//                             type="text"
//                             className={`form-control ${errors.emailTemplate?.senderName ? "is-invalid" : ""}`}
//                             style={{ backgroundColor: "#f5f5f5" }}
//                             disabled={!emailTemplate?.status}
//                             {...field}
//                           />
//                         )}
//                       />
//                       {errors.emailTemplate?.senderName && (
//                         <div className="invalid-feedback">{errors.emailTemplate.senderName.message}</div>
//                       )}
//                     </Col>

//                     <Col md={6} className="mb-1">
//                       <label className="form-label">
//                         Email Sent From - Email {emailTemplate?.status && <span className="text-danger">*</span>}
//                       </label>
//                       <Controller
//                         name="emailTemplate.senderEmail"
//                         control={control}
//                         rules={{
//                           required: emailTemplate?.status ? "Sender email is required" : false,
//                           pattern: emailTemplate?.status
//                             ? { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" }
//                             : undefined,
//                         }}
//                         render={({ field }) => (
//                           <input
//                             type="email"
//                             className={`form-control ${errors.emailTemplate?.senderEmail ? "is-invalid" : ""}`}
//                             style={{ backgroundColor: "#f5f5f5" }}
//                             disabled={!emailTemplate?.status}
//                             {...field}
//                           />
//                         )}
//                       />
//                       {errors.emailTemplate?.senderEmail && (
//                         <div className="invalid-feedback">{errors.emailTemplate.senderEmail.message}</div>
//                       )}
//                     </Col>
//                   </Row>

//                   <ExtensionsHeader
//                     title=""
//                     subTitle=""
//                     link="https://jpuri.github.io/react-draft-wysiwyg/#/docs"
//                   />

//                   {/* Email Message Editor */}
//                   <Row>
//                     <Col sm={12}>
//                       <Controller
//                         name="emailTemplate.message"
//                         control={control}
//                         render={({ field }) => (
//                           <div
//                             style={{
//                               opacity: emailTemplate?.status ? 1 : 0.6,
//                               pointerEvents: emailTemplate?.status ? "auto" : "none",
//                             }}
//                           >
//                             {/* EditorCompo must accept EditorState as value and (editorState) => void as onChange */}
//                             <EditorCompo value={field.value} onChange={field.onChange} />
//                           </div>
//                         )}
//                       />
//                     </Col>
//                   </Row>

//                   {/* Shortcode Buttons */}
//                   <div className="mt-3">
//                     <small className="text-muted d-block mb-2">Available Variables:</small>
//                     <div className="d-flex flex-wrap gap-1">
//                       {shortcodes?.map((variable) => (
//                         <button
//                           key={variable?.code}
//                           type="button"
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => insertVariable(variable?.code, "email")}
//                           disabled={!emailTemplate?.status}
//                         >
//                           {`{{${variable?.code}}}`}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* SMS Template */}
//             <div className="col-lg-6 mb-4">
//               <div className={`card shadow-sm ${!smsTemplate?.status ? "opacity-75" : ""}`}>
//                 <div
//                   className="card-header d-flex justify-content-between align-items-center"
//                   style={{ backgroundColor: "#7367F0" }}
//                 >
//                   <h5 className="mb-0" style={{ color: "white" }}>
//                     SMS Template
//                   </h5>
//                   <div className="form-check form-switch mb-0">
//                     <Controller
//                       name="smsTemplate.status"
//                       control={control}
//                       render={({ field: { value, onChange } }) => (
//                         <input
//                           className="form-check-input"
//                           type="checkbox"
//                           id="smsStatus"
//                           checked={value}
//                           onChange={(e) => onChange(e.target.checked)}
//                           style={{
//                             width: "3rem",
//                             height: "1.5rem",
//                             cursor: "pointer",
//                             backgroundColor: value ? "#28c76f" : "#82868b",
//                           }}
//                         />
//                       )}
//                     />
//                     <label
//                       className="form-check-label ms-2"
//                       htmlFor="smsStatus"
//                       style={{ color: "white", fontSize: "0.9rem" }}
//                     >
//                       {smsTemplate?.status ? "Enabled" : "Disabled"}
//                     </label>
//                   </div>
//                 </div>

//                 <div className="card-body">
//                   <Row className="mb-1 mt-1">
//                     <Col md={6}>
//                       <label className="form-label">
//                         SMS Sent From {smsTemplate?.status && <span className="text-danger">*</span>}
//                       </label>
//                       <Controller
//                         name="smsTemplate.sentFrom"
//                         control={control}
//                         rules={{
//                           required: smsTemplate?.status ? "Sender name is required" : false,
//                           minLength: smsTemplate?.status
//                             ? { value: 3, message: "Sender name must be at least 3 characters" }
//                             : undefined,
//                           pattern: smsTemplate?.status
//                             ? {
//                                 value: /^[A-Za-z0-9 _.-]+$/,
//                                 message: "Sender name may only contain letters, numbers, spaces, dots, underscores, and hyphens",
//                               }
//                             : undefined,
//                         }}
//                         render={({ field }) => (
//                           <input
//                             type="text"
//                             className={`form-control ${errors.smsTemplate?.sentFrom ? "is-invalid" : ""}`}
//                             style={{ backgroundColor: "#f5f5f5" }}
//                             disabled={!smsTemplate?.status}
//                             {...field}
//                           />
//                         )}
//                       />
//                       {errors.smsTemplate?.sentFrom && (
//                         <div className="invalid-feedback">{errors.smsTemplate.sentFrom.message}</div>
//                       )}
//                     </Col>

//                     <Col md={6}>
//                       <label className="form-label">
//                         SMS Sent From (Phone Number) {smsTemplate?.status && <span className="text-danger">*</span>}
//                       </label>
//                       <Controller
//                         name="smsTemplate.phoneNumber"
//                         control={control}
//                         rules={{
//                           required: smsTemplate?.status ? "Phone number is required" : false,
//                           pattern: smsTemplate?.status ? { value: /^[0-9]{10,13}$/, message: "Enter a valid phone number" } : undefined,
//                         }}
//                         render={({ field }) => (
//                           <input
//                             type="tel"
//                             inputMode="numeric"
//                             maxLength={13}
//                             className={`form-control ${errors.smsTemplate?.phoneNumber ? "is-invalid" : ""}`}
//                             style={{ backgroundColor: "#f5f5f5" }}
//                             disabled={!smsTemplate?.status}
//                             {...field}
//                           />
//                         )}
//                       />
//                       {errors.smsTemplate?.phoneNumber && (
//                         <div className="invalid-feedback">{errors.smsTemplate.phoneNumber.message}</div>
//                       )}
//                     </Col>
//                   </Row>

//                   {/* SMS Message */}
//                   <div className="mb-3">
//                     <label className="form-label">Message {smsTemplate?.status && <span className="text-danger">*</span>}</label>
//                     <Controller
//                       name="smsTemplate.message"
//                       control={control}
//                       rules={{
//                         required: smsTemplate?.status ? "SMS message is required" : false,
//                         minLength: smsTemplate?.status ? { value: 10, message: "Message must be at least 10 characters long" } : undefined,
//                         maxLength: smsTemplate?.status ? { value: 500, message: "Message must not exceed 500 characters" } : undefined,
//                         validate: smsTemplate?.status ? (value) => value.trim().length > 0 || "Message cannot be empty or whitespace only" : undefined,
//                       }}
//                       render={({ field }) => (
//                         <textarea
//                           id="smsMessage"
//                           rows="8"
//                           className={`form-control ${errors.smsTemplate?.message ? "is-invalid" : ""}`}
//                           style={{ backgroundColor: "#f5f5f5" }}
//                           disabled={!smsTemplate?.status}
//                           {...field}
//                         />
//                       )}
//                     />
//                     {errors.smsTemplate?.message && <div className="invalid-feedback">{errors.smsTemplate.message.message}</div>}
//                   </div>

//                   {/* SMS Variables */}
//                   <div className="mt-3">
//                     <small className="text-muted d-block mb-2">Available Variables:</small>
//                     <div className="d-flex flex-wrap gap-2">
//                       {shortcodes.map((variable) => (
//                         <button
//                           key={variable?.code}
//                           type="button"
//                           className="btn btn-sm btn-outline-primary"
//                           onClick={() => insertVariable(variable?.code, "sms")}
//                           disabled={!smsTemplate?.status}
//                         >
//                           {`{{${variable?.code}}}`}
//                         </button>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Save Button */}
//           <div className="row">
//             <div className="col text-end">
//               <button className="btn btn-primary btn-lg px-5" disabled={loading} type="submit">
//                 {loading ? (
//                   <>
//                     Loading...
//                     <Spinner size={"sm"} />
//                   </>
//                 ) : (
//                   <>Save Templates</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default TemplateManager;
