// // ** React Imports
// import { useState } from "react";

// // ** Third Party Components
// import { EditorState } from "draft-js";
// import { Editor } from "react-draft-wysiwyg";

// // ** Reactstrap Imports
// import { CardTitle } from "reactstrap";

// const EditorControlled = () => {
//   // ** State
//   const [value, setValue] = useState(EditorState.createEmpty());

//   return (
//     <>
//       <CardTitle tag="h4">Message </CardTitle>

//       <Editor
//         editorState={value}
//         onEditorStateChange={(data) => setValue(data)}
//       />
//     </>
//   );
// };

// export default EditorControlled;

import { ContentState, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { CardTitle } from "reactstrap";

const EditorCompo = ({ value = "", onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // Load initial HTML into editor
  useEffect(() => {
    if (value) {
      const blocksFromHtml = htmlToDraft(value);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks
      );
      setEditorState(EditorState.createWithContent(contentState));
    } else {
      setEditorState(EditorState.createEmpty());
    }
  }, [value]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    const rawContent = convertToRaw(state.getCurrentContent());
    const html = draftToHtml(rawContent);
    onChange(html); // Emit HTML string to parent (react-hook-form)
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
        }}
      />
    </>
  );
};

export default EditorCompo;
