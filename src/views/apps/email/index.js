// // ** React Imports
// import { Fragment, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// // ** Email App Component Imports
// import Mails from "./Mails";
// import Sidebar from "./Sidebar";

// // ** Third Party Components
// import classnames from "classnames";

// // ** Store & Actions
// import { useDispatch, useSelector } from "react-redux";
// // import {
// //   getMails,
// //   paginateMail,
// //   resetSelectedMail,
// //   selectAllMail,
// //   selectCurrentMail,
// //   selectMail,
// //   updateMailLabel,
// //   updateMails,
// // } from "./store";

// // ** Styles
// import "@styles/react/apps/app-email.scss";

// const EmailApp = () => {
//   // ** States
//   const [query, setQuery] = useState("");
//   const [openMail, setOpenMail] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [composeOpen, setComposeOpen] = useState(false);

//   // ** Toggle Compose Function
//   const toggleCompose = () => setComposeOpen(!composeOpen);

//   // ** Store Variables
//   const dispatch = useDispatch();
//   const store = useSelector((state) => state.email);

//   // ** Vars
//   const params = useParams();

//   // ** UseEffect: GET initial data on Mount
//   useEffect(() => {
//     dispatch(
//       getMails({
//         q: query || "",
//         folder: params.folder || "inbox",
//         label: params.label || "",
//       })
//     );
//   }, [query, params.folder, params.label]);

//   return (
//     <Fragment>
//       <Sidebar
//         store={store}
//         dispatch={dispatch}
//         // getMails={getMails}
//         setOpenMail={setOpenMail}
//         sidebarOpen={sidebarOpen}
//         toggleCompose={toggleCompose}
//         setSidebarOpen={setSidebarOpen}
//         resetSelectedMail={resetSelectedMail}
//       />
//       <div className="content-right">
//         <div className="content-body">
//           <div
//             className={classnames("body-content-overlay", {
//               show: sidebarOpen,
//             })}
//             onClick={() => setSidebarOpen(false)}
//           ></div>
//           <Mails
//             store={store}
//             query={query}
//             setQuery={setQuery}
//             dispatch={dispatch}
//             // getMails={getMails}
//             openMail={openMail}
//             selectMail={selectMail}
//             setOpenMail={setOpenMail}
//             updateMails={updateMails}
//             composeOpen={composeOpen}
//             paginateMail={paginateMail}
//             selectAllMail={selectAllMail}
//             toggleCompose={toggleCompose}
//             setSidebarOpen={setSidebarOpen}
//             updateMailLabel={updateMailLabel}
//             selectCurrentMail={selectCurrentMail}
//             resetSelectedMail={resetSelectedMail}
//           />
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default EmailApp;

import useJwt from "@src/auth/jwt/useJwt";
import classnames from "classnames";
import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Mails from "./Mails";
import Sidebar from "./Sidebar";

import "@styles/react/apps/app-email.scss";

// fake API — replace with real one
// import { fetchMails } from "./api";

const EmailApp = () => {
  const params = useParams();

  // UI state
  const [query, setQuery] = useState("");
  const [openMail, setOpenMail] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);

  // Data state (formerly Redux)
  const [mails, setMails] = useState([]);
  const [mail, setMail] = useState(null);
  const [loading, setLoading] = useState(false);
  const toggleCompose = () => setComposeOpen((prev) => !prev);
  const [isMailsend, setIsMailSend] = useState(false);
  const selectMail = (mail) => {
    setCurrentMail(mail);
    setOpenMail(true);
  };

  const updateMailLabel = (mailId, label) => {
    setMails((prev) =>
      prev.map((m) => (m.id === mailId ? { ...m, label } : m)),
    );
  };
  const fetchMail = async () => {
    try {
      const res = await useJwt.getMails();
      console.log(res);
      setMail(res.data?.content?.result || []);
    } catch (err) {
      console.error("Failed to load mail", err);
    } finally {
    }
  };
  useEffect(() => {
    fetchMail();
  }, []);

  return (
    <Fragment>
      <Sidebar
        setOpenMail={setOpenMail}
        sidebarOpen={sidebarOpen}
        toggleCompose={toggleCompose}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="content-right">
        <div className="content-body">
          <div
            className={classnames("body-content-overlay", {
              show: sidebarOpen,
            })}
            onClick={() => setSidebarOpen(false)}
          />

          <Mails
            mails={mail}
            setLoading={setLoading}
            loading={loading}
            fetchMail={fetchMail}
            query={query}
            setQuery={setQuery}
            openMail={openMail}
            selectMail={selectMail}
            setOpenMail={setOpenMail}
            composeOpen={composeOpen}
            toggleCompose={toggleCompose}
            setSidebarOpen={setSidebarOpen}
            updateMailLabel={updateMailLabel}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default EmailApp;
