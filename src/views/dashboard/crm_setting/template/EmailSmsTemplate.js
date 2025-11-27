import ExtensionsHeader from "@components/extensions-header";
import useJwt from "@src/auth/jwt/useJwt";
import "@styles/react/libs/editor/editor.scss";
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
  console.log(editTemplate);

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
      console.log("Converted Email Body:", plainEmailBody);

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

  const generateEmailHTML = (subject, message) => {
    const safeMessage = message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br>");

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${subject}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#eceff1;font-family:Montserrat,Arial,sans-serif;color:#333;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding:20px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;background:#ffffff;border-radius:8px;padding:40px;">
            <tr>
              <td style="font-size:16px;line-height:1.6;color:#333;">
                ${safeMessage}
                <p style="margin-top:30px;">Thanks,<br><strong>The Marine Team</strong></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  };

  const onSubmit = async (data) => {
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

    // Add email fields if email is enabled
    if (emailStatus) {
      const emailBody = generateEmailHTML(
        data.emailTemplate.subject,
        data.emailTemplate.message
      );

      payload.emailStatus = true;
      payload.emailSubject = data.emailTemplate.subject;
      payload.emailSenderName = data.emailTemplate.senderName;
      payload.emailSenderEmail = data.emailTemplate.senderEmail;
      payload.emailBody = emailBody;
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

    console.log("Final Payload:", payload);

    try {
      setLoading(true);
      const response = await useJwt.createTemaplte(payload);
      console.log(response);
      toast.current.show({
        severity: "success",
        summary: "Template Added",
        detail: "Template Created sucessfully",
        life: 2000,
      });
      setTimeout(() => {
        navigate("/crm/template/index");
      }, 1999);
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
        console.log(res);

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
        console.log(error);
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
                    <Col md={6} className="mb-1">
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
                    </Col>

                    <Col md={6} className="mb-1">
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
                  <div className="mt-3">
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
                  </div>
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
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
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
                  <div className="mt-3">
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
                  </div>
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
