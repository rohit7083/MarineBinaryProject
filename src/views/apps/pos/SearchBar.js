import { selectThemeColors } from "@utils";
import { Search } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";

import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  InputGroup,
  InputGroupText,
  Label,
  Row,
} from "reactstrap";
import { storefilterSearch } from "./store";

const SearchBar = ({ onSearch }) => {
  const today = new Date().toISOString().split("T")[0];

  // ** Hook
  const { items: products } = useSelector((state) => state.productSlice);
  const dispatch = useDispatch();

  // React Hook Form setup
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      invoiceNo: "",
      searchTerm: "",
      categories: [],
    },
  });

  const onSubmit = (data) => {

    const { searchTerm, categories } = data;

    // Array of selected category values
    const selectedCategories = categories.map((c) => c.label);

    // Filter the products
    const filteredProducts = products.filter((product) => {
      // Check if searchTerm matches product name (case insensitive)
      const matchesName = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // Check if product's category is in selected categories
      const matchesCategory =
        selectedCategories.length === 0 || // If no category selected, include all
        selectedCategories.includes(product.categoryUid.name.toLowerCase());

      return matchesName && matchesCategory;
    });

    if (filteredProducts.length) {
      dispatch(storefilterSearch(filteredProducts));
    } else {
      dispatch(storefilterSearch([]));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardBody>
          <Row className="mb-2">
            <Col md="6">
              <Label className="form-label">Invoice No</Label>
              <Controller
                name="invoiceNo"
                control={control}
                render={({ field }) => (
                  <InputGroup className="input-group-merge">
                    <Input {...field} placeholder="LT3763" />
                  </InputGroup>
                )}
              />
            </Col>

            <Col md="6">
              <Label className="form-label">Invoice Date</Label>
              <InputGroup className="input-group-merge">
                <Input type="date" value={today} disabled />
              </InputGroup>
            </Col>
          </Row>

          <Row>
            <Col sm="6" className="mb-1">
              <Label className="form-label">Search Products</Label>
              <Controller
                name="searchTerm"
                control={control}
                render={({ field }) => (
                  <InputGroup className="input-group-merge">
                    <Input {...field} placeholder="Search Product" />
                    <InputGroupText>
                      <Search className="text-muted" size={14} />
                    </InputGroupText>
                  </InputGroup>
                )}
              />
            </Col>

            <Col sm="6" className="mb-1">
              <Label className="form-label">Category</Label>
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isClearable={false}
                    isMulti
                    theme={selectThemeColors}
                    options={products.map(({ categoryUid }) => ({
                      label: categoryUid.name,
                      value: categoryUid.uid,
                    }))}
                    className="react-select"
                    classNamePrefix="select"
                    onChange={(val) => field.onChange(val)}
                  />
                )}
              />
            </Col>
          </Row>

          <div className="mt-2 d-flex justify-content-end gap-2">
            <Button type="submit" size="sm" className="btn btn-primary">
              <Search size={12} /> Search
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                dispatch(storefilterSearch([]));
                reset();
              }}
              className="btn btn-primary"
            >
              Reset
            </Button>
          </div>
        </CardBody>
      </Card>
    </form>
  );
};

export default SearchBar;
