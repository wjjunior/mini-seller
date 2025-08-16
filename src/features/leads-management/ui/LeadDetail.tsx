import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import type { Lead } from "@/entities/lead";
import { SlideOver } from "@/shared/ui";
import { ConvertLeadModal } from "./opportunities";
import { getStatusColor, getScoreColor } from "../lib/helpers";
import { leadEditSchema, type LeadEditFormData } from "../lib/validation";
import type { CreateOpportunityData } from "@/features/leads-management/types";

interface LeadDetailProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (leadId: string, data: LeadEditFormData) => Promise<void>;
  onConvertToOpportunity?: (data: CreateOpportunityData) => Promise<void>;
}

const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate,
  onConvertToOpportunity,
}) => {
  const [editingField, setEditingField] = useState<"email" | "status" | null>(
    null
  );
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<LeadEditFormData>({
    resolver: zodResolver(leadEditSchema),
    defaultValues: {
      email: lead?.email || "",
      status: lead?.status || "new",
    },
  });

  useEffect(() => {
    if (lead) {
      setValue("email", lead.email);
      setValue("status", lead.status);
    }
  }, [lead, setValue]);

  const handleEdit = (field: "email" | "status") => {
    setEditingField(field);

    if (lead) {
      reset({
        email: lead.email,
        status: lead.status,
      });
    }
  };

  const handleCancel = () => {
    setEditingField(null);
    reset();
  };

  const onSubmit = async (data: LeadEditFormData) => {
    if (lead && onUpdate) {
      try {
        await onUpdate(lead.id, data);
        setEditingField(null);
      } catch (error) {
        console.error("Failed to update lead:", error);
      }
    }
  };

  const statusOptions = [
    { value: "new", label: "New" },
    { value: "contacted", label: "Contacted" },
    { value: "qualified", label: "Qualified" },
    { value: "disqualified", label: "Disqualified" },
  ];

  return (
    <SlideOver isOpen={isOpen} onClose={onClose} title="Lead Details">
      {lead && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {lead.name}
            </h3>
            <p className="text-lg text-gray-600 font-medium">{lead.company}</p>
          </div>

          <div className="space-y-6 py-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Contact Information
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Email Address
                  </span>
                  {editingField === "email" ? (
                    <div className="space-y-2">
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          {isSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XMarkIcon className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-base text-gray-900 font-medium">
                        {lead.email}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleEdit("email")}
                        className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Lead Details
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Source
                  </span>
                  <p className="text-base text-gray-900 font-medium">
                    {lead.source}
                  </p>
                </div>
                <div>
                  <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Score
                  </span>
                  <p
                    className={`text-lg font-bold ${getScoreColor(lead.score)}`}
                  >
                    {lead.score}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </span>
              </div>
              {editingField === "status" ? (
                <div className="space-y-2">
                  <select
                    {...register("status")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <p className="text-sm text-red-600">
                      {errors.status.message}
                    </p>
                  )}
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckIcon className="w-4 h-4 mr-1" />
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex px-3 py-2 text-sm font-semibold rounded-full ${getStatusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit("status")}
                    className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              onClick={() => setIsConvertModalOpen(true)}
            >
              <ArrowUpIcon className="w-4 h-4 mr-2" />
              Convert Lead
            </button>
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      )}

      <ConvertLeadModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        onSubmit={onConvertToOpportunity || (() => Promise.resolve())}
        lead={lead}
      />
    </SlideOver>
  );
};

export default LeadDetail;
