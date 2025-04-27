"use client";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { formModalStore } from "@/stores";
import {
  useDeleteSavingGoal,
  useGetSavingGoals,
} from "@/hooks/api/useSavingGoal";
import {
  DetailSavingGoalCard,
  SavingGoalProgressiveCard,
} from "@/components/shared/card/SavingGoalProgressiveCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConfirm } from "@/hooks/use-confirm";
import Image from "next/image";
import SavingGoalImg from "@/public/images/SavingGoal.png";

const SavingGoalsClient = () => {
  const { onOpen, setType, setTable } = formModalStore();

  const { data: savingGoals, isLoading } = useGetSavingGoals();
  const deleteSavingGoalMutation = useDeleteSavingGoal();

  const isMobile = useIsMobile();

  const [goalId, setGoalId] = useState<string | null>(null);
  const hasInteracted = useRef(false);

  const [ConfirmationDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this saving goal."
  );

  useEffect(() => {
    if (savingGoals && savingGoals.length > 0 && !hasInteracted.current) {
      // Only set the first goal if the user hasn't interacted with the list
      setGoalId(savingGoals[0].id);
    }
  }, [savingGoals]);

  const handleCreateSavingGoal = () => {
    setType("create");
    setTable("saving");
    onOpen();
  };

  const handleGoalSelect = (id: string) => {
    setGoalId(id);
    hasInteracted.current = true;
  };

  const handleDeleteSavingGoal = async (id: string) => {
    const ok = await confirm();

    if (ok) {
      deleteSavingGoalMutation.mutate(id, {
        onSuccess: () => {
          if (savingGoals && savingGoals.length === 0) {
            setGoalId(null);
          }
        },
      });

      console.log(savingGoals);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-screen-2xl mx-auto pb-10">
        <div className="flex lg:flex-row justify-between lg:items-center">
          <h3 className="font-bold text-xl line-clamp-1 py-2">Saving Goals</h3>
          <Button size="sm">
            <Plus className="w-4 h-4" />
            Add new
          </Button>
        </div>
        <div className="">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-2xl mx-auto h-full">
      <div className="flex lg:flex-row justify-between lg:items-center">
        <h3 className="font-bold text-xl line-clamp-1 py-2">Saving Goals</h3>
        <Button size="sm" onClick={handleCreateSavingGoal}>
          <Plus className="w-4 h-4" />
          Add new
        </Button>
      </div>
      {savingGoals && savingGoals.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-x-6 mt-3 max-h-96 h-full">
          <div className="col-span-10 md:col-span-3">
            <div className="flex flex-col gap-y-6">
              {savingGoals?.map((item, idx) => {
                const colors = ["#ff6b81", "#51cf66", "#4dabf7", "#fbc531"];

                return (
                  <SavingGoalProgressiveCard
                    data={item}
                    lineColor={colors[idx % colors.length]}
                    key={item.id}
                    onAction={handleGoalSelect}
                  />
                );
              })}
            </div>
          </div>
          <div className="col-span-7 hidden md:block">
            {goalId !== null && (
              <DetailSavingGoalCard
                id={goalId}
                onDelete={handleDeleteSavingGoal}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full my-auto h-1/2">
          <div className="">
            <Image
              src={SavingGoalImg}
              width={200}
              height={200}
              alt="SavingGoalImg"
            />
          </div>
          <div className="flex flex-col text-center w-1/3">
            <span className="text-wrap">
              Looking to buy a new car, or are you planning to go on a nice
              vacation? Let's create first Saving Goal helps you keep track of
              your progress
            </span>
          </div>
        </div>
      )}

      <ConfirmationDialog />
    </div>
  );
};

export default SavingGoalsClient;
