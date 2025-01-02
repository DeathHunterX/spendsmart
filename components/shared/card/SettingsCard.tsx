import React, { Fragment } from "react";
import {
  ChevronRight,
  Copy,
  LockKeyhole,
  Monitor,
  Moon,
  Share2,
  ShieldEllipsis,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { SettingsCardProps } from "@/types";

const SettingsCard = ({
  type,
  data,
  name,
  description,
  children,
  btnName,
  variant,
  customStyling,
  isLast = false,
}: SettingsCardProps) => {
  return (
    <div className="relative flex border-b-2 border-gray-200 py-6">
      <div className="flex w-full flex-row">
        <div className="w-1/4 items-center">
          <h4 className="font-semibold">{name}</h4>
          <small className="leading-3 text-[#676769]">{description}</small>
        </div>

        <div className="ms-10 w-3/4">
          {/* ============== Customer ID ==================== */}
          {type === "id" && (
            <Fragment>
              <span className="font-semibold">{data?.toString()}</span>
              <div className="mt-2 flex flex-row space-x-3">
                <Button
                  className="h-7 border border-gray-400 bg-white px-3 py-1 text-black hover:bg-gray-300"
                  onClick={() =>
                    navigator.clipboard.writeText(data?.toString())
                  }
                >
                  <Copy />
                  <span className="text-xs">Copy ID</span>
                </Button>
                <Button className="h-7 border border-gray-400 bg-white px-3 py-1 text-black hover:bg-gray-300">
                  <Share2 />
                  <span className="text-xs">Share ID</span>
                </Button>
              </div>
            </Fragment>
          )}

          {/* ============== Avatar ==================== */}
          {type === "photo" && (
            <div className="flex flex-row items-center">
              <Avatar className="size-16">
                <AvatarImage src={data?.image ?? ""} alt={data?.name ?? ""} />
                <AvatarFallback>{data?.name?.[0]}</AvatarFallback>
              </Avatar>

              <Button className="ms-6 h-8 border border-gray-400 bg-white px-3 py-2 text-black hover:bg-gray-300">
                <span className="text-xs">Change</span>
              </Button>
            </div>
          )}

          {/* ============== Text (Input) ==================== */}
          {type === "text" && (
            <div className="font-semibold">
              <span>{data?.toString()}</span>
              <div className="flex items-center pt-4">
                <div className="flex cursor-pointer flex-row">
                  <span className="mr-4 text-xs">Edit</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          )}

          {/* ============== Select ==================== */}
          {type === "select" && (
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun size={16} />
                    <span className="ps-2">Light</span>
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon size={16} />
                    <span className="ps-2">Dark</span>
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Monitor size={16} />
                    <span className="ps-2">System</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* ============== Button ==================== */}
          {type === "button" && (
            <Button
              variant={variant}
              className={
                variant
                  ? ""
                  : customStyling ||
                    "h-10 border border-gray-400 bg-white px-3 py-2 text-black hover:bg-gray-300"
              }
            >
              {btnName}
            </Button>
          )}

          {/* ============== Input Hidden ==================== */}
          {type === "input-hidden" && (
            <div className="font-semibold">
              <div className="relative">
                <LockKeyhole className="absolute bottom-3 left-3" size={18} />
                <Input
                  type="password"
                  disabled
                  value={"*".repeat(35)}
                  className="w-1/3 ps-10"
                />
              </div>
              <Button
                className={
                  customStyling ||
                  "mt-3 h-8 border border-gray-400 bg-white px-3 py-2 text-black hover:bg-gray-300"
                }
              >
                {btnName}
              </Button>
            </div>
          )}

          {/* ============== Status ==================== */}
          {type === "status" && (
            <div className="font-semibold">
              <div className="relative flex flex-row items-center space-x-3">
                <div className="flex size-14 items-center justify-center rounded-full bg-slate-400 bg-gradient-to-br from-slate-300 to-white-100">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white">
                    <ShieldEllipsis size={21} />
                  </div>
                </div>

                <span>Authenticator App</span>
              </div>
              <Button
                className={
                  customStyling ||
                  "mt-3 h-8 border border-gray-400 bg-white px-3 py-2 text-black hover:bg-gray-300"
                }
              >
                {btnName}
              </Button>
            </div>
          )}

          {/* ============== Switch ==================== */}
          {type === "switch" &&
            Array.isArray(data) &&
            data?.map((item) => (
              <div className="flex flex-row space-x-2 pb-8" key={item?.title}>
                <Switch id={item?.title} />
                <div className="grid gap-1.5 pb-1 ps-1 pt-[0.3rem] leading-none">
                  <Label
                    htmlFor={item?.title}
                    className="items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item?.title}
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    {item?.description}
                  </p>
                </div>
              </div>
            ))}
          {/* ============== Checkbox ==================== */}
          {type === "checkbox" &&
            Array.isArray(data) &&
            data?.map((item) => (
              <div className="flex flex-row space-x-2 pb-4" key={item?.title}>
                <Checkbox id={item?.title} />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor={item?.title}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item?.title}
                  </Label>

                  <p className="text-sm text-muted-foreground">
                    {item?.description}
                  </p>
                </div>
              </div>
            ))}

          {/* ============== Other ==================== */}
          {type === "custom" && <Fragment>{children}</Fragment>}
        </div>
      </div>
    </div>
  );
};

export default SettingsCard;
