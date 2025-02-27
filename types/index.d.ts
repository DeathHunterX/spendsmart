import React from "react";

interface SignInParams {
  email: string;
  password: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

interface AccountImgProps {
  image: string;
  name: string;
}

interface SettingsCardProps {
  type:
    | "id"
    | "photo"
    | "text"
    | "switch"
    | "checkbox"
    | "button"
    | "input-hidden"
    | "status"
    | "table"
    | "select"
    | "custom";
  name: string;
  description?: string;
  data?: string | Object<AccountImgProps> | Object<any> | null;
  children?: React.ReactNode;
  isLast?: boolean;
  btnName?: string;
  variant?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
  customStyling?: string;
  onAction?: (data: any) => void | Promise<any>;
  value?: any;
}
