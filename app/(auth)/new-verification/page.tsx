"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { BeatLoader } from "react-spinners";
import AuthPageWrapper from "@/components/shared/wrapper/AuthPageWrapper";
import { AUTH_ROUTES } from "@/constants/routes";
import { verifyEmailByToken } from "@/lib/actions/auth/verificationToken.action";
import { toast } from "@/hooks/use-toast";
import { BadgeCheck, BadgeX } from "lucide-react";

const NewVerificationPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState({
    success: false,
    status: 200,
    error: "",
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (!token) {
      toast({
        title: `Authentication Error!`,
        description: "Missing authentication token. Please log in to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      await verifyEmailByToken(token).then((data: any) => {
        setLoading(false);
        if (data?.success) {
          setResponse({ ...response, success: true, status: data?.status });
          toast({
            title: "Verification Successful",
            description: "Your token has been successfully verified!",
          });
        } else {
          setResponse({
            ...response,
            success: false,
            status: data?.status,
            error: data?.error?.message,
          });
          toast({
            title: `Error ${data?.status}`,
            description: data?.error?.message,
            variant: "destructive",
          });
        }
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: `Client error`,
        description: "There is something wrong!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthPageWrapper
      title="Account Verification!"
      description="Confirming your verification"
    >
      <div className="flex w-full flex-col items-center justify-center space-y-4">
        {loading ? (
          <BeatLoader />
        ) : response.success ? (
          <>
            <BadgeCheck color="#00e00f" />
            <p className="text-sm leading-relaxed">
              <Link href={AUTH_ROUTES.SIGN_IN} className="paragraph-semibold">
                Back to Sign in
              </Link>
            </p>
          </>
        ) : response.success === false && response.error.length > 0 ? (
          <>
            <BadgeX color="#e00000" size={48} />
            <p>{response.error}</p>
            <p className="pt-12 text-sm leading-relaxed">
              <Link href={AUTH_ROUTES.SIGN_UP} className="paragraph-semibold">
                Back to Sign up
              </Link>
            </p>
          </>
        ) : (
          <>
            <BadgeX color="#e00000" size={48} />
            <p>There is something wrong!</p>
            <p className="text-sm leading-relaxed">
              <Link href={AUTH_ROUTES.SIGN_UP} className="paragraph-semibold">
                Back to Sign up
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthPageWrapper>
  );
};

export default NewVerificationPage;
