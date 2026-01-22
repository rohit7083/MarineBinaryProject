// ** React Hook Form
import useJwt from "@src/auth/jwt/useJwt";
import { Toast } from "primereact/toast";
import { Controller, useForm } from "react-hook-form";

// ** Custom Components
import Avatar from "@components/avatar";
import { convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
// ** Third Party Components
import { Editor } from "react-draft-wysiwyg";
import { Paperclip, Trash, X } from "react-feather";
import { components } from "react-select";

// ** Reactstrap Imports
import {
  Button,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  UncontrolledButtonDropdown,
} from "reactstrap";

// ** Utils

// ** Images

// ** Styles
import "@styles/react/libs/editor/editor.scss";
import "@styles/react/libs/react-select/_react-select.scss";
import { useRef } from "react";

const ComposePopup = ({
  composeOpen,
  toggleCompose,
  fetchMail,
  setLoading,
  loading,
}) => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      to: [],
      subject: "",
      message: "",
    },
  });

  // const selectOptions = [
  //   { value: "pheobe", label: "Pheobe Buffay", img: img1 },
  //   { value: "chandler", label: "Chandler Bing", img: img2 },
  //   { value: "ross", label: "Ross Geller", img: img3 },
  //   { value: "monica", label: "Monica Geller", img: img4 },
  //   { value: "joey", label: "Joey Tribbiani", img: img5 },
  //   { value: "rachel", label: "Rachel Green", img: img6 }
  // ];
  const toast = useRef(null);

  const SelectOption = ({ data, ...props }) => (
    <components.Option {...props}>
      <div className="d-flex align-items-center">
        <Avatar size="sm" img={data.img} className="me-50" />
        {data.label}
      </div>
    </components.Option>
  );

  const onSubmit = async (data) => {
    const htmlBody = draftToHtml(
      convertToRaw(data.message.getCurrentContent()),
    );
    const payload = {
      toEmail: data.to,
      subject: data.subject,
      body: htmlBody,
    };

    try {
      setLoading(true);
      const res = await useJwt.createMannualEmail(payload);
      console.log(res);
      if (res?.status === 201) {
        fetchMail();
        toast.current.show({
          severity: "success",
          summary: "Email Sent",
          detail: "Your email has been sent successfully.",
          life: 2000,
        });

        setTimeout(() => {
          toggleCompose();
          reset();
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Email Failed",
        detail: `${
          error?.response?.data?.content ||
          "Failed to send email. Please try again."
        }`,
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      scrollable
      fade={false}
      keyboard={false}
      backdrop={false}
      id="compose-mail"
      container=".content-body"
      className="modal-lg"
      isOpen={composeOpen}
      contentClassName="p-0"
      toggle={toggleCompose}
      modalClassName="modal-sticky"
    >
      <div className="modal-header">
        <h5 className="modal-title">Compose Mail</h5>
        <div className="modal-actions">
          {/* <a href="/" onClick={(e) => e.preventDefault()}>
            <Minus size={14} />
          </a>
          <a href="/" onClick={(e) => e.preventDefault()}>
            <Maximize2 size={14} />
          </a> */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              toggleCompose();
            }}
          >
            <X size={14} />
          </a>
        </div>
      </div>
      <Toast ref={toast} />

      <ModalBody className="flex-grow-1 p-0">
        <Form className="compose-form" onSubmit={handleSubmit(onSubmit)}>
          {/* TO */}
          <div className="compose-mail-form-field">
            <Label className="form-label">To:</Label>
            <div className="flex-grow-1">
              <Controller
                name="to"
                control={control}
                render={({ field }) => (
                  // <Select
                  //   {...field}
                  //   isMulti
                  //   isClearable={false}
                  //   theme={selectThemeColors}
                  //   options={selectOptions}
                  //   className="react-select select-borderless"
                  //   classNamePrefix="select"
                  //   components={{ Option: SelectOption }}
                  // />
                  <Input {...field} placeholder="to" />
                )}
              />
            </div>
          </div>

          {/* SUBJECT */}
          <div className="compose-mail-form-field">
            <Label className="form-label">Subject:</Label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Subject" />}
            />
          </div>

          {/* MESSAGE */}
          <div id="message-editor">
            <Controller
              name="message"
              control={control}
              render={({ field }) => (
                <Editor
                  editorState={field.value}
                  onEditorStateChange={field.onChange}
                  placeholder="Message"
                  toolbarClassName="rounded-0"
                  wrapperClassName="toolbar-bottom"
                  editorClassName="rounded-0 border-0"
                  toolbar={{
                    options: ["inline", "textAlign"],
                    inline: {
                      options: ["bold", "italic", "underline", "strikethrough"],
                    },
                  }}
                />
              )}
            />
          </div>

          {/* FOOTER */}
          <div className="compose-footer-wrapper">
            <div className="btn-wrapper d-flex align-items-center">
              <UncontrolledButtonDropdown direction="up" className="me-1">
                <Button color="primary" disabled={loading} type="submit">
                  {loading ? "Sending..." : "Send"}
                </Button>
              </UncontrolledButtonDropdown>

              <div className="email-attachement">
                <Label className="mb-0" for="attach-email-item">
                  <Paperclip className="cursor-pointer ms-50" size={18} />
                  <input type="file" id="attach-email-item" hidden />
                </Label>
              </div>
            </div>

            <div className="footer-action d-flex align-items-center">
              <Trash
                className="cursor-pointer"
                size={18}
                onClick={toggleCompose}
              />
            </div>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default ComposePopup;
