import {
  ContentState,
  EditorState
} from "draft-js";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CardTitle } from "reactstrap";

const EditorCompo = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  // Set editor state only when initial value is passed or changed externally
  useEffect(() => {
    if (typeof value === "string" && value.trim().length > 0) {
      const { contentBlocks, entityMap } = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    } else if (!value) {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    onChange(state); // Pass EditorState to form
  };

  return (
    <>
      <CardTitle tag="h4">Message</CardTitle>
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        wrapperClassName="demo-wrapper"
        editorClassName="form-control"
        toolbarClassName="toolbarClassName"
        editorStyle={{
          backgroundColor: "#f5f5f5",
          minHeight: "200px",
          padding: "10px",
          borderRadius: "5px",
          direction: "ltr",
        }}
      />
    </>
  );
};

export default EditorCompo;


