import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { CreateOpportunityData } from "@/features/leads-management/types";
import { STAGE_OPTIONS } from "@/features/leads-management/types";
import type { Lead } from "@/entities/lead";

const convertLeadSchema = z.object({
  name: z.string().min(1, "Opportunity name is required"),
  stage: z.enum([
    "Prospecting",
    "Qualification",
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost",
  ] as const),
  amount: z.string().optional(),
  accountName: z.string().min(1, "Account name is required"),
});

type ConvertLeadFormData = {
  name: string;
  stage:
    | "Prospecting"
    | "Qualification"
    | "Proposal"
    | "Negotiation"
    | "Closed Won"
    | "Closed Lost";
  amount?: string;
  accountName: string;
};

interface ConvertLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOpportunityData) => Promise<void>;
  lead: Lead | null;
  isLoading?: boolean;
  isLeadAlreadyConverted?: boolean;
}

const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lead,
  isLoading = false,
  isLeadAlreadyConverted = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ConvertLeadFormData>({
    resolver: zodResolver(convertLeadSchema),
    defaultValues: {
      name: "",
      stage: "Prospecting",
      accountName: "",
    },
  });

  useEffect(() => {
    if (lead && isOpen) {
      setValue("name", lead.name);
      setValue("accountName", lead.company);
    }
  }, [lead, isOpen, setValue]);

  const handleFormSubmit = async (data: ConvertLeadFormData) => {
    if (lead) {
      const transformedData: CreateOpportunityData = {
        ...data,
        amount:
          data.amount && data.amount.trim() !== ""
            ? Number(data.amount)
            : undefined,
        leadId: lead.id,
      };
      await onSubmit(transformedData);
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <button
          type="button"
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
          aria-label="Close modal"
        />

        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg mx-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Convert Lead to Opportunity
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {isLeadAlreadyConverted && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Lead Already Converted
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        This lead has already been converted to an opportunity
                        and cannot be converted again.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base text-gray-900 bg-gray-50 cursor-not-allowed"
                  placeholder="Enter opportunity name"
                  disabled={true}
                  readOnly
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="accountName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Name *
                </label>
                <input
                  type="text"
                  id="accountName"
                  {...register("accountName")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base text-gray-900 bg-gray-50 cursor-not-allowed"
                  placeholder="Enter account name"
                  disabled={true}
                  readOnly
                />
                {errors.accountName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.accountName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stage"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Stage *
                </label>
                <select
                  id="stage"
                  {...register("stage")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || isLeadAlreadyConverted}
                >
                  {STAGE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.stage && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.stage.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Amount (Optional)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    {...register("amount")}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount in dollars"
                    disabled={isLoading || isLeadAlreadyConverted}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-500 text-sm">USD</span>
                  </div>
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.amount.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isLeadAlreadyConverted}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Converting..." : "Convert to Opportunity"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConvertLeadModal;
