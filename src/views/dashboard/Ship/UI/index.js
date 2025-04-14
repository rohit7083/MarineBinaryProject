import React, { useState } from "react";
import {
  Container,
  Card,
  CardBody,
  Collapse,
  Button,
} from "reactstrap";
import { ChevronDown, ChevronUp } from "lucide-react";

// Updated content with structured HTML for bullet points and paragraphs
const sections = [
  {
    id: "1",
    title: "🔮 Forward-Looking Nature",
    content: `
      <p>Any reference to the conversion of TATs into TTTs or to the future tradability of TTTs on cryptocurrency exchanges constitutes a forward-looking statement.</p>
      <p>These references are based on planned, aspirational objectives currently under internal evaluation by the xTalentru development team. They are speculative and not a guarantee, representation, or commitment by xTalentru or any affiliated party.</p>
    `,
  },
  {
    id: "2",
    title: "🚫 No Guarantee or Obligation",
    content: `
      <p>xTalentru does not guarantee or commit to:</p>
      <ul>
        <li>The future existence or deployment of TTT as a digital token.</li>
        <li>The listing or tradability of TTT on any crypto exchange or digital asset marketplace.</li>
        <li>The availability of a TAT-to-TTT conversion mechanism.</li>
        <li>The monetary value, liquidity, or regulatory approval of TTT in any jurisdiction.</li>
        <li>The user's ability to derive any income, return, or financial benefit from holding TATs or future TTTs.</li>
      </ul>
    `,
  },
  {
    id: "3",
    title: "🛡️ Not Securities",
    content: `
      <p>TATs and any future TTTs are not securities, financial products, investment instruments, or legal tender.</p>
      <p>These tokens serve as utility tools for in-platform activity and do not convey ownership rights, dividends, or equity in xTalentru or any affiliated entity.</p>
    `,
  },
  {
    id: "4",
    title: "💼 Token Functionality",
    content: `
      <p>xTalentru offers three distinct wallets for TAT holdings:</p>
      <ul>
        <li><strong>Wallet 1</strong> and <strong>Wallet 2</strong>: Hold TATs that can only be used for accessing other users' profiles.</li>
        <li><strong>Wallet 3</strong>: Holds TATs earned through verified database sharing. These may be eligible for future conversion to TTT if such functionality is created and approved.</li>
      </ul>
      <p>This eligibility does not imply or guarantee future redemption, cash-out, or trade opportunities.</p>
    `,
  },
  {
    id: "5",
    title: "⚠️ Regulatory & Technical Risk",
    content: `
      <p>The xTalentru team recognizes that any blockchain-based token system is subject to:</p>
      <ul>
        <li>Regulatory change or enforcement actions</li>
        <li>Evolving crypto compliance requirements</li>
        <li>Market volatility and economic disruptions</li>
        <li>Technical limitations and cybersecurity concerns</li>
      </ul>
      <p>Accordingly, the entire TTT roadmap is conditional, non-binding, and subject to change or cancellation without notice.</p>
    `,
  },
  {
    id: "6",
    title: "📉 Limitation of Liability",
    content: `
      <p>To the fullest extent permitted by law, xTalentru and its directors, officers, employees, or agents are not liable for any direct, indirect, incidental, or consequential damages — including but not limited to:</p>
      <ul>
        <li>Loss of data or access</li>
        <li>Unrealized profit expectations</li>
        <li>Regulatory ineligibility</li>
        <li>Platform modifications or roadmap delays</li>
      </ul>
      <p>Users accept all risks associated with TAT or future TTT use and waive any claim against xTalentru for unrealized benefits.</p>
    `,
  },
  {
    id: "7",
    title: "🧾 User Acknowledgment",
    content: `
      <p>By participating in xTalentru services and using any TAT-based functionality, you acknowledge that:</p>
      <ul>
        <li>You have read and understood this disclaimer.</li>
        <li>You are not relying on the realization of TTT for financial return.</li>
        <li>You accept that all TTT discussions are speculative and non-binding.</li>
        <li>You assume full risk and responsibility for any decisions involving TATs or Wallet 3.</li>
      </ul>
    `,
  },
  {
    id: "8",
    title: "⚖️ Jurisdiction",
    content: `
      <p>This disclaimer shall be governed and interpreted in accordance with the laws of the jurisdiction in which xTalentru is legally registered.</p>
      <p>Any disputes arising from this document will be subject to the exclusive jurisdiction of the courts in that jurisdiction.</p>
    `,
  },
];

const LegalDisclaimerAccordion = () => {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div style={styles.page}>
      <Container className="py-5">
        <div style={styles.header}>
          <h1 style={styles.title}>📜 Legal Disclaimer</h1>
          <p style={styles.subtitle}>
            Forward-Looking Statements for Talent Transaction Token (TTT)
          </p>
        </div>

        {sections.map((sec) => (
          <Card key={sec.id} style={styles.card} className="mb-2">
            <Button
              onClick={() => toggle(sec.id)}
              style={styles.cardHeader}
              color="light"
              className="text-start w-100 d-flex justify-content-between align-items-center"
            >
              <span>{sec.title}</span>
              {openId === sec.id ? (
                <ChevronUp size={20} color="#6b7280" />
              ) : (
                <ChevronDown size={20} color="#6b7280" />
              )}
            </Button>
            <Collapse isOpen={openId === sec.id}>
              <CardBody
                style={styles.cardBody}
                dangerouslySetInnerHTML={{ __html: sec.content }}
              />
            </Collapse>
          </Card>
        ))}

        <div className="text-center mt-5">
          <p style={{ color: "#374151" }}>
            📧 Contact:{" "}
            <a href="mailto:legal@xtalentru.com" style={{ color: "#0d6efd" }}>
              legal@xtalentru.com
            </a>
          </p>
          <p className="small text-muted">
            © xTalentru. Subject to legal and regulatory updates.
          </p>
        </div>
      </Container>
    </div>
  );
};

