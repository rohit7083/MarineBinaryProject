import useJwt from "@src/auth/jwt/useJwt";
import React, { useEffect, useState } from "react";
import { Check, Copy } from "react-feather";
import BeatLoader from "react-spinners/BeatLoader";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
} from "reactstrap";

const ShortcodeTable = ({ shortcodes, setShortcodes }) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await useJwt.getShortcode();

        const codeData = res?.data?.content?.result?.map((x) => ({
          code: x?.shortCode,
          des: x?.description,
        }));

        setShortcodes(codeData);
        console.log(res);
      } catch (error) {
        console.error("Error fetching shortcodes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(`{{${text}}}`);
    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <Card className="shadow-sm border-0 rounded-3">
      {/* Header */}
      <CardHeader className="  text-white ">
        <CardTitle tag="h4" className="mb-0 fw-semibold">
          📜 Shortcode Reference
        </CardTitle>
      </CardHeader>

      {/* Body */}
      <CardBody className="">
        <Table hover responsive bordered striped size="sm">
          {loading ? (
            <>
              <div className="d-flex flex-column align-items-center text-center lh-1">
                <span
                  className="fw-semibold text-primary mb-1"
                  style={{ fontSize: "0.9rem" }}
                >
                  Loading...
                </span>
                <div style={{}}>
                  <BeatLoader color="#7367F0" size={14} />
                </div>
              </div>
            </>
          ) : (
            <>
              <thead className="table-light">
                <tr>
                  <th style={{ width: "40%" }}>Short Code</th>
                  <th>Description</th>
                  <th style={{ width: "40%" }}>Short Code</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {shortcodes
                  .reduce((rows, item, i) => {
                    if (i % 2 === 0) rows.push([item]);
                    else rows[rows.length - 1].push(item);
                    return rows;
                  }, [])
                  .map((pair, rowIndex) => (
                    <tr key={rowIndex}>
                      {pair.map((item, colIndex) => (
                        <React.Fragment key={colIndex}>
                          <td className="align-middle" style={{ width: "20%" }}>
                            <div className="d-flex align-items-center justify-content-between bg-light rounded px-2">
                              <code className="fw-bold text-dark m-0">
                                {`{{ ${item.code} }}`}
                              </code>
                              <Button
                                color={
                                  copiedIndex === item.code
                                    ? "success"
                                    : "secondary"
                                }
                                size="sm"
                                outline
                                onClick={() => handleCopy(item.code, item.code)}
                                title="Copy to clipboard"
                              >
                                {copiedIndex === item.code ? (
                                  <Check size={15} />
                                ) : (
                                  <Copy size={15} />
                                )}
                              </Button>
                            </div>
                          </td>

                          <td className="align-middle" style={{ width: "30%" }}>
                            {item.des}
                          </td>
                        </React.Fragment>
                      ))}

                      {/* If odd number of items → fill remaining two columns with empty cells */}
                      {pair.length === 1 && (
                        <>
                          <td></td>
                          <td></td>
                        </>
                      )}
                    </tr>
                  ))}
              </tbody>
            </>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};

export default ShortcodeTable;
