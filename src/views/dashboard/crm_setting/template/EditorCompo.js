import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CardTitle } from "reactstrap";

const EditorCompo = ({ value = "", onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (value) {
      const { contentBlocks, entityMap } = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const raw = convertToRaw(state.getCurrentContent());
    onChange(draftToHtml(raw));
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
          direction: "ltr",          // HARD FIX
          unicodeBidi: "plaintext",  // HARD FIX
        }}
      />
    </>
  );
};

export default EditorCompo;
