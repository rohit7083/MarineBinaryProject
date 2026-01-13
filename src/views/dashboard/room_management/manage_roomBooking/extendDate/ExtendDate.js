import useJwt from "@src/auth/jwt/useJwt";
import "flatpickr/dist/themes/material_blue.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import Flatpickr from "react-flatpickr";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    FormFeedback,
    FormGroup,
    Input,
    Label,
    Spinner,
} from "reactstrap";
function ExtendDate({ viewData }) {
  const navigate = useNavigate();
  const [err, setError] = useState("");
  const [extendResponseData, setExtendResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({});
  const toast = useRef(null);

  useEffect(() => {
    if (viewData?.checkInDate) {
      reset({
        checkInDate: viewData.checkInDate,
      });
    }
  }, [viewData?.checkInDate]);
  const uid = viewData?.uid;
  const onSubmit = async (data) => {
     ("Form Data Submitted:", data);
    const payload = {
      newCheckOutDate: data?.checkOutDate,
      extraPeople: data?.extraPeople || null,
    };
    setLoading(true);
    try {
      const selectedUserStr = localStorage.getItem("selectedBranch");
      const selectedBranch = JSON.parse(selectedUserStr);
      let branchUid = selectedBranch.uid;
      const res = await useJwt.ExtendDate(uid, branchUid, payload);
       (res);

      setExtendResponseData(res?.data);

      if (res?.status) {
        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "Data updated Successfully.",
          life: 2000,
        });

        navigate("/search-rooms/previewBooking/roomPayment", {
          state: {
            extendResDate: res?.data,
            memberId:viewData?.member?.id,
          },
        });
      }
    } catch (error) {
       (error);
      setError(error?.response?.data?.content);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: error?.response?.data?.content || "Somthing Went wrong",
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Set min check-out date based on selected check-in date

  const getCheckOutMinDate = () => {
    // {{ }}
    // const checkInDate = watch("checkInDate");

    // let updateDay =checkInDate;
    // if (!checkInDate) return "today";
    const updateDay = viewData?.checkOutDate;

    const nextDay = new Date(updateDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  };

  return (
    <>
      <Card>
        <CardBody>
          <Toast ref={toast} />

          <CardTitle>Do You Want to Extend Check Out Date?</CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="4" className="mb-1">
                <Label htmlFor="checkInDate">Check In Date</Label>
                <Controller
                  name="checkInDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        type="date"
                        id="checkInDate"
                        value={field.value || ""}
                        onChange={field.onChange}
                        className={`form-control ${
                          errors.checkInDate ? "is-invalid" : ""
                        }`}
                        disabled
                      />
                      {errors.checkInDate && (
                        <FormFeedback>
                          {errors.checkInDate.message}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>

              <Col sm="4" className="mb-1">
                <Label htmlFor="checkOutDate">Check Out Date</Label>
                <Controller
                  name="checkOutDate"
                  control={control}
                  // rules={{ required: "Check-out date is required" }}
                  render={({ field }) => (
                    <>
                      <Flatpickr
                        id="checkOutDate"
                        className={`form-control ${
                          errors.checkOutDate ? "is-invalid" : ""
                        }`}
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                          minDate: getCheckOutMinDate(),
                        }}
                        value={field.value}
                        onChange={(date) => {
                          const formatted = date?.[0]
                            ? `${date[0].getFullYear()}-${String(
                                date[0].getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date[0].getDate()
                              ).padStart(2, "0")}`
                            : "";
                          field.onChange(formatted);
                        }}
                      />
                      {errors.checkOutDate && (
                        <FormFeedback>
                          {errors.checkOutDate.message}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>

              <Col sm="4">
                <Label htmlFor="extraPeople">Number of Extra People</Label>
                <Controller
                  name="extraPeople"
                  control={control}
                  defaultValue=""
                  // rules={{ required:
                  //  "Number of guests is required" }}
                  render={({ field }) => (
                    <Input
                      id="extraPeople"
                      type="number"
                      placeholder="Enter Number of Extra people"
                      invalid={!!errors.extraPeople}
                      {...field}
                      min={1}
                    />
                  )}
                />
                {errors.extraPeople && (
                  <FormFeedback>{errors.extraPeople.message}</FormFeedback>
                )}
              </Col>
            </FormGroup>

            <Button type="submit" disabled={loading} color="primary">
              {loading ? (
                <>
                  Loading...{" "}
                  <Spinner
                    size="sm
                  "
                  />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}

export default ExtendDate;
