import useJwt from "@src/auth/jwt/useJwt";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-blue/theme.css"; // or any other theme
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
function ContractType({
  setContractResponse,
  slipId,
  setContractTypeStatus,
  slipDetails,
  setContractTypeName,
  formData,
  isAssigned,
  isAssignedStatus,
}) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const contractType = watch("contractType");
  const toast = useRef(null);

  useEffect(() => {
    if (contractType) {
      setContractTypeName(contractType);
    }
  }, [contractType, setContractTypeName]);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const startDay = watch("startDay");
  const startMonth = watch("startMonth");
  const startYear = watch("startYear");

  const endDay = watch("endDay");
  const endMonth = watch("endMonth");
  const endYear = watch("endYear");

  let totalDays = null;

  if (startDay && startMonth && startYear && endDay && endMonth && endYear) {
    const startDate = new Date(startYear, months.indexOf(startMonth), startDay);

    const endDate = new Date(endYear, months.indexOf(endMonth), endDay);

    const diffTime = endDate - startDate;

    if (diffTime > 0) {
      totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  const currentYear = new Date().getFullYear();

  const onSubmit = async (data) => {
    try {
      let startDateFormatted = null;
      let endDateFormatted = null;

      const startDate = new Date(
        data.startYear,
        months.indexOf(data.startMonth),
        data.startDay,
      );

      const endDate = new Date(
        data.endYear,
        months.indexOf(data.endMonth),
        data.endDay,
      );

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      startDateFormatted = formatDate(startDate);
      endDateFormatted = formatDate(endDate);
      const payload = {
        startDate: startDateFormatted,
        endDate: endDateFormatted,
        contractType: data.contractType === "short" ? "shortTerm" : "longTerm",
        isOneMonthFree: data.freeRooms || false,
      };

      setLoading(true);

      const slipUid = slipId || slipDetails?.uid;
      const res = await useJwt.longtermContract(slipUid, payload);

      setContractResponse({
        data: res?.data,
        payload: payload,
        totalDays: totalDays,
      });
      if (res?.status == 200) {
        setContractTypeStatus(true);

        toast.current.show({
          severity: "success",
          summary: "Successfully",
          detail: "Contract Saved successfully.",
          life: 2000,
        });
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Failed",
        detail: `${error.response.data.content || "Something went wrong!"}`,
        life: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (totalDays > 31 && contractType === "long") {
      setShowAnimation(true);
    }
  }, [totalDays, contractType]);

  useEffect(() => {
    if (startDay && contractType === "long") {
      setValue("endDay", startDay, { shouldValidate: true });
    } else {
      setValue("endDay", "");
    }
  }, [startDay, setValue]);

  const endYearStart = startYear ? Number(startYear) : currentYear;

  const isEndDateValid = () => {
    if (
      !startDay ||
      !startMonth ||
      !startYear ||
      !endDay ||
      !endMonth ||
      !endYear
    ) {
      return true;
    }

    const startDate = new Date(startYear, months.indexOf(startMonth), startDay);
    const endDate = new Date(endYear, months.indexOf(endMonth), endDay);

    return endDate > startDate || "End date must be after start date";
  };

  const startMonthIndex = months.indexOf(startMonth);

  const filteredEndMonths =
    startYear && endYear && startYear === endYear
      ? months.slice(startMonthIndex)
      : months;

  const filteredEndDays = [...Array(31)]
    .map((_, i) => i + 1)
    .filter((day) => {
      if (startYear === endYear && startMonth === endMonth) {
        return day >= Number(startDay);
      }
      return true;
    });
  useEffect(() => {
    if (contractType === "long" && startDay && startMonth && startYear) {
      const nextMonth = (months.indexOf(startMonth) + 1) % 12;
      const yearAdjustment = months.indexOf(startMonth) === 11 ? 1 : 0;

      setValue("endMonth", months[nextMonth]);
      setValue("endYear", Number(startYear) + yearAdjustment);
    }
  }, [contractType, startDay, startMonth, startYear]);

  useEffect(() => {
    if (!formData) return;
    if (!isAssigned) return;
    const data = formData[0];

    const start = new Date(data?.contractDate);
    const end = new Date(data?.renewalDate);

    const updateData = {
      startDay: start.getDate(),
      startMonth: months[start.getMonth()],
      startYear: start.getFullYear(),

      endDay: end.getDate(),
      endMonth: months[end.getMonth()],
      endYear: end.getFullYear(),
    };

    reset({
      ...updateData,
      contractType: isAssigned.contractType === "longTerm" ? "long" : "short",
    });
  }, [formData, reset]);

  //   useEffect(()=>{
  // if (!isAssigned) return;

  // reset({contractType:isAssigned?.contractType})
  //   },[isAssigned])

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Toast ref={toast} />
        {/* Lottie Overlay */}

        <Row className={"mb-1"}>
          <Col md="12">
            <Label>
              Contract Type <span style={{ color: "red" }}>*</span>
            </Label>

            <Controller
              name="contractType"
              control={control}
              rules={{ required: "Contract Type is required" }}
              render={({ field }) => (
                <Input
                  disabled={isAssignedStatus}
                  type="select"
                  {...field}
                  invalid={!!errors.contractType}
                >
                  <option value="">Select</option>
                  <option value="short">Short Term</option>
                  <option value="long">Long Term</option>
                </Input>
              )}
            />

            <FormFeedback>{errors.contractType?.message}</FormFeedback>
          </Col>
        </Row>

        {/* Start Date */}
        <Row className={"mt-1 mb-1"}>
          <Col md="4">
            <Label>Start Day</Label>
            <Controller
              name="startDay"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  disabled={isAssignedStatus}
                  invalid={!!errors.startDay}
                  type="select"
                  {...field}
                >
                  <option value="">Day</option>
                  {[...Array(31)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.startDay?.message}</FormFeedback>
          </Col>

          <Col md="4">
            <Label>Start Month</Label>
            <Controller
              name="startMonth"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  disabled={isAssignedStatus}
                  invalid={!!errors.startMonth}
                  type="select"
                  {...field}
                >
                  <option value="">Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.startMonth?.message}</FormFeedback>
          </Col>

          <Col md="4">
            <Label>Start Year</Label>
            <Controller
              name="startYear"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  disabled={isAssignedStatus}
                  invalid={!!errors.startYear}
                  type="select"
                  {...field}
                >
                  <option value="">Year</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={currentYear + i}>
                      {currentYear + i}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.startYear?.message}</FormFeedback>
          </Col>
        </Row>

        {/* End Date */}
        <Row>
          <Col md="4">
            <Label>End Day</Label>
            <Controller
              name="endDay"
              control={control}
              rules={{
                required: "Required",
                validate: isEndDateValid,
              }}
              render={({ field }) => (
                <Input
                  invalid={!!errors.endDay}
                  type="select"
                  disabled={contractType === "long" && Boolean(startDay)}
                  {...field}
                >
                  <option value="">Day</option>
                  {filteredEndDays.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.endDay?.message}</FormFeedback>
          </Col>

          <Col md="4">
            <Label>End Month</Label>
            <Controller
              name="endMonth"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  disabled={isAssignedStatus}
                  invalid={!!errors.endMonth}
                  type="select"
                  {...field}
                >
                  <option value="">Month</option>
                  {filteredEndMonths.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </Input>
              )}
            />
            <FormFeedback>{errors.endMonth?.message}</FormFeedback>
          </Col>

          <Col md="4">
            <Label>End Year</Label>
            <Controller
              name="endYear"
              control={control}
              rules={{ required: "Required" }}
              render={({ field }) => (
                <Input
                  disabled={isAssignedStatus}
                  invalid={!!errors.endYear}
                  type="select"
                  {...field}
                >
                  <option value="">Year</option>

                  {[...Array(10)].map((_, i) => {
                    const year = endYearStart + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </Input>
              )}
            />
            <FormFeedback>{errors.endYear?.message}</FormFeedback>
          </Col>
        </Row>

        <Row className="mt-2 mb-2">
          <Col>
            <Button
              type="submit"
              disabled={loading || isAssignedStatus}
              color="primary"
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  Submitting..{" "}
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </Col>
        </Row>
        <hr />
      </Form>
    </>
  );
}

export default ContractType;
