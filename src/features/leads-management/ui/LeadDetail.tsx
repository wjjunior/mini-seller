import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowUpIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ChartBarIcon,
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
  isLeadAlreadyConverted?: boolean;
}

const LeadDetail: React.FC<LeadDetailProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdate,
  onConvertToOpportunity,
  isLeadAlreadyConverted = false,
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
    if (lead) {
      reset({
        email: lead.email,
        status: lead.status,
      });
    }
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
    <SlideOver
      isOpen={isOpen}
      onClose={onClose}
      title="Lead Details"
      maxWidth="full"
    >
      {lead && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full flex flex-col"
        >
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-bold text-gray-900 truncate">
                  {lead.name}
                </h3>
                <p className="text-base text-gray-600 font-medium truncate">
                  {lead.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 flex-wrap mb-4">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                  lead.score
                )}`}
              >
                Score: {lead.score}
              </span>
            </div>
            <div className="flex justify-start">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                onClick={() => setIsConvertModalOpen(true)}
                disabled={isLeadAlreadyConverted}
              >
                <ArrowUpIcon className="w-4 h-4 mr-2" />
                Convert to Opportunity
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 py-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <EnvelopeIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-blue-900 uppercase tracking-wide">
                  Contact Information
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="block text-xs font-medium text-blue-700 uppercase tracking-wide mb-2">
                    Email Address
                  </span>
                  {editingField === "email" ? (
                    <div className="space-y-3">
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 border border-blue-200 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        placeholder="Enter email address"
                        disabled={isSubmitting}
                        defaultValue={lead.email}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                          <CheckIcon className="w-4 h-4 mr-2" />
                          {isSubmitting ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={isSubmitting}
                          className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                        >
                          <XMarkIcon className="w-4 h-4 mr-2" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <EnvelopeIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <p className="text-base text-gray-900 font-medium truncate">
                          {lead.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEdit("email")}
                        className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors flex-shrink-0"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <CheckCircleIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-green-900 uppercase tracking-wide">
                  Lead Details
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <span className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-2">
                    Source
                  </span>
                  <p className="text-base text-gray-900 font-medium">
                    {lead.source}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <span className="block text-xs font-medium text-green-700 uppercase tracking-wide mb-2">
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

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 sm:p-6 border border-purple-100">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-900 uppercase tracking-wide">
                  Status
                </span>
              </div>
              {editingField === "status" ? (
                <div className="space-y-3">
                  <select
                    {...register("status")}
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    disabled={isSubmitting}
                    defaultValue={lead.status}
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
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      {isSubmitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-purple-200">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEdit("status")}
                    className="p-2 text-gray-400 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg transition-colors flex-shrink-0"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto"
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
        isLeadAlreadyConverted={isLeadAlreadyConverted}
      />
    </SlideOver>
  );
};

export default LeadDetail;
