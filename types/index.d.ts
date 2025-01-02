import React from "react";

export interface UserParams {
  id?: string;
  name?: string;
  email?: string;
  emailVerified?: string | null;
  password?: string;
  image?: string | null;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface SearchParamsProps {
  searchParams: { [key: string]: string | undefined };
}

export interface AccountImgProps {
  image: string;
  name: string;
}

export interface SettingsCardProps {
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
}
