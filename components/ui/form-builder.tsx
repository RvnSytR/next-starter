"use client";

import { Label } from "./label";

// function getSchema(fields: { name: string; key: FieldType }[]) {
//   return fields.reduce((acc, field) => {
//     acc[field.name] = example[field.key];
//     return acc;
//   }, {} as Record<string, string>);
// }

export function FormBuilder() {
  // const [fields, setFields] = useState<FieldProps[]>([]);

  return (
    <div className="flex gap-x-4">
      <div>
        <Label>TODO</Label>
        {/* {JSON.stringify(fields)} */}
      </div>
    </div>
  );
}
