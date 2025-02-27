import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

import { Button } from "@/components/ui/button";

const UploadButton = ({ onUpload }: { onUpload: (data: any) => void }) => {
  const { CSVReader } = useCSVReader();

  return (
    <CSVReader onUploadAccepted={onUpload}>
      {({ getRootProps }: any) => (
        <Button size="sm" className="w-full lg:w-auto" {...getRootProps()}>
          <Upload className="mr-2 size-4" />
          Import CSV
        </Button>
      )}
    </CSVReader>
  );
};

export default UploadButton;
