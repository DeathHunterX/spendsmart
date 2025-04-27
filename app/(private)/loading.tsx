import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="max-w-screen-2xl flex flex-col items-center justify-center mx-auto h-full">
      <Loader2 className="size-20 text-slate-300 animate-spin" />
      <h3 className="pt-2">Loading...</h3>
    </div>
  );
};

export default Loading;
