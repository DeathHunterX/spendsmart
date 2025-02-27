"use client";

import FormModal from "./FormModal";
import { useFormModal } from "@/hooks/use-form-modal";
import { useGetWalletById, useGetWallets } from "@/hooks/api/useWallet";
import { useGetCategories, useGetCategoryById } from "@/hooks/api/useCategory";
import { UseQueryResult } from "@tanstack/react-query";
import { useGetTransactionById } from "@/hooks/api/useTransaction";

const titleDescriptionMap = {
  wallet: {
    create: { title: "New Wallet", description: "Add your wallet here." },
    update: {
      title: "Edit Wallet",
      description:
        "Make changes to your wallet here. Click save when you're done.",
    },
  },
  transaction: {
    create: {
      title: "New Transaction",
      description: "Add your transaction here.",
    },
    update: {
      title: "Edit Transaction",
      description:
        "Make changes to your transaction. Click save when you're done.",
    },
  },
  category: {
    create: { title: "New Category", description: "Add your category here." },
    update: {
      title: "Edit Category",
      description:
        "Make changes to your category. Click save when you're done.",
    },
  },
};

const FormContainer = () => {
  const { table, type, id } = useFormModal();
  const isUpdate = type === "update";

  // Always call primary query hooks but control their behavior with 'enabled'
  const walletQuery = useGetWalletById(id ?? "", {
    enabled: table === "wallet" && isUpdate && !!id,
  });
  const categoryQuery = useGetCategoryById(id ?? "", {
    enabled: table === "category" && isUpdate && !!id,
  });
  const transactionQuery = useGetTransactionById(id ?? "", {
    enabled: table === "transaction" && isUpdate && !!id,
  });

  const categoryListQuery = useGetCategories();
  const walletListQuery = useGetWallets();

  // Primary query results (only wallet or category)
  const primaryQueryResults: {
    wallet: UseQueryResult<any>;
    category: UseQueryResult<any>;
    transaction: UseQueryResult<any>;
  } = {
    wallet: walletQuery,
    category: categoryQuery,
    transaction: transactionQuery,
  };

  // Map related query results
  const relatedQueryResults = {
    transaction: [
      {
        key: "categoryList",
        data: categoryListQuery.data || [],
        isLoading: categoryListQuery.isLoading,
      },
      {
        key: "walletList",
        data: walletListQuery.data || [],
        isLoading: walletListQuery.isLoading,
      },
    ],
  };

  // Safely access primary query data and loading state based on the table type
  const primaryResult =
    table === "wallet" || table === "category" || table === "transaction"
      ? primaryQueryResults[table]
      : null;

  const relatedQueries =
    table === "transaction" ? relatedQueryResults.transaction : [];

  const relatedData = Object.fromEntries(
    relatedQueries.map(({ key, data }) => [key, data])
  );

  const { data, isLoading: isPrimaryLoading } = primaryResult || {
    data: null,
    isLoading: false,
  };

  const isRelatedLoading = relatedQueries.some((query: any) => query.isLoading);

  const { title, description } = titleDescriptionMap[table]?.[type] || {
    title: "",
    description: "",
  };

  const isLoading = isPrimaryLoading || isRelatedLoading;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FormModal
        table={table}
        type={type}
        id={id}
        data={data}
        relatedData={relatedData}
        title={title}
        description={description}
      />
    </div>
  );
};

export default FormContainer;
