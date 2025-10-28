import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormFeedback,
  FormGroup,
  Label,
} from "reactstrap";

function HeaderCard({ members, setSelectedMembers }) {
  const {
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ledgerType: "",
    },
  });

  const memberNamewatch = watch("memberName");
  console.log(memberNamewatch);
  setSelectedMembers(memberNamewatch);
  return (
    <div>
      <Card>
        <CardHeader>
 <CardTitle tag="h3" className="mb-1" style={{ fontSize: "20px" }}>
               Ledger
              </CardTitle>{" "}        </CardHeader>
        <CardBody className="pb-2">
          <FormGroup>
            <Label for="memberName">Select Member</Label>
            <Controller
              name="memberName"
              control={control}
              rules={{ required: "Please select a member" }}
              render={({ field }) => (
                <Select
                  {...field}
                  id="memberName"
                  classNamePrefix="select"
                  options={members}
                  placeholder="Select a member"
                  isClearable
                  value={field.value || null}
                  className={errors.memberName ? "is-invalid" : ""}
                />
              )}
            />
            {errors.memberName && (
              <FormFeedback>{errors.memberName.message}</FormFeedback>
            )}
          </FormGroup>
        </CardBody>
      </Card>
    </div>
  );
}

export default HeaderCard;
