import React from "react"
import {
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Col,
  Button,
  FormFeedback
} from "reactstrap"
import { useForm, Controller } from "react-hook-form"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/material_blue.css"

function ExtendDate() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm()

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data)
    // Handle submission (API call, state update, etc.)
  }

  // Set min check-out date based on selected check-in date
  const getCheckOutMinDate = () => {
    const checkInDate = watch("checkInDate")
    if (!checkInDate) return "today"
    const nextDay = new Date(checkInDate)
    nextDay.setDate(nextDay.getDate() + 1)
    return nextDay
  }

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle>Do You Want to Extend Check Out Date?</CardTitle>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup row>
              <Col sm="6" className="mb-1">
                <Label htmlFor="checkInDate">Check In Date</Label>
                <Controller
                  name="checkInDate"
                  control={control}
                  rules={{ required: "Check-in date is required" }}
                  render={({ field }) => (
                    <>
                      <Flatpickr
                        id="checkInDate"
                        className={`form-control ${
                          errors.checkInDate ? "is-invalid" : ""
                        }`}
                        options={{
                          altInput: true,
                          altFormat: "Y-m-d",
                          dateFormat: "Y-m-d",
                          minDate: "today"
                        }}
                        value={field.value}
                        onChange={(date) => {
                          const formatted = date?.[0]
                            ? `${date[0].getFullYear()}-${String(
                                date[0].getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date[0].getDate()
                              ).padStart(2, "0")}`
                            : ""
                          field.onChange(formatted)
                        }}
                        disabled 
                      />
                      {errors.checkInDate && (
                        <FormFeedback>{errors.checkInDate.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>

              <Col sm="6" className="mb-1">
                <Label htmlFor="checkOutDate">Check Out Date</Label>
                <Controller
                  name="checkOutDate"
                  control={control}
                  rules={{ required: "Check-out date is required" }}
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
                          minDate: getCheckOutMinDate()
                        }}
                        value={field.value}
                        onChange={(date) => {
                          const formatted = date?.[0]
                            ? `${date[0].getFullYear()}-${String(
                                date[0].getMonth() + 1
                              ).padStart(2, "0")}-${String(
                                date[0].getDate()
                              ).padStart(2, "0")}`
                            : ""
                          field.onChange(formatted)
                        }}
                      />
                      {errors.checkOutDate && (
                        <FormFeedback>{errors.checkOutDate.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </Col>
            </FormGroup>

            <Button type="submit" color="primary">
              Submit
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  )
}

export default ExtendDate
