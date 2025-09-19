// ** Icons Imports
import useJwt from "@src/auth/jwt/useJwt";
import { selectThemeColors } from "@utils";
import { Search } from "react-feather";
import Select from "react-select";
import ProductCards from "./ProductCards";

// ** Reactstrap Imports
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";

const ProductsSearchbar = ({ selectedCustomer }) => {
  const [tableData, setTableData] = useState({ count: 0, results: [] });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // filters
  const [categories, setCategories] = useState([]); // extracted categories
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products API
  const fetchTableData = async (pageNo = 1) => {
    try {
      setLoading(true);
      const { data } = await useJwt.getAllProduct({ page: pageNo });
      const content = data?.content || { count: 0, result: [] };

      const allCats =
        content?.result?.flatMap((p) => {
          if (!p?.categoryUid) return [];
          if (typeof p.categoryUid === "object") {
            return [{ value: p.categoryUid.id, label: p.categoryUid.name }];
          }
          return [{ value: p.categoryUid, label: String(p.categoryUid) }];
        }) || [];

      const uniqueCats = [
        ...new Map(allCats.map((c) => [c.value, c])).values(),
      ];

      setCategories(uniqueCats);

      setTableData((prev) => ({
        count: content.count,
        results:
          pageNo === 1 ? content.result : [...prev.results, ...content.result],
      }));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    fetchTableData(1);
  }, []);

  

  const filteredResults = tableData.results
    .filter(Boolean) // remove null/undefined
    .map((product) => ({
      ...product,
      uid: product?.uid || "unknown",
      categoryUid: product?.categoryUid || null,
    }))
    .filter((product) => {
      const matchSearch = product.name?.toLowerCase().includes((searchTerm ?? "").toLowerCase());

      const matchCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((sel) => {
          if (!product.categoryUid) return false;
          if (typeof product.categoryUid === "object")
            return product.categoryUid.id === sel.value;
          return product.categoryUid === sel.value;
        });
      return matchSearch && matchCategory;
    });

const today = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardBody>
        <Row className="mt-1 mb-2">
          {/* Search bar */}
          <Col sm="4">
            <Label className="form-label">Search Products</Label>
            <InputGroup className="input-group-merge">
              <Input
                className="search-product"
                placeholder="Search Product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroupText>
                <Search className="text-muted" size={14} />
              </InputGroupText>
            </InputGroup>
          </Col>

          {/* Dynamic Category filter */}
          <Col className="mb-1" sm="4">
            <Label className="form-label">Category</Label>
            <Select
              isClearable={false}
              isMulti
              theme={selectThemeColors}
              name="categories"
              value={selectedCategories}
              onChange={(val) => setSelectedCategories(val || [])}
              options={categories}
              className="react-select"
              classNamePrefix="select"
            />
          </Col>

          {/* Invoice No + Date */}
          <Col sm="4" className="d-flex gap-2">
            <Col md="5">
              <Label className="form-label">Invoice No</Label>
              <InputGroup className="input-group-merge">
                <Input className="search-product" placeholder="LT3763" />
              </InputGroup>
            </Col>

            <Col md="6">
              <Label className="form-label">Invoice Date</Label>
              <InputGroup className="input-group-merge">
                <Input type="date" value={today} disabled />
              </InputGroup>
            </Col>
          </Col>
        </Row>

        {/* Product cards with filtered data */}
        <ProductCards
          setLoading={setLoading}
          loading={loading}
          setPage={setPage}
          page={page}
          tableData={{ ...tableData, results: filteredResults }}
          setTableData={setTableData}
          selectedCustomer={selectedCustomer || {}}
        />
      </CardBody>
    </Card>
  );
};

export default ProductsSearchbar;