const styles = {
  page: {
    background: "#f8fafc",
    color: "#1f2937",
    minHeight: "100vh",
    fontFamily: "Poppins, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2.75rem",
    fontWeight: "700",
    color: "#f59e0b",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1.1rem",
    marginTop: "0.5rem",
  },
  card: {
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    padding: "1rem 1.5rem",
    fontSize: "1.15rem",
    fontWeight: "600",
    backgroundColor: "transparent",
  },
  cardBody: {
    fontSize: "1rem",
    color: "#374151",
    paddingTop: 0,
    padding: "0 1.5rem 1rem 1.5rem",
    lineHeight: "1.6",
  },
};

export default LegalDisclaimerAccordion;


// import React, { useState } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Collapse,
//   Button,
//   Row,
//   Col,
// } from "reactstrap";

// const sections = [
//   {
//     id: "1",
//     title: "Forward-Looking Nature of Statements",
//     content:
//       "References to TAT-to-TTT conversion are speculative and not commitments. They reflect internal aspirations, not guaranteed outcomes.",
//   },
//   {
//     id: "2",
//     title: "No Guarantee or Obligation",
//     content:
//       "xTalentru does not guarantee the deployment, tradability, or monetary value of TTT. No promises or obligations are made.",
//   },
//   {
//     id: "3",
//     title: "TATs and TTTs Are Not Securities",
//     content:
//       "TATs and TTTs are not financial products or legal tender. They do not imply ownership or dividends.",
//   },
//   {
//     id: "4",
//     title: "Platform Use and Token Functionality",
//     content:
//       "TATs in Wallet 1 and 2 access profiles. Wallet 3 tokens may be eligible for conversion but not guaranteed.",
//   },
//   {
//     id: "5",
//     title: "Regulatory and Technical Uncertainties",
//     content:
//       "The roadmap is conditional. Blockchain development may be canceled due to regulations or tech limitations.",
//   },
//   {
//     id: "6",
//     title: "Limitation of Liability",
//     content:
//       "xTalentru isn’t liable for losses due to access issues, profit expectations, or platform changes.",
//   },
//   {
//     id: "7",
//     title: "User Acknowledgment",
//     content:
//       "By using xTalentru, you accept all risks. You understand that TTT discussion is speculative.",
//   },
//   {
//     id: "8",
//     title: "Jurisdiction and Dispute Resolution",
//     content:
//       "This disclaimer is governed by the laws of the country where xTalentru is registered.",
//   },
// ];

// const LegalDisclaimerAdvanced = () => {
//   const [openId, setOpenId] = useState(null);

//   const toggle = (id) => {
//     setOpenId(openId === id ? null : id);
//   };

//   return (
//     <div style={styles.wrapper}>
//       <Container className="py-5">
//         <div style={styles.header}>
//           <h2 style={styles.title}>⚖️ Legal Disclaimer</h2>
//           <p style={styles.subtitle}>
//             Forward-Looking Statements Regarding Talent Transaction Token (TTT)
//           </p>
//         </div>

//         <Row>
//           {sections.map((section) => (
//             <Col md="6" className="mb-4" key={section.id}>
//               <Card style={styles.card}>
//                 <div
//                   style={styles.cardHeader}
//                   onClick={() => toggle(section.id)}
//                 >
//                   <span style={styles.cardTitle}>{section.title}</span>
//                   <span style={styles.arrow}>
//                     {openId === section.id ? "−" : "+"}
//                   </span>
//                 </div>
//                 <Collapse isOpen={openId === section.id}>
//                   <CardBody style={styles.cardBody}>{section.content}</CardBody>
//                 </Collapse>
//               </Card>
//             </Col>
//           ))}
//         </Row>

//         <div className="text-center mt-5">
//           <p style={styles.contactText}>
//             📧 For inquiries: <a href="mailto:legal@xtalentru.com" style={styles.link}>legal@xtalentru.com</a>
//           </p>
//           <p style={styles.footerText}>© xTalentru. Document subject to revision.</p>
//         </div>
//       </Container>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
//     minHeight: "100vh",
//     color: "#f1f1f1",
//     fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: "3rem",
//   },
//   title: {
//     fontSize: "2.8rem",
//     fontWeight: "bold",
//     color: "#fbbf24",
//   },
//   subtitle: {
//     color: "#ddd",
//     fontSize: "1.1rem",
//   },
//   card: {
//     background: "#1f2937",
//     border: "1px solid #374151",
//     borderRadius: "1rem",
//     transition: "all 0.3s ease",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
//   },
//   cardHeader: {
//     padding: "1.2rem 1.5rem",
//     cursor: "pointer",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     fontSize: "1rem",
//     fontWeight: "600",
//     color: "#facc15",
//   },
//   cardTitle: {
//     flex: 1,
//   },
//   arrow: {
//     fontSize: "1.5rem",
//     color: "#9ca3af",
//     marginLeft: "1rem",
//   },
//   cardBody: {
//     backgroundColor: "#111827",
//     borderTop: "1px solid #374151",
//     padding: "1.25rem",
//     fontSize: "0.95rem",
//     color: "#d1d5db",
//   },
//   contactText: {
//     color: "#ccc",
//     fontSize: "0.95rem",
//   },
//   footerText: {
//     fontSize: "0.8rem",
//     color: "#aaa",
//   },
//   link: {
//     color: "#fbbf24",
//     textDecoration: "underline",
//   },
// };

// export default LegalDisclaimerAdvanced;